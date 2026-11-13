// Step 1 of 3 for new starter MixTapes: reads drafts/new-tapes/*.txt, checks DJs, song limits, tags and duplicates.
// Usage (from va/): node scripts/tapes/parse-tapes.mjs drafts/new-tapes . drafts/new-tapes/tapes.json
import fs from 'node:fs';
const dir = process.argv[2];
globalThis.window = {}; new Function(fs.readFileSync(process.argv[3] + '/js/seed-tapes.js', 'utf8'))();
const D = window.VASeedTapes;
const src = fs.readFileSync(process.argv[3] + '/js/seed-data.js', 'utf8');
const djs = [...src.matchAll(/\{id:"([^"]+)",name:"[^"]+",style:"[^"]+",av:\[[^\]]+\](,premium:true)?\}/g)].map(m => ({ id: m[1], premium: !!m[2] }));
const prem = Object.fromEntries(djs.map(d => [d.id, d.premium]));
const MOODS = ['chill','party','feel-good','love','heartbreak','workout','summer','holiday'], G = ['pop','hip','rnb','elec','rock','lat','jazz','afro','ctry'];
const tapes = [];
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.txt')).sort()) {
  let cur = null;
  for (const line of fs.readFileSync(dir + '/' + f, 'utf8').split(/\r?\n/)) {
    if (line.startsWith('# ')) { const [o, tg, g, ...t] = line.slice(2).split(' | '); cur = { owner: o.trim(), tags: tg.split(',').map(s => s.trim()), genre: g.trim(), title: t.join(' | ').trim(), songs: [] }; tapes.push(cur); }
    else if (line.trim()) { const i = line.indexOf(' - '); cur.songs.push({ a: line.slice(0, i).trim(), t: line.slice(i + 3).trim() }); }
  }
}
const base = D.T.filter(t => +t[0].slice(2) <= 200); // the original starter tapes
const errs = [], old = new Set(base.map(t => t[1].toLowerCase()));
const per = {}; base.forEach(t => per[t[2]] = (per[t[2]] || 0) + 1);
const nw = {};
tapes.forEach((t, i) => {
  nw[t.owner] = (nw[t.owner] || 0) + 1;
  if (!(t.owner in prem)) errs.push(`#${i} unknown owner ${t.owner}`);
  const lim = prem[t.owner] ? 20 : 12;
  if (t.songs.length > lim + 4 || t.songs.length < 7) errs.push(`#${i} ${t.owner} "${t.title}" has ${t.songs.length} songs (limit ${lim}; up to 4 spares allowed, merge keeps the first ${lim} that match)`);
  t.tags.forEach(x => MOODS.includes(x) || errs.push(`#${i} bad tag ${x}`));
  if (!G.includes(t.genre)) errs.push(`#${i} bad genre ${t.genre}`);
  if (old.has(t.title.toLowerCase())) errs.push(`#${i} title already used: ${t.title}`);
  const seen = new Set(); t.songs.forEach(s => { const k = (s.a + '|' + s.t).toLowerCase(); if (seen.has(k)) errs.push(`#${i} dup song ${k}`); seen.add(k); if (!s.a || !s.t) errs.push(`#${i} bad line ${JSON.stringify(s)}`); });
});
for (const d of djs) if ((nw[d.id] || 0) !== (per[d.id] || 0)) errs.push(`count ${d.id}: new ${nw[d.id] || 0} vs old ${per[d.id]}`);
const uniq = new Set(tapes.flatMap(t => t.songs.map(s => (s.a + '|' + s.t).toLowerCase())));
console.log('tapes', tapes.length, 'song slots', tapes.reduce((a, t) => a + t.songs.length, 0), 'unique songs', uniq.size);
console.log(errs.length ? errs.join('\n') : 'no errors');
fs.writeFileSync(process.argv[4], JSON.stringify(tapes));
