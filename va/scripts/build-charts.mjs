// Builds data/charts.json for VA by DD. Runs in GitHub Actions (Node 20+, no dependencies).
//   all songs  : Apple "most played" feed (rss.marketingtools.apple.com), no key needed
//   per genre  : Last.fm tag top tracks when LASTFM_KEY is set, otherwise the genre mix inside the Apple list
// Every song is resolved through the iTunes lookup/search API so it has a track id, artwork, a 30s preview and a store link.
import { writeFile, mkdir } from 'node:fs/promises';

const COUNTRY = process.env.CHART_COUNTRY || 'us';
const LASTFM_KEY = process.env.LASTFM_KEY || '';
const PER_GENRE = 15;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const J = async (url) => {
  for (let i = 0; i < 3; i++) {
    const res = await fetch(url, { headers: { 'user-agent': 'va-by-dd-chart-builder' } });
    if (res.ok) return res.json();
    await sleep(2000 * (i + 1));
  }
  throw new Error('request failed: ' + url);
};

const GMAP = [
  [/hip.?hop|rap/i, 'hip'], [/r&b|soul/i, 'rnb'], [/electronic|dance|house|techno|edm/i, 'elec'],
  [/latin|reggaeton|urbano|salsa|bachata/i, 'lat'], [/jazz|funk|blues/i, 'jazz'],
  [/afro|reggae|dancehall|world/i, 'afro'], [/rock|alternative|metal|punk/i, 'rock'], [/pop|indie/i, 'pop'],
];
export const genreKey = (n = '') => { for (const [re, k] of GMAP) if (re.test(n)) return k; return 'pop'; };
const TAGS = { hip: 'hip-hop', rnb: 'rnb', elec: 'electronic', pop: 'pop', rock: 'rock', lat: 'latin', jazz: 'jazz', afro: 'afrobeats' };
const bigArt = (u = '') => u.replace(/\d+x\d+(bb)?(?=\.)/, '300x300bb');

export const toSong = (r, g) => ({
  id: String(r.trackId), t: r.trackName, a: r.artistName, art: bigArt(r.artworkUrl100),
  prev: r.previewUrl, url: r.trackViewUrl, g: g || genreKey(r.primaryGenreName),
});
export const usable = (r) => r && r.kind === 'song' && r.trackId && r.previewUrl && r.trackExplicitness !== 'explicit';

async function appleTop() {
  const feed = await J(`https://rss.marketingtools.apple.com/api/v2/${COUNTRY}/music/most-played/100/songs.json`);
  const ids = (feed.feed?.results || []).filter((x) => !/explicit/i.test(x.contentAdvisoryRating || '')).map((x) => x.id);
  const out = [];
  for (let i = 0; i < ids.length; i += 50) {
    const d = await J(`https://itunes.apple.com/lookup?country=${COUNTRY}&id=${ids.slice(i, i + 50).join(',')}`);
    const by = new Map((d.results || []).filter(usable).map((r) => [String(r.trackId), r]));
    for (const id of ids.slice(i, i + 50)) if (by.has(String(id))) out.push(by.get(String(id)));
    await sleep(1500);
  }
  return out;
}

async function lastfmTag(tag) {
  const d = await J(`https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${encodeURIComponent(tag)}&limit=40&format=json&api_key=${LASTFM_KEY}`);
  return (d.tracks?.track || []).map((t) => ({ t: t.name, a: t.artist?.name }));
}
async function resolve(t) {
  const d = await J(`https://itunes.apple.com/search?media=music&entity=song&country=${COUNTRY}&limit=5&term=${encodeURIComponent(t.a + ' ' + t.t)}`);
  return (d.results || []).find((r) => usable(r) && r.trackName.toLowerCase().includes(t.t.toLowerCase().slice(0, 12)));
}

export async function build() {
  const top = await appleTop();
  const songs = new Map();
  const all = [];
  top.forEach((r) => { const s = toSong(r); songs.set(s.id, s); all.push(s.id); });
  const byGenre = {};
  for (const g of Object.keys(TAGS)) byGenre[g] = all.filter((id) => songs.get(id).g === g).slice(0, PER_GENRE);

  if (LASTFM_KEY) {
    for (const [g, tag] of Object.entries(TAGS)) {
      const ids = [];
      try {
        for (const t of await lastfmTag(tag)) {
          if (ids.length >= PER_GENRE) break;
          const r = await resolve(t).catch(() => null);
          await sleep(3200); // stay under iTunes' rate limit
          if (!r) continue;
          const s = toSong(r, g);
          if (!songs.has(s.id)) songs.set(s.id, s);
          if (!ids.includes(s.id)) ids.push(s.id);
        }
      } catch (e) { console.warn('Last.fm failed for', g, e.message); }
      if (ids.length >= 5) byGenre[g] = ids;
    }
  } else {
    console.warn('LASTFM_KEY not set: genre lists come from the Apple top 100 only and may be short.');
  }
  return { updated: new Date().toISOString(), country: COUNTRY, songs: [...songs.values()], all, byGenre };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const data = await build();
  if (data.all.length < 10) throw new Error('Too few songs, keeping the previous charts.json');
  await mkdir(new URL('../data/', import.meta.url), { recursive: true });
  await writeFile(new URL('../data/charts.json', import.meta.url), JSON.stringify(data));
  console.log(`charts.json: ${data.songs.length} songs, ${data.all.length} in the main chart`);
}
