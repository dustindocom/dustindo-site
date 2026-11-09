// Copies the latest music data from the `charts` branch into va/data/ so the site works locally.
// The data is not on main any more (the bot commits it to `charts`), and va/data/ is ignored by git.
// Run from anywhere in the repo:  node va/scripts/get-data.mjs
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const DATA = new URL('../data/', import.meta.url);
const git = (...a) => execFileSync('git', a, { cwd: new URL('..', import.meta.url), maxBuffer: 1 << 28 });

let ref = 'origin/charts';
try { git('fetch', '--quiet', 'origin', 'charts:refs/remotes/origin/charts'); } catch {
  ref = 'charts'; // offline, or the branch is not pushed yet: use the local one
  console.warn('Could not fetch origin/charts, using the local charts branch.');
}
await mkdir(DATA, { recursive: true });
for (const f of ['charts.json', 'crawl.json']) {
  await writeFile(new URL(f, DATA), git('show', `${ref}:${f}`));
}
const d = JSON.parse(git('show', `${ref}:charts.json`));
console.log(`va/data updated: ${d.songs.length} songs, built ${d.updated}`);
