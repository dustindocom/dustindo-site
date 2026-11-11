// Builds data/charts.json for VA by DD. Runs in GitHub Actions every 6 hours (Node 20+, no dependencies).
// The data lives on the `charts` branch, not main: the workflow checks that branch out into va/data,
// runs this script, and commits the result there. The app reads it from that branch on raw.githubusercontent.com.
// charts.json is a growing library, not a snapshot. Each run:
//   1. loads the previous charts.json, so no song is ever lost
//   2. refreshes the hot chart from Apple's "most played" top 100 and logs each song's days on the chart
//   3. crawls a batch of artists by decade and genre, so older music is in the mix, not just what charts now
//   4. with LASTFM_KEY: tags songs with a style and mood (see vocab.mjs), and records listeners and plays per listener
//   5. counts karaoke and tribute versions of the biggest songs (a sign people love to sing them)
//   6. scores the perennial lists: All-time, Evergreens, On repeat, Singalongs
// data/crawl.json remembers every request already made, so a run never repeats one until it is due again.
// When Apple has both a clean and an explicit version of a song, only the clean one is kept. Explicit songs carry e:1.
//
// Song fields: id t a art prev url | g genre, gn Apple genre name, st styles, md moods | y dec era | e explicit
//   ls Last.fm listeners, rp plays per listener, kv karaoke/tribute versions, vn versions by the artist,
//   cd days on the hot chart, ce times it came back to the chart, ev evergreen score, r rank within its search
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { STYLES, mapTags, appVocab } from './vocab.mjs';

const COUNTRY = process.env.CHART_COUNTRY || 'us';
const LASTFM_KEY = process.env.LASTFM_KEY || '';
const BUDGET = +process.env.CRAWL_BUDGET || 45; // artist searches per run (iTunes allows about 20 a minute)
const KV_BUDGET = +process.env.KV_BUDGET || 40; // karaoke searches per run
const TRACK_BUDGET = +process.env.TRACK_BUDGET || 300; // Last.fm song lookups per run
const ARTIST_TAG_BUDGET = 100;
const LFM_TAGS_PER_RUN = 2;
const PER_ARTIST = 6;
const PER_GENRE = 15;
const RECRAWL_DAYS = 90; // an artist is searched again after this long
const RETAG_DAYS = 60; // a song's Last.fm tags and counts are refreshed after this long
const LFM_REFRESH_DAYS = 7;
const MAX_SONGS = 15000;
const ERA_CUTOFF = 2000;
const DATA = new URL('../data/', import.meta.url);
const TODAY = Math.floor(Date.now() / 864e5);
const THIS_YEAR = new Date().getFullYear();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const J = async (url) => {
  let status = 0;
  for (let i = 0; i < 3; i++) {
    const res = await fetch(url, { headers: { 'user-agent': 'va-by-dd-chart-builder' } });
    if (res.ok) return res.json();
    status = res.status;
    await sleep(4000 * (i + 1));
  }
  const e = new Error(`request failed (${status}): ${url.replace(/api_key=\w+/, 'api_key=…')}`);
  e.status = status;
  throw e;
};
const throttled = (gap, base) => {
  let last = 0;
  return async (path) => {
    const wait = last + gap - Date.now();
    if (wait > 0) await sleep(wait);
    last = Date.now();
    return J(base + path);
  };
};
const itunes = throttled(3200, 'https://itunes.apple.com/');
const lfmGet = throttled(250, 'https://ws.audioscrobbler.com/2.0/?format=json&api_key=' + LASTFM_KEY + '&');
const lastfm = async (q) => {
  const d = await lfmGet(q);
  if (d && d.error) { const e = new Error('Last.fm: ' + d.message); e.lfm = d.error; throw e; }
  return d;
};

