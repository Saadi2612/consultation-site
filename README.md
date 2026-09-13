# Proofload

Single-page marketing site. Astro, Tailwind, no UI framework.

`CLAUDE.md` holds the build constraints. `SPEC.md` holds the page content.

```
npm install
npm run dev            # dev server
npm run build          # static build into dist/
npm run shots          # Playwright screenshots at 1440x900 and 390x844
```

`npm run shots` expects something serving the site — `npm run preview` after a
build, or `npm run dev`. It writes `shots/`, which is gitignored, and captures
both the resting hero and the hero with a stage selected.

Fonts are self-hosted in `public/fonts/`, latin subset only, taken from the
files Google serves. The metric-matched fallback faces in `src/styles/global.css`
are derived from the real font metrics so the swap causes no layout shift.
