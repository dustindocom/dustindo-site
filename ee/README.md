# Epic Escape (EE)

Hidden-object mobile game, imported from the Figma Make file "Epic Escape".

- **Play it:** open `ee/index.html` (works from a double-click, or at `/ee/` on the site). No internet needed; the Cinzel font is bundled.
- **Edit it:** the React + Vite + Tailwind project is in `ee/source/`.
  - `src/App.tsx` game logic and screens, `src/index.css` all styling, `src/generated/objectMasks.ts` click-hit masks.
  - Images live in `source/public/assets/` (keep file names, c01-c08.png are the hidden objects).
  - `cd ee/source && npm install` once, then `npm run dev` to edit live, or `npm run build` to rebuild the playable `ee/index.html` + `ee/assets/`.