/* ---------- genres, decades, song keys ---------- */
const GMAP = [
  [/hip.?hop|rap/i, 'hip'], [/r&b|soul/i, 'rnb'], [/country|folk|americana|bluegrass/i, 'ctry'],
  [/electronic|dance(?!hall)|house|techno|edm/i, 'elec'], [/latin|reggaeton|urbano|salsa|bachata/i, 'lat'],
  [/jazz|funk|blues/i, 'jazz'], [/afro|reggae|dancehall|world/i, 'afro'], [/rock|alternative|metal|punk/i, 'rock'], [/pop|indie/i, 'pop'],
];
const matchGenre = (n = '') => { for (const [re, k] of GMAP) if (re.test(n)) return k; return null; };
export const genreKey = (n = '') => matchGenre(n) || 'pop';
const GENRES = ['pop', 'hip', 'rnb', 'elec', 'rock', 'lat', 'jazz', 'afro', 'ctry'];
const TAGS = { hip: 'hip-hop', rnb: 'rnb', elec: 'electronic', pop: 'pop', rock: 'rock', lat: 'latin', jazz: 'jazz', afro: 'afrobeats', ctry: 'country' };
const DECADE_TAGS = ['60s', '70s', '80s', '90s', '00s', '2010s'];
const DECS = ['50s', '60s', '70s', '80s', '90s', '00s', '10s', '20s'];
const decOf = (y) => (y < 1960 ? '50s' : String((Math.floor(y / 10) * 10) % 100).padStart(2, '0') + 's');
const decStart = (d) => (d === '50s' ? 1950 : +d.slice(0, 2) + (+d.slice(0, 2) < 50 ? 2000 : 1900));
const eraOf = (y) => (y < ERA_CUTOFF ? 'classics' : 'modern');
const yearOf = (r) => +String(r.releaseDate || '').slice(0, 4) || 0;
const bigArt = (u = '') => u.replace(/\d+x\d+(bb)?(?=\.)/, '300x300bb');

