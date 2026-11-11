# VA by DD

Static site for GitHub Pages. No build step.

## Put it online
1. Create a GitHub repo and upload everything in this folder (keep the `.github` folder).
2. Settings → Pages → Deploy from branch → `main` / root.
3. Settings → Actions → General → Workflow permissions → **Read and write**.
4. Actions → "Refresh charts" → **Run workflow**. It writes `charts.json` to the `charts` branch and repeats every 6 hours.
5. Add a free Last.fm key as a repo secret named `LASTFM_KEY`. It powers styles, moods and the All-time and On repeat lists.
6. Follow `FIREBASE-SETUP.md` to connect the database. Until you do, the app runs in **local demo mode**:
   everything works, and your MixTapes, likes and pins are saved in this browser only.

## How it works
- **Charts**: `data/charts.json` is a growing library. Every run keeps all earlier songs, refreshes the hot chart from Apple's most-played feed, and searches the next batch of artists from a list covering the 50s to today in every genre, so older music sits alongside what charts now. With `LASTFM_KEY` set it also pulls Last.fm genre and decade tags. Every song is looked up on iTunes (id, artwork, 30-second preview, store link, release year). Explicit songs are kept and marked with an "E", but when a clean version exists only that one is kept. `data/crawl.json` records which searches were already made, so no request is repeated until it is due again (90 days for an artist). The app reads only `data/charts.json`.
- **Where the data lives**: `charts.json` and `crawl.json` are on the `charts` branch, never on `main`, so `main` holds only your own commits and you never have to pull bot updates before pushing. The app and the admin page read it straight from that branch (`raw.githubusercontent.com/dustindocom/dustindocom.github.io/charts/charts.json`, the `CHARTS_URL` in `js/api.js`), so a refresh shows on the site within about 5 minutes with no deploy. If that fails they fall back to a local `data/charts.json`; `va/data/` is ignored on `main`, and `node va/scripts/get-data.mjs` fills it for working offline. The admin page's **Music catalog** panel shows when the data was built, song counts by decade and genre, tagging coverage and crawl progress, with links to run the workflow and see its history.
- **Tags**: two levels, defined in `scripts/vocab.mjs`. Each song has one of 9 genres, up to 3 styles under it (Hair metal, Boom bap, Bossa nova…) and up to 3 moods (Chill, Party, Love songs, Holiday…). Listener tags from Last.fm are kept only when they map onto that list, and a song's decade always comes from its release year, never from a tag.
- **Lists** on the Charts page: **Hot now** (Apple's chart), **All-time** (most Last.fm listeners), **Evergreens** (5+ years old and still on the chart, coming back to it, or reissued often), **On repeat** (plays per listener) and **Singalongs** (karaoke and tribute versions). Every list works with the era, decade, genre, style and mood filters.
- **Home**: **Saved MixTapes** are the ones you've liked (pinned first). **Hot MixTapes** shows 20: the admin's picks first, then the most liked; **See More** opens every MixTape, most liked first. Like counts come from every DJ profile's liked MixTapes.
- **Tag pages**: the genre, style and mood tags on a song's ⋯ menu and on each MixTape page open a page with that tag's hot songs and its MixTapes.
- **Artwork**: every song shows its Apple artwork. MixTape covers are a 2×2 collage of their first four songs; the full player uses the 600px image.
- **Search (Crate)**: live Apple Music search, clean versions only, with autofill (see below).
- **Playback**: one audio element plays Apple's previews. If a stored link has expired, the app looks the song up again and retries. Each song links to Apple Music.
- **Database**: Firebase Auth (anonymous plus optional password-locked names) and Firestore, per `FIREBASE-SETUP.md`.
- **StudioX**: a locked door. Opening the tab plays a power-down transition into the room; the keycard reader always says ACCESS DENIED. Its muffled music starts muted: the speaker button turns it on (and off again). It stops the moment you leave the tab, switch browser tabs, or the window loses focus.

## Search autofill
Settings → Search controls it, saved per device:
- **Off**, **Suggestions** (a dropdown of matching artists and songs as you type), or **Suggestions + inline** (the dropdown plus your text completing in place; Tab or the right arrow accepts, Esc cancels). Phones default to Suggestions, desktops to Suggestions + inline.
- **Remember searches** keeps your last 8 searches and shows them when the box is empty. **Clear recent searches** wipes them.
- Keyboard: Up/Down move through suggestions, Enter picks one or searches what you typed.
- Developer knobs live in `js/app.js`: `MINC` (characters before suggestions start, default 2) and the 160 ms delay in `suggestSoon`.

## Files
- `index.html`, `css/app.css`, `js/app.js` (the app), `js/api.js` (Apple), `js/store.js` (Firebase or local), `js/seed-data.js` (starter DJs and Home lists), `js/seed-tapes.js` (the 200 starter MixTapes and their songs), `js/firebase-config.js` (your config)
- `admin.html`, `js/admin.js` (check setup and load starter data), `js/admin-catalog.js` (Music catalog panel)
- `scripts/build-charts.mjs`, `.github/workflows/charts.yml` (chart refresh, commits to the `charts` branch)
- `scripts/get-data.mjs` (copies the `charts` branch data into `va/data/` for working offline)
- `firebase/firestore.rules`, `FIREBASE-SETUP.md`
