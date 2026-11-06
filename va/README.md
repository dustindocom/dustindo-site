# VA by DD

Static site for GitHub Pages. No build step.

## Put it online
1. Create a GitHub repo and upload everything in this folder (keep the `.github` folder).
2. Settings → Pages → Deploy from branch → `main` / root.
3. Settings → Actions → General → Workflow permissions → **Read and write**.
4. Actions → "Refresh charts" → **Run workflow**. It writes `data/charts.json` and repeats every 6 hours.
5. Optional, for per-genre charts: add a free Last.fm key as a repo secret named `LASTFM_KEY`.
6. Follow `FIREBASE-SETUP.md` to connect the database. Until you do, the app runs in **local demo mode**:
   everything works, and your MixTapes, likes and pins are saved in this browser only.

## How it works
- **Charts**: the Action reads Apple's most-played feed, looks every song up on iTunes (id, artwork, 30-second preview, store link) and drops explicit ones. The app reads only `data/charts.json`.
- **Artwork**: every song shows its Apple artwork. MixTape covers are a 2×2 collage of their first four songs; the full player uses the 600px image.
- **Search (Crate)**: live Apple Music search, clean versions only, with autofill (see below).
- **Playback**: one audio element plays Apple's previews. If a stored link has expired, the app looks the song up again and retries. Each song links to Apple Music.
- **Database**: Firebase Auth (anonymous plus optional password-locked names) and Firestore, per `FIREBASE-SETUP.md`.
- **Station X**: its sound stops the moment you leave the tab, switch browser tabs, or the window loses focus. It restarts only when you swipe again.

## Search autofill
Settings → Search controls it, saved per device:
- **Off**, **Suggestions** (a dropdown of matching artists and songs as you type), or **Suggestions + inline** (the dropdown plus your text completing in place; Tab or the right arrow accepts, Esc cancels). Phones default to Suggestions, desktops to Suggestions + inline.
- **Remember searches** keeps your last 8 searches and shows them when the box is empty. **Clear recent searches** wipes them.
- Keyboard: Up/Down move through suggestions, Enter picks one or searches what you typed.
- Developer knobs live in `js/app.js`: `MINC` (characters before suggestions start, default 2) and the 160 ms delay in `suggestSoon`.

## Files
- `index.html`, `css/app.css`, `js/app.js` (the app), `js/api.js` (Apple), `js/store.js` (Firebase or local), `js/seed-data.js` (starter DJs and MixTapes), `js/firebase-config.js` (your config)
- `admin.html`, `js/admin.js` (check setup and load starter data)
- `scripts/build-charts.mjs`, `.github/workflows/charts.yml` (chart refresh)
- `firebase/firestore.rules`, `FIREBASE-SETUP.md`