const nk = (s = '') => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/\(.*?\)|\[.*?\]/g, '').replace(/\s-\s.*$/, '').replace(/[^a-z0-9]/g, '');
const primaryArtist = (a = '') => a.split(/\s*(?:,|&|\+|\bfeat\.?|\bft\.?|\bfeaturing\b|\bwith\b|\sx\s)\s*/i)[0];
const keyOf = (artist, title) => nk(primaryArtist(artist)) + '|' + nk(title);
const baseTitle = (t = '') => t.replace(/\s*[(\[].*$/, '').replace(/\s-\s.*$/, '').trim();
const SEP = /^\s*(,|&|\+|feat\.?|ft\.?|featuring|with|x|and)\s/i;
const byArtist = (name, seed) => {
  const a = name.toLowerCase(), s = seed.toLowerCase();
  return nk(a) === nk(s) || (a.startsWith(s) && SEP.test(a.slice(s.length) + ' '));
};
const JUNK_TRACK = /[(\[-][^)\]]*\b(live|remix|mix|instrumental|karaoke|sped up|slowed|acoustic|demo)\b/i;
const JUNK_ALBUM = /karaoke|tribute|lullaby|8-?bit|in the style of|\(live\)|\blive (at|from|in)\b/i;
const COMPILATION = /greatest|hits|best of|collection|essential|anthology|remaster|deluxe|anniversary|\bgold\b|number ones|#1s|platinum|legend|definitive|ultimate/i;

export const usable = (r) => r && r.kind === 'song' && r.trackId && r.previewUrl;
const clean = (r) => usable(r) && !JUNK_TRACK.test(r.trackName || '') && !JUNK_ALBUM.test(r.collectionName || '');

export const toSong = (r, o = {}) => {
  const s = {
    id: String(r.trackId), t: r.trackName, a: r.artistName, art: bigArt(r.artworkUrl100),
    prev: r.previewUrl, url: r.trackViewUrl, g: matchGenre(r.primaryGenreName) || o.g || 'pop', r: o.r ?? 9,
  };
  if (r.primaryGenreName) s.gn = r.primaryGenreName;
  if (r.trackExplicitness === 'explicit') s.e = 1;
  const y = o.y ?? yearOf(r);
  if (y) Object.assign(s, { y, dec: decOf(y), era: eraOf(y) });
  else if (o.dec) Object.assign(s, { dec: o.dec, era: eraOf(decStart(o.dec)) });
  if (o.vn) s.vn = o.vn;
  return s;
};

/* Several results for one song (single, album, compilation, clean, explicit): keep the clean one and the earliest year. */
function pickVersion(group) {
  const best = group.find((r) => clean(r) && r.trackExplicitness !== 'explicit') || group.find(clean) || group[0];
  const ys = group.map(yearOf).filter(Boolean);
  return { r: best, y: ys.length ? Math.min(...ys) : 0 };
}
function groupByKey(results) {
  const groups = new Map();
  for (const r of results) {
    const k = keyOf(r.artistName, r.trackName);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }
  return groups;
}

/* ---------- the library ---------- */
const CARRY = ['y', 'dec', 'era', 'gn', 'st', 'md', 'ls', 'rp', 'kv', 'vn', 'cd', 'ce'];
class Library {
  constructor(songs = []) {
    this.byId = new Map(); this.byKey = new Map(); this.alias = new Map(); this.added = 0;
    for (const s of songs) this.put(s, true);
  }
  has(key) { return this.byKey.has(key); }
  get(key) { return this.byKey.get(key); }
  key(s) { return keyOf(s.a, s.t); }
  id(id) { while (this.alias.has(id)) id = this.alias.get(id); return this.byId.has(id) ? id : null; }
  put(s, loading = false) {
    const k = keyOf(s.a, s.t);
    const old = this.byKey.get(k);
    if (!old) {
      this.byId.set(s.id, s); this.byKey.set(k, s);
      if (!loading) this.added++;
      return s;
    }
    let keep = old;
    if (old.id === s.id) Object.assign(old, { prev: s.prev, url: s.url, art: s.art || old.art }); // fresh links
    else if (old.e && !s.e) { // a clean version turned up: it replaces the explicit one
      keep = { ...s };
      this.byId.delete(old.id); this.byId.set(keep.id, keep); this.byKey.set(k, keep); this.alias.set(old.id, keep.id);
      for (const f of CARRY) if (keep[f] == null && old[f] != null) keep[f] = old[f];
    }
    const other = keep === old ? s : old;
    if (other.y && (!keep.y || other.y < keep.y)) Object.assign(keep, { y: other.y, dec: decOf(other.y), era: eraOf(other.y) });
    else if (!keep.dec && other.dec) Object.assign(keep, { dec: other.dec, era: other.era });
    if (other.vn > (keep.vn || 0)) keep.vn = other.vn;
    keep.r = Math.min(old.r ?? 9, s.r ?? 9);
    return keep;
  }
}

/* ---------- 1. hot chart, with a running history of days on the chart ---------- */
async function hotChart(lib) {
  const feed = await J(`https://rss.marketingtools.apple.com/api/v2/${COUNTRY}/music/most-played/100/songs.json`);
  const ids = (feed.feed?.results || []).map((x) => String(x.id));
  const out = [];
  for (let i = 0; i < ids.length; i += 100) {
    const d = await itunes(`lookup?country=${COUNTRY}&id=${ids.slice(i, i + 100).join(',')}`);
    const by = new Map((d.results || []).filter(usable).map((r) => [String(r.trackId), r]));
    for (const id of ids.slice(i, i + 100)) {
      const r = by.get(id);
      if (!r) continue;
      const s = lib.put(toSong(r, { r: 0 }));
      if (!out.includes(s.id)) out.push(s.id);
    }
  }
  return out;
}
// hist[key] = [days on chart, first day, last day, times it came back after 7+ days away, months seen as a bitmask]
function logChart(lib, hot, crawl) {
  const month = new Date().getMonth();
  for (const id of hot) {
    const s = lib.byId.get(id), k = lib.key(s);
    const h = crawl.hist[k] || [0, TODAY, -1, 0, 0];
    if (h[2] !== TODAY) {
      if (h[0] && TODAY - h[2] > 7) h[3]++;
      h[0]++; h[2] = TODAY;
    }
    h[4] |= 1 << month;
    crawl.hist[k] = h;
  }
  for (const s of lib.byId.values()) {
    const h = crawl.hist[lib.key(s)];
    if (h) { s.cd = h[0]; if (h[3]) s.ce = h[3]; else delete s.ce; }
  }
}

/* Songs from older runs that have no release year yet get one from a cheap batch lookup. */
async function backfillYears(lib) {
  const need = [...lib.byId.values()].filter((s) => (!s.y || !s.gn) && !s.ny && /^\d+$/.test(s.id)).slice(0, 300);
  for (let i = 0; i < need.length; i += 100) {
    const chunk = need.slice(i, i + 100);
    const d = await itunes(`lookup?country=${COUNTRY}&id=${chunk.map((s) => s.id).join(',')}`);
    const by = new Map((d.results || []).map((r) => [String(r.trackId), r]));
    for (const s of chunk) {
      const r = by.get(s.id), y = r && yearOf(r);
      if (!r) { s.ny = 1; continue; }
      if (r.primaryGenreName) { s.gn = r.primaryGenreName; s.g = matchGenre(s.gn) || s.g; }
      if (!s.y && y) Object.assign(s, { y, dec: decOf(y), era: eraOf(y) });
      if (r.trackExplicitness === 'explicit') s.e = 1;
      if (!s.y) s.ny = 1;
    }
  }
}

/* ---------- 2. artist crawl by decade and genre ---------- */
// Each run takes the next BUDGET artists that are due, round-robin across the cells so every run is a mix.
const SEEDS = {
  '50s pop': 'Elvis Presley|Doris Day|Paul Anka|The Everly Brothers|Dean Martin',
  '50s rock': 'Chuck Berry|Buddy Holly|Little Richard|Jerry Lee Lewis|Bill Haley & His Comets|Fats Domino',
  '50s rnb': 'Ray Charles|Sam Cooke|The Platters|Etta James|Jackie Wilson',
  '50s jazz': 'Miles Davis|Ella Fitzgerald|Louis Armstrong|Dave Brubeck|Nat King Cole|Frank Sinatra',
  '50s lat': 'Tito Puente|Celia Cruz|Pérez Prado|Ritchie Valens',
  '50s ctry': 'Hank Williams|Johnny Cash|Patsy Cline|Patti Page',
  '60s pop': 'The Beatles|The Beach Boys|The Supremes|Dusty Springfield|The Monkees|Simon & Garfunkel',
  '60s rock': 'The Rolling Stones|The Who|Jimi Hendrix|The Doors|The Kinks|Creedence Clearwater Revival',
  '60s rnb': 'Aretha Franklin|Marvin Gaye|Otis Redding|The Temptations|Stevie Wonder|James Brown',
  '60s jazz': 'John Coltrane|Nina Simone|Stan Getz|Herbie Hancock|Wes Montgomery',
  '60s lat': 'Sérgio Mendes|Antônio Carlos Jobim|Santana|Eddie Palmieri',
  '60s afro': 'Miriam Makeba|Desmond Dekker|Toots & The Maytals|The Skatalites',
  '60s ctry': 'Bob Dylan|Loretta Lynn|Merle Haggard|Glen Campbell|The Byrds',
  '70s pop': 'ABBA|Elton John|Fleetwood Mac|Carpenters|Bee Gees|Olivia Newton-John',
  '70s rock': 'Led Zeppelin|Queen|Pink Floyd|Eagles|Aerosmith|David Bowie',
  '70s rnb': 'Earth, Wind & Fire|Al Green|Bill Withers|Barry White|The Isley Brothers|Chaka Khan',
  '70s elec': 'Donna Summer|Kraftwerk|Chic|Giorgio Moroder',
  '70s jazz': 'Parliament|Kool & The Gang|George Benson|Weather Report|Grover Washington, Jr.',
  '70s hip': 'The Sugarhill Gang|Kurtis Blow',
  '70s lat': 'Héctor Lavoe|Willie Colón|Rubén Blades|Fania All Stars',
  '70s afro': 'Bob Marley & The Wailers|Fela Kuti|Jimmy Cliff|Manu Dibango',
  '70s ctry': 'Dolly Parton|Willie Nelson|John Denver|Waylon Jennings|Kenny Rogers',
  '80s pop': 'Michael Jackson|Madonna|Prince|Whitney Houston|Cyndi Lauper|Wham!|Lionel Richie',
  '80s rock': 'Bon Jovi|Guns N\' Roses|U2|The Police|Journey|Def Leppard|Mötley Crüe',
  '80s rnb': 'Luther Vandross|Janet Jackson|Anita Baker|Sade|New Edition',
  '80s hip': 'Run-DMC|LL Cool J|Public Enemy|Beastie Boys|Salt-N-Pepa|Eric B. & Rakim',
  '80s elec': 'New Order|Depeche Mode|Pet Shop Boys|Eurythmics|a-ha',
  '80s lat': 'Gloria Estefan|Juan Gabriel|Julio Iglesias|Los Lobos',
  '80s afro': 'UB40|Yellowman|Peter Tosh|Steel Pulse',
  '80s ctry': 'Reba McEntire|George Strait|Alabama|Randy Travis',
  '90s pop': 'Mariah Carey|Backstreet Boys|Britney Spears|Spice Girls|Celine Dion|TLC',
  '90s rock': 'Nirvana|Pearl Jam|Red Hot Chili Peppers|Oasis|Green Day|Radiohead',
  '90s rnb': 'Boyz II Men|Lauryn Hill|Aaliyah|Mary J. Blige|Destiny\'s Child|Brandy',
  '90s hip': '2Pac|The Notorious B.I.G.|Dr. Dre|Snoop Dogg|OutKast|A Tribe Called Quest',
  '90s elec': 'Daft Punk|The Prodigy|Fatboy Slim|Moby|Robin S.',
  '90s lat': 'Selena|Ricky Martin|Shakira|Marc Anthony|Enrique Iglesias',
  '90s afro': 'Shaggy|Shabba Ranks|Beenie Man|Chaka Demus & Pliers',
  '90s jazz': 'Diana Krall|Kenny G|Buena Vista Social Club',
  '90s ctry': 'Garth Brooks|Shania Twain|Faith Hill|Tim McGraw|The Chicks',
  '00s pop': 'Beyoncé|Kelly Clarkson|Justin Timberlake|Rihanna|Lady Gaga|Christina Aguilera',
  '00s rock': 'Coldplay|Linkin Park|The Killers|Foo Fighters|Kings of Leon|The White Stripes',
  '00s rnb': 'Alicia Keys|Ne-Yo|Usher|Ciara|John Legend|Amy Winehouse',
  '00s hip': 'Eminem|Kanye West|JAY-Z|50 Cent|Missy Elliott|Lil Wayne',
  '00s elec': 'David Guetta|Basement Jaxx|The Chemical Brothers|Justice',
  '00s lat': 'Daddy Yankee|Juanes|Don Omar|Wisin & Yandel|Aventura',
  '00s afro': 'Sean Paul|Damian Marley|Sizzla',
  '00s jazz': 'Norah Jones|Michael Bublé|Jamie Cullum',
  '00s ctry': 'Carrie Underwood|Kenny Chesney|Rascal Flatts|Brad Paisley',
  '10s pop': 'Taylor Swift|Adele|Bruno Mars|Ed Sheeran|Katy Perry|Ariana Grande',
  '10s rock': 'Imagine Dragons|Arctic Monkeys|Twenty One Pilots|Tame Impala|Florence + The Machine',
  '10s rnb': 'The Weeknd|Frank Ocean|SZA|H.E.R.|Miguel',
  '10s hip': 'Drake|Kendrick Lamar|J. Cole|Travis Scott|Nicki Minaj|Post Malone',
  '10s elec': 'Avicii|Calvin Harris|Marshmello|Kygo|Disclosure|Zedd',
  '10s lat': 'J Balvin|Bad Bunny|Ozuna|Luis Fonsi|Maluma',
  '10s afro': 'Wizkid|Burna Boy|Davido|Mr Eazi',
  '10s jazz': 'Kamasi Washington|Gregory Porter|Esperanza Spalding',
  '10s ctry': 'Luke Combs|Chris Stapleton|Kacey Musgraves|Florida Georgia Line|Luke Bryan',
  '20s pop': 'Dua Lipa|Olivia Rodrigo|Harry Styles|Doja Cat|Billie Eilish|Sabrina Carpenter',
  '20s rock': 'Måneskin|Hozier|Paramore|Turnstile',
  '20s rnb': 'Summer Walker|Giveon|Victoria Monét|Brent Faiyaz|Jorja Smith',
  '20s hip': 'Lil Baby|Megan Thee Stallion|Jack Harlow|Ice Spice|Doechii',
  '20s elec': 'Fred again..|Peggy Gou|FISHER|Charli xcx',
  '20s lat': 'KAROL G|Peso Pluma|Rauw Alejandro|Feid',
  '20s afro': 'Tems|Rema|Tyla|Asake',
  '20s jazz': 'Samara Joy|Laufey',
  '20s ctry': 'Morgan Wallen|Zach Bryan|Lainey Wilson|Jelly Roll',
};
function seedQueue() {
  const cells = Object.entries(SEEDS).map(([cell, list]) => {
    const [dec, g] = cell.split(' ');
    return list.split('|').map((artist) => ({ dec, g, artist, id: `${dec}|${g}|${artist}` }));
  });
  const out = [];
  for (let i = 0; cells.some((c) => i < c.length); i++) for (const c of cells) if (c[i]) out.push(c[i]);
  return out;
}

async function crawlArtist(lib, seed) {
  const d = await itunes(`search?media=music&entity=song&attribute=artistTerm&country=${COUNTRY}&limit=50&term=${encodeURIComponent(seed.artist)}`);
  const mine = (d.results || []).filter((r) => usable(r) && byArtist(r.artistName, seed.artist));
  let rank = 0, added = 0;
  for (const group of groupByKey(mine).values()) {
    if (rank >= PER_ARTIST) break;
    if (!group.some(clean)) continue; // only live takes, remixes or karaoke: skip
    const { r, y } = pickVersion(group);
    let year = y;
    // A greatest-hits or remaster date two or more decades after the artist's era is a reissue, not the original.
    if (year && year >= decStart(seed.dec) + 20 && group.every((x) => COMPILATION.test(x.collectionName || ''))) year = 0;
    const before = lib.added;
    // vn: how many releases of this song the artist has (album, singles, hits sets, live, remasters)
    lib.put(toSong(r, { g: seed.g, r: rank, y: year, dec: year ? null : seed.dec, vn: group.length }));
    added += lib.added - before;
    rank++;
  }
  return added;
}

/* ---------- 3. Last.fm: listeners, plays per listener, styles and moods ---------- */
async function artistStyles(name, crawl) {
  const k = nk(primaryArtist(name));
  const c = crawl.art[k];
  if (c && TODAY - c.d < RECRAWL_DAYS * 2) return c.st;
  if (crawl._artBudget-- <= 0) return null;
  let st = [];
  try {
    const d = await lastfm(`method=artist.gettoptags&autocorrect=1&artist=${encodeURIComponent(primaryArtist(name))}`);
    const tags = (d.toptags?.tag || []).filter((t) => +t.count >= 10).map((t) => t.name);
    st = mapTags(tags, 2, 0).st;
  } catch (e) { if (!e.lfm) throw e; }
  crawl.art[k] = { d: TODAY, st };
  return st;
}
async function tagSongs(lib, hot, crawl) {
  crawl._artBudget = ARTIST_TAG_BUDGET;
  const hotSet = new Set(hot);
  const due = [...lib.byId.values()].filter((s) => TODAY - (crawl.tg[lib.key(s)] ?? -1e9) >= RETAG_DAYS)
    .sort((a, b) => (hotSet.has(b.id) - hotSet.has(a.id)) || ((a.r ?? 9) - (b.r ?? 9)))
    .slice(0, TRACK_BUDGET);
  let n = 0;
  for (const s of due) {
    try {
      const d = await lastfm(`method=track.getinfo&autocorrect=1&artist=${encodeURIComponent(primaryArtist(s.a))}&track=${encodeURIComponent(baseTitle(s.t))}`);
      const tr = d.track || {};
      const ls = +tr.listeners || 0, pc = +tr.playcount || 0;
      if (ls) { s.ls = ls; s.rp = Math.round((pc / ls) * 10) / 10; }
      const { st, md } = mapTags((tr.toptags?.tag || []).map((t) => t.name));
      if (md.length) s.md = md; else delete s.md;
      s.st = st.length ? st : (await artistStyles(s.a, crawl)) || s.st || [];
      if (!s.st.length) delete s.st;
      // Apple's genre name was too general to place the song (Soundtrack, Singer/Songwriter...): let the style decide.
      if (s.st && !matchGenre(s.gn)) s.g = STYLES[s.st[0]][1];
      n++;
    } catch (e) {
      if (!e.lfm) { console.warn('Last.fm stopped:', e.message); break; }
    }
    crawl.tg[lib.key(s)] = TODAY;
  }
  delete crawl._artBudget;
  console.log(`Last.fm: tagged ${n} songs`);
}

// Last.fm genre and decade tag charts: finds well-loved songs the artist crawl missed, and feeds "hot in genre".
async function resolve(t) {
  const d = await itunes(`search?media=music&entity=song&country=${COUNTRY}&limit=10&term=${encodeURIComponent(t.a + ' ' + t.t)}`);
  const want = keyOf(t.a, t.t);
  const group = (d.results || []).filter((r) => usable(r) && keyOf(r.artistName, r.trackName) === want);
  return group.some(clean) ? pickVersion(group) : null;
}
async function crawlLastfmTags(lib, crawl) {
  const all = [...Object.entries(TAGS).map(([g, tag]) => ({ g, tag })), ...DECADE_TAGS.map((tag) => ({ tag }))];
  const due = all.filter((x) => TODAY - (crawl.lfm[x.tag]?.day || 0) >= LFM_REFRESH_DAYS)
    .sort((a, b) => (crawl.lfm[a.tag]?.day || 0) - (crawl.lfm[b.tag]?.day || 0)).slice(0, LFM_TAGS_PER_RUN);
  for (const { g, tag } of due) {
    const ids = [];
    try {
      const d = await lastfm(`method=tag.gettoptracks&tag=${encodeURIComponent(tag)}&limit=40`);
      const tracks = (d.tracks?.track || []).map((t) => ({ t: t.name, a: t.artist?.name || '' }));
      for (const [i, t] of tracks.entries()) {
        const k = keyOf(t.a, t.t);
        let s = lib.get(k);
        if (!s && !crawl.miss[k]) { // only ask iTunes about songs the library does not have yet
          const hit = await resolve(t).catch(() => null);
          if (hit) s = lib.put(toSong(hit.r, { g, r: Math.floor(i / 5), y: hit.y }));
          else crawl.miss[k] = TODAY;
        }
        if (s && !ids.includes(s.id)) ids.push(s.id);
      }
      crawl.lfm[tag] = { day: TODAY, ids: g ? ids.slice(0, PER_GENRE) : [] };
      console.log(`Last.fm tag ${tag}: ${ids.length} songs`);
    } catch (e) { console.warn('Last.fm failed for', tag, e.message); }
  }
}

/* ---------- 4. karaoke and tribute versions ---------- */
// Searching "title karaoke" brings back karaoke tracks, backing tracks and tribute covers. The number of different
// acts that made one of this song (not of another song with the same title) is a good sign people love to sing it.
const KARAOKE = /karaoke|in the style of|originally performed|made famous|backing track|tribute|cover/i;
async function countKaraoke(lib, crawl, budget) {
  const due = [...lib.byId.values()].filter((s) => s.kv == null && s.y && s.y <= THIS_YEAR - 5 && !crawl.kvd[lib.key(s)])
    .sort((a, b) => (b.ls || 0) - (a.ls || 0) || (a.r ?? 9) - (b.r ?? 9) || (b.vn || 0) - (a.vn || 0)).slice(0, budget);
  let n = 0;
  for (const s of due) {
    const artist = primaryArtist(s.a), title = baseTitle(s.t), me = nk(artist);
    try {
      const d = await itunes(`search?media=music&entity=song&country=${COUNTRY}&limit=50&term=${encodeURIComponent(title + ' karaoke')}`);
      const acts = new Set();
      for (const r of d.results || []) {
        const text = (r.trackName || '') + ' ' + (r.collectionName || '');
        if (byArtist(r.artistName, artist) || !nk(r.trackName).startsWith(nk(title)) || !KARAOKE.test(text)) continue;
        const style = /in the style of ([^\])]+)/i.exec(text) || /(?:originally performed|made famous) by ([^\])]+)/i.exec(text);
        if (style && !nk(style[1]).includes(me) && !me.includes(nk(style[1]))) continue; // a different song with this title
        acts.add(nk(r.artistName));
      }
      s.kv = acts.size; n++;
    } catch (e) {
      if (e.status === 403 || e.status === 429) break;
    }
    crawl.kvd[lib.key(s)] = TODAY;
  }
  console.log(`karaoke counts: ${n} songs`);
}

