// Step 3 of 3: adds the matched tapes as mt201+ to js/seed-tapes.js (songs that found no match are dropped) and writes
// drafts/mixtapes-new-200.json. Re-runnable. Then open admin.html and click Load starter data to put them in Firestore.
// Usage (from va/): node scripts/tapes/merge-tapes.mjs drafts/new-tapes/tapes.json drafts/new-tapes/matches.json . <review-data.json> <years.json>
// Adds the resolved new tapes (mt201..) to js/seed-tapes.js, writes drafts/mixtapes-new-200.json, and data for the review page.
import fs from 'node:fs';
const [tapesF, cacheF, vaDir, pageDataF, yearsF] = process.argv.slice(2);
const tapes = JSON.parse(fs.readFileSync(tapesF, 'utf8'));
const cache = JSON.parse(fs.readFileSync(cacheF, 'utf8'));
const years = fs.existsSync(yearsF) ? JSON.parse(fs.readFileSync(yearsF, 'utf8')) : {};
const seedF = vaDir + '/js/seed-tapes.js';
const src = fs.readFileSync(seedF, 'utf8');
globalThis.window = {}; new Function(src)();
const D = window.VASeedTapes;
const prem = new Set([...fs.readFileSync(vaDir + '/js/seed-data.js', 'utf8').matchAll(/{id:"([^"]+)"[^}]*premium:true}/g)].map((x) => x[1]));
const oldT = D.T.filter((t) => +t[0].slice(2) <= 200); // re-runnable: drop earlier merges
const S = { ...D.S };
const newT = [], dropped = [], draft = [];
tapes.forEach((tp, i) => {
  const id = 'mt' + String(201 + i).padStart(3, '0');
  const ids = [];
  for (const s of tp.songs) {
    const r = cache[(s.a + '|' + s.t).toLowerCase()];
    if (!r) { dropped.push(`${id} ${s.a} - ${s.t}`); continue; }
    if (ids.includes(r.id)) continue;
    if (ids.length >= (prem.has(tp.owner) ? 20 : 12)) break; // the app's per-tape limit
    ids.push(r.id);
    if (!S[r.id]) S[r.id] = [r.t, r.a, r.g, r.art];
  }
  newT.push([id, tp.title, tp.owner, tp.tags, tp.genre, ids]);
  draft.push({ id, title: tp.title, owner: tp.owner, tags: tp.tags, genre: tp.genre, tracks: ids, wanted: tp.songs.map((s) => s.a + ' - ' + s.t) });
});
// keep only songs some tape uses
const used = new Set([...oldT, ...newT].flatMap((t) => t[5]));
for (const k of Object.keys(S)) if (!used.has(k)) delete S[k];
const T = [...oldT, ...newT];
const head = `/* Starter MixTapes: ${T.length} tapes by 37 DJs. mt001–mt200 were built from va/drafts/mixtapes-200.json, mt201–mt${T.length} from
   va/drafts/new-tapes/*.txt (songs people know across the decades, matched to Apple tracks). Songs are Apple track ids.
   S: id → [title, artist, genre, artwork path under P]. T: [id, title, owner, mood tags, main genre, song ids]. */
window.VASeedTapes={P:${JSON.stringify(D.P)},X:${JSON.stringify(D.X)},
S:${JSON.stringify(S)},
T:[
${T.map((t) => JSON.stringify(t)).join(',\n')}
]};
`;
fs.writeFileSync(seedF, head);
fs.writeFileSync(vaDir + '/drafts/mixtapes-new-200.json', JSON.stringify(draft, null, 1));
// review page data
const names = Object.fromEntries([...fs.readFileSync(vaDir + '/js/seed-data.js', 'utf8').matchAll(/\{id:"([^"]+)",name:"([^"]+)",style:"([^"]+)"/g)].map((m) => [m[1], [m[2], m[3]]]));
const page = T.map((t) => ({ id: t[0], n: +t[0].slice(2) > 200 ? 1 : 0, ti: t[1], o: t[2], dj: names[t[2]]?.[0] || t[2], tg: t[3], g: t[4],
  s: t[5].map((id) => [S[id][0], S[id][1], years[id] || 0]) }));
fs.writeFileSync(pageDataF, JSON.stringify(page));
const lens = newT.map((t) => t[5].length);
console.log(`tapes ${T.length} (new ${newT.length}), songs in S ${Object.keys(S).length}, dropped ${dropped.length}, new tape sizes ${Math.min(...lens)}-${Math.max(...lens)}`);
console.log('tapes under 7 songs:', newT.filter((t) => t[5].length < 7).map((t) => t[0] + ' ' + t[1] + ' (' + t[5].length + ')').join('; ') || 'none');
fs.writeFileSync(pageDataF + '.dropped.txt', dropped.join('\n'));
