// Step 2 of 3: matches every drafted song to an Apple track (songs already in the catalog or seed first, then iTunes search,
// about 2 seconds per search). Progress is saved to the matches file, so it can be stopped and re-run to continue.
// Usage (from va/, after node scripts/get-data.mjs): node scripts/tapes/resolve-tapes.mjs drafts/new-tapes/tapes.json . data/charts.json drafts/new-tapes/matches.json
import fs from 'node:fs';
const [tapesF, seedDir, catalogF, cacheF] = process.argv.slice(2);
const tapes = JSON.parse(fs.readFileSync(tapesF, 'utf8'));
globalThis.window = {}; new Function(fs.readFileSync(seedDir + '/js/seed-tapes.js', 'utf8'))();
const D = window.VASeedTapes;
const cat = JSON.parse(fs.readFileSync(catalogF, 'utf8')).songs;
const cache = fs.existsSync(cacheF) ? JSON.parse(fs.readFileSync(cacheF, 'utf8')) : {};
const nk = (s = '') => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'and').replace(/\(.*?\)|\[.*?\]/g, '').replace(/\s-\s.*$/, '').replace(/^the\s+/, '').replace(/[^a-z0-9]/g, '');
const primary = (a = '') => a.split(/\s*(?:,|&|\+|\bfeat\.?|\bft\.?|\bfeaturing\b|\bwith\b|\sx\s|\sand\s)\s*/i)[0];
const base = (t = '') => t.replace(/\s*[(\[].*$/, '').replace(/\s-\s.*$/, '').trim();
const aOK = (ra, a) => { const x = nk(primary(ra)), y = nk(primary(a)), X = nk(ra), Y = nk(a); return x === y || X.includes(y) || Y.includes(x) && x.length > 3; };
const tOK = (rt, t) => { const x = nk(base(rt)), y = nk(base(t)); return x === y || (x.length > 4 && y.length > 4 && (x.startsWith(y) || y.startsWith(x))); };
const P = D.P, X = D.X;
const short = (u = '') => { u = u.replace(/\d+x\d+(bb)?(?=\.)/, '300x300bb'); return u.startsWith(P) && u.endsWith(X) ? u.slice(P.length, -X.length) : u; };
const G = [[/hip.?hop|rap/i,'hip'],[/r&b|soul/i,'rnb'],[/country|folk|americana|bluegrass/i,'ctry'],[/electronic|dance(?!hall)|house|techno|edm/i,'elec'],[/latin|reggaeton|urbano|salsa|bachata|mexican|tropical|pop latino|regional/i,'lat'],[/jazz|funk|blues/i,'jazz'],[/afro|reggae|dancehall|world|african/i,'afro'],[/rock|alternative|metal|punk/i,'rock'],[/pop|indie|k-pop|j-pop/i,'pop']];
const gk = (n = '') => { for (const [re, k] of G) if (re.test(n)) return k; return null; };
const JUNK = /\b(live|remix|mix|instrumental|karaoke|sped up|slowed|acoustic|demo|version\)|re-?recorded|cover)\b/i;
const JUNKALB = /karaoke|tribute|lullaby|8-?bit|in the style of|\(live\)|\blive (at|from|in)\b|workout|cover/i;
// existing ids first
const known = [];
for (const [id, s] of Object.entries(D.S)) known.push({ id, t: s[0], a: s[1], g: s[2], art: s[3] });
for (const s of cat) known.push({ id: s.id, t: s.t, a: s.a, g: s.g, art: short(s.art) });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let last = 0;
async function it(q) {
  for (let i = 0; i < 6; i++) {
    const w = last + 2300 - Date.now(); if (w > 0) await sleep(w); last = Date.now();
    const r = await fetch('https://itunes.apple.com/search?media=music&entity=song&country=us&' + q, { headers: { 'user-agent': 'va-by-dd-chart-builder' } }).catch(() => null);
    if (r && r.ok) return (await r.json()).results || [];
    console.log('  backoff', r && r.status); await sleep(30000 * (i + 1));
  }
  throw new Error('iTunes kept failing');
}
const pick = (rs, s) => {
  const ok = rs.filter(r => r.kind === 'song' && r.previewUrl && aOK(r.artistName, s.a) && tOK(r.trackName, s.t));
  if (!ok.length) return null;
  const score = r => (JUNK.test(r.trackName) || JUNKALB.test(r.collectionName || '') ? 100 : 0) + (r.trackExplicitness === 'explicit' ? 10 : 0) + (/greatest|hits|best of|collection|essential|anthology|now that|ultimate|playlist|\d{2}s/i.test(r.collectionName || '') ? 5 : 0) + (nk(base(r.trackName)) === nk(base(s.t)) ? 0 : 3);
  ok.sort((a, b) => score(a) - score(b) || String(a.releaseDate).localeCompare(String(b.releaseDate)));
  const r = ok[0];
  return { id: String(r.trackId), t: r.trackName, a: r.artistName, g: gk(r.primaryGenreName), art: short(r.artworkUrl100), gn: r.primaryGenreName };
};
const todo = [];
for (const tp of tapes) for (const s of tp.songs) { const k = (s.a + '|' + s.t).toLowerCase(); if (!(k in cache) && !todo.find(x => x.k === k)) todo.push({ k, ...s, g: tp.genre }); }
let fromKnown = 0, n = 0, miss = 0;
for (const s of todo) {
  const hit = known.find(x => aOK(x.a, s.a) && nk(base(x.t)) === nk(base(s.t)));
  if (hit) { cache[s.k] = { ...hit, src: 'known' }; fromKnown++; continue; }
}
fs.writeFileSync(cacheF, JSON.stringify(cache));
const rest = todo.filter(s => !(s.k in cache));
console.log(`todo ${todo.length}: ${fromKnown} already known, ${rest.length} to search`);
for (const s of rest) {
  let r = pick(await it('limit=25&term=' + encodeURIComponent(primary(s.a) + ' ' + base(s.t))), s);
  if (!r) r = pick(await it('limit=50&attribute=songTerm&term=' + encodeURIComponent(base(s.t))), s);
  cache[s.k] = r ? { ...r, g: r.g || s.g, src: 'search' } : null;
  if (!r) { miss++; console.log('  MISS', s.a, '-', s.t); }
  if (++n % 25 === 0) { fs.writeFileSync(cacheF, JSON.stringify(cache)); console.log(`${n}/${rest.length} searched, ${miss} missing`); }
}
fs.writeFileSync(cacheF, JSON.stringify(cache));
console.log(`done: ${n} searched, ${miss} missing`);