/* ---------- 5. perennial scores ---------- */
// Evergreen: five or more years old and still pulling people back. Being on today's chart counts most, then days
// on the chart and comebacks, then how often the song has been reissued.
function scoreEvergreens(songs, hotSet) {
  for (const s of songs) {
    delete s.ev;
    if (!s.y || THIS_YEAR - s.y < 5) continue;
    const now = hotSet.has(s.id);
    if (!now && (s.cd || 0) < 7 && (s.vn || 0) < 4) continue;
    s.ev = (now ? 100 : 0) + 3 * (s.cd || 0) + 20 * (s.ce || 0) + 4 * Math.min(s.vn || 0, 10);
  }
}

/* ---------- build ---------- */
const readJSON = async (name, fallback) => {
  try { return JSON.parse(await readFile(new URL(name, DATA), 'utf8')); } catch { return fallback; }
};

export async function build() {
  const prev = await readJSON('charts.json', {});
  const crawl = Object.assign({ seeds: {}, lfm: {}, miss: {}, hist: {}, tg: {}, art: {}, kvd: {} }, await readJSON('crawl.json', {}));
  const lib = new Library(prev.songs || []);
  console.log(`library: ${lib.byId.size} songs from the last run`);

  let hot, hotFresh = true;
  try { hot = await hotChart(lib); console.log(`hot chart: ${hot.length} songs`); } catch (e) {
    console.warn('Hot chart failed, keeping the previous one:', e.message);
    hot = (prev.all || []).map((id) => lib.id(id)).filter(Boolean);
    hotFresh = false;
  }
  await backfillYears(lib).catch((e) => console.warn('Year backfill failed:', e.message));

  const due = seedQueue().filter((s) => TODAY - (crawl.seeds[s.id] || -1e9) >= RECRAWL_DAYS).slice(0, BUDGET);
  let crawled = 0;
  for (const seed of due) {
    try {
      const n = await crawlArtist(lib, seed);
      crawl.seeds[seed.id] = TODAY; crawled++;
      console.log(`  ${seed.dec} ${seed.g} ${seed.artist}: +${n}`);
    } catch (e) {
      console.warn(`  ${seed.artist} failed:`, e.message);
      if (e.status === 403 || e.status === 429) { console.warn('iTunes rate limit hit, stopping the crawl for this run'); break; }
    }
  }
  if (LASTFM_KEY) {
    await crawlLastfmTags(lib, crawl);
    await tagSongs(lib, hot, crawl);
  } else console.warn('LASTFM_KEY not set: no styles, moods, listeners or Last.fm tag charts this run.');
  await countKaraoke(lib, crawl, KV_BUDGET);

  for (const [k, day] of Object.entries(crawl.miss)) if (TODAY - day >= RECRAWL_DAYS) delete crawl.miss[k];
  for (const [k, day] of Object.entries(crawl.kvd)) if (TODAY - day >= RECRAWL_DAYS * 2) delete crawl.kvd[k];

  hot = [...new Set(hot.map((id) => lib.id(id)).filter(Boolean))];
  if (hotFresh) logChart(lib, hot, crawl);
  const hotSet = new Set(hot);
  // Song order: hot chart first, then the library by rank within its search, so every artist's biggest songs come first.
  const rest = [...lib.byId.values()].filter((s) => !hotSet.has(s.id)).sort((a, b) => (a.r ?? 9) - (b.r ?? 9));
  const songs = [...hot.map((id) => lib.byId.get(id)), ...rest].slice(0, MAX_SONGS);
  scoreEvergreens(songs, hotSet);

  const byGenre = {};
  for (const g of GENRES) {
    const lfm = (crawl.lfm[TAGS[g]]?.ids || []).map((id) => lib.id(id)).filter(Boolean);
    let ids = lfm.length >= 5 ? lfm : hot.filter((id) => lib.byId.get(id).g === g);
    ids = ids.slice(0, PER_GENRE);
    for (const s of songs) { // top up thin genres with recent library songs
      if (ids.length >= PER_GENRE) break;
      if (s.g === g && s.y >= THIS_YEAR - 2 && !ids.includes(s.id)) ids.push(s.id);
    }
    byGenre[g] = ids;
  }
  const decades = DECS.filter((d) => songs.some((s) => s.dec === d));

  console.log(`crawled ${crawled} artists, ${lib.added} new songs`);
  // For the admin page: how far through the artist list the crawl is, and whether Last.fm ran.
  const queue = seedQueue();
  const status = {
    artists: queue.length,
    artistsDone: queue.filter((s) => TODAY - (crawl.seeds[s.id] ?? -1e9) < RECRAWL_DAYS).length,
    crawled, added: lib.added, lastfm: !!LASTFM_KEY, hotFresh,
  };
  return {
    data: { updated: new Date().toISOString(), country: COUNTRY, eraCutoff: ERA_CUTOFF, status, decades, vocab: appVocab(), songs, all: hot, byGenre },
    crawl,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { data, crawl } = await build();
  if (data.songs.length < 10) throw new Error('Too few songs, keeping the previous charts.json');
  await mkdir(DATA, { recursive: true });
  await writeFile(new URL('charts.json', DATA), JSON.stringify(data));
  await writeFile(new URL('crawl.json', DATA), JSON.stringify(crawl));
  const S = data.songs, c = (f) => S.filter(f).length;
  console.log(`charts.json: ${S.length} songs, ${data.all.length} in the hot chart, ${c((s) => s.e)} explicit`);
  console.log('by decade: ' + data.decades.map((d) => `${d} ${c((s) => s.dec === d)}`).join(', '));
  console.log(`tagged: ${c((s) => s.st)} with a style, ${c((s) => s.md)} with a mood, ${c((s) => s.ls)} with listeners, ` +
    `${c((s) => s.kv)} with karaoke versions, ${c((s) => s.ev)} evergreens`);
}
