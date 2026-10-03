# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A React + Vite web app that randomizes game characters/teams for gacha games. Character pool, ownership, and selection history are persisted per-game in browser `localStorage`. Deployed to Firebase Hosting. The app code lives in the `character-randomizer/` subdirectory, not the repo root.

## Commands

All commands run from the `character-randomizer/` subdirectory:

```bash
cd character-randomizer
npm install
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run lint      # ESLint
npm run preview   # preview a production build
npm test          # run the Vitest suite once
npm run test:watch
```

## Tests

Vitest + React Testing Library + jsdom, configured in the `test` block of [character-randomizer/vite.config.js](character-randomizer/vite.config.js). Setup lives in [character-randomizer/src/test/setup.js](character-randomizer/src/test/setup.js) (clears `localStorage` and silences `loglevel` between tests).

- Unit tests sit next to their source as `*.test.js` (randomizer, `useLocalStorage`, game-data utils).
- Component/integration tests (`*.test.jsx`) render the full `<App />` via [character-randomizer/src/test/renderApp.jsx](character-randomizer/src/test/renderApp.jsx), which stubs `fetch` with a small fixture (games `ALPHA`/`BETA`) and asserts on `localStorage`. They do not use the production data.
- [character-randomizer/src/test/data/app-data.test.js](character-randomizer/src/test/data/app-data.test.js) validates the real `game-data/public/app-data.json`: unique ids, image files exist, no orphan images, filter fields present. Run it alone with `npx vitest run src/test/data`.
- SelectionConfig renders its controls twice (desktop + mobile accordion), and the loading/error Backdrop is `aria-hidden`, so some queries need `getAllBy…` and `hidden: true`.

## Architecture

### Data-driven games

Everything about a supported game (currently ZZZ = Zenless Zone Zero, WUWA = Wuthering Waves) lives in [game-data/public/app-data.json](game-data/public/app-data.json), keyed by game code. The app fetches it at runtime from `${VITE_DATA_BASE_URL}/app-data.json` in `GameDataProvider` ([character-randomizer/src/store/game-data-context.jsx](character-randomizer/src/store/game-data-context.jsx)) and caches it in `localStorage`. In dev, the `serveGameData` middleware in `vite.config.js` serves `game-data/public` at the site root; in production the data comes from the separate Firebase Hosting `data` site:

```json
{
  "ZZZ": {
    "name": "...",
    "teamCharacterCount": <n>,
    "filters": [{ "name": "Attribute", "values": [...] }, ...],
    "characters": [{ "id": "...", "name": "...", "img": "...", ... }, ...]
  }
}
```

- `character.id` is the character's name and is used as the key across owned lists, selection history, and localStorage.
- Character images are stored in `game-data/public/character-images/<zzz|wuwa>/...` and referenced by absolute path (`img` field) in the JSON.
- Adding a new character/game is a data change (edit `game-data/public/app-data.json` + add the image under `game-data/public/character-images/`; run `npx vitest run src/test/data` to validate), not a code change. Data changes deploy on their own when they reach `main` and do not need an app release or version bump. Record them in [game-data/CHANGELOG.md](game-data/CHANGELOG.md) under a dated heading (`## YYYY-MM-DD`, then `### Added` with one line per game). Do not add them to the root [CHANGELOG.md](CHANGELOG.md), which tracks app code changes only and follows SemVer: bug fixes are a patch release, new features a minor release.
- If a data change needs app support (a new field, or a new game with different rules), ship the app change first. The data tests catch a broken file, not a format the app cannot read yet.

### State management

`AppContext` ([character-randomizer/src/store/app-context.jsx](character-randomizer/src/store/app-context.jsx)) is the single source of truth, providing: `selectedGame`, `randomizerConfig` (`characterSlots`: `"single"|"team"`, `isRepetitionAllowed`), `owned`, `selectionHistory`, `selected`, and `isDrawerOpen`, plus setters.

State is persisted via `useLocalStorage` ([character-randomizer/src/hooks/useLocalStorage.js](character-randomizer/src/hooks/useLocalStorage.js)), which namespaces keys as `<selectedGame>.<key>` (e.g. `WUWA.owned`). When `selectedGame` changes, `AppContextProvider`'s effect re-reads all per-game keys directly from `localStorage` (bypassing the hook's own setter) to swap in that game's saved state — this dual-read pattern is intentional, not redundant, since `useLocalStorage`'s internal state doesn't know when the active game changed.

### Randomization logic

Lives in [character-randomizer/src/utils/randomizer.js](character-randomizer/src/utils/randomizer.js) (`nextDraw`, `getRandomizedCharacters`, Fisher–Yates `shuffleArray` with an injectable RNG). `CharacterSlots.jsx` calls `nextDraw` and applies the result. The candidate pool is `owned` characters minus already-selected ones. Two modes:
- **Repetition allowed**: pool excludes nothing from history; every randomize draws fresh from all owned characters.
- **Repetition disallowed**: drawn characters accumulate in `selectionHistory` (excluded from future draws) until history covers all owned characters, at which point history resets (a Snackbar notifies the user).

### Component structure

`App.jsx` composes `TopBar`, `MenuDrawer` (game switcher), `CharacterSlots` (the randomizer + "Randomize" button), `ConfigPanel` (wraps `SelectionConfig`; `FilterConfig` exists but is currently commented out/unused), and `CharacterGrid` (the full roster grid — clicking a character card toggles it in/out of `owned`). Theming is centralized in [character-randomizer/src/theme/AppTheme.jsx](character-randomizer/src/theme/AppTheme.jsx) using MUI.

Logging uses `loglevel` (`log.debug(...)`) throughout for state-change tracing rather than `console.log`.

## Deployment

CI (`.github/workflows/firebase-hosting-merge.yml`) tests and builds (`cd character-randomizer && npm ci && npm test && npm run build`) and deploys `character-randomizer/dist` to Firebase Hosting on push to `main`; PRs get preview channel deploys via `firebase-hosting-pull-request.yml`, also gated on `npm test`. Changes under `game-data/**` skip those workflows: `firebase-hosting-data-deploy.yml` runs the data tests before deploying the `data` site, and `game-data-validate.yml` runs them on PRs. Firebase project config is at the repo root ([firebase.json](firebase.json), [.firebaserc](.firebaserc)).
