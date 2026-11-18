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
- Adding a new character/game is a data change (edit `game-data/public/app-data.json` + add the image under `game-data/public/character-images/`; run `npx vitest run src/test/data` to validate), not a code change. Data changes deploy on their own when they reach `main` and do not need an app release or version bump. Record them in [game-data/CHANGELOG.md](game-data/CHANGELOG.md) under `## [Unreleased]` (`### Added`, one line per game) in the same PR as the data change. The deploy date is not known until merge, so the next PR that edits that file moves the entries of already-merged PRs under a dated heading (`## YYYY-MM-DD`, the deploy date). Do not add them to the root [CHANGELOG.md](CHANGELOG.md), which tracks app code changes only and follows SemVer: bug fixes are a patch release, new features a minor release.
- If a data change needs app support (a new field, or a new game with different rules), ship the app change first. The data tests catch a broken file, not a format the app cannot read yet.

### State management

`AppContext` is the single source of truth, providing: `selectedGame`, `randomizerConfig` (`characterSlots`: `"single"|"team"`, `isRepetitionAllowed`), `owned`, `selectionHistory`, `selected`, and `isDrawerOpen`, plus setters. The context objects (`AppContext`, `GameDataContext`) and `DEFAULT_RANDOMIZER_CONFIG` live in [character-randomizer/src/store/contexts.js](character-randomizer/src/store/contexts.js), and components import them from there. The providers ([app-context.jsx](character-randomizer/src/store/app-context.jsx), [game-data-context.jsx](character-randomizer/src/store/game-data-context.jsx)) export only components, as the `react-refresh/only-export-components` lint rule requires.

State is persisted via `useLocalStorage` ([character-randomizer/src/hooks/useLocalStorage.js](character-randomizer/src/hooks/useLocalStorage.js)), which namespaces keys as `<selectedGame>.<key>` (e.g. `WUWA.owned`). When `selectedGame` changes, `AppContextProvider`'s effect re-reads all per-game keys directly from `localStorage` (bypassing the hook's own setter) to swap in that game's saved state — this dual-read pattern is intentional, not redundant, since `useLocalStorage`'s internal state doesn't know when the active game changed.

### Randomization logic

Lives in [character-randomizer/src/utils/randomizer.js](character-randomizer/src/utils/randomizer.js) (`nextDraw`, `getRandomizedCharacters`, Fisher–Yates `shuffleArray` with an injectable RNG). `CharacterSlots.jsx` calls `nextDraw` and applies the result. The candidate pool is `owned` characters minus already-selected ones. Two modes:
- **Repetition allowed**: pool excludes nothing from history; every randomize draws fresh from all owned characters.
- **Repetition disallowed**: drawn characters accumulate in `selectionHistory` (excluded from future draws) until history covers all owned characters, at which point history resets (a Snackbar notifies the user).

### Component structure

`App.jsx` composes `TopBar`, `MenuDrawer` (game switcher), `CharacterSlots` (the randomizer + "Randomize" button), `ConfigPanel` (wraps `SelectionConfig`; `FilterConfig` exists but is currently commented out/unused), and `CharacterGrid` (the full roster grid — clicking a character card toggles it in/out of `owned`). Theming is centralized in [character-randomizer/src/theme/AppTheme.jsx](character-randomizer/src/theme/AppTheme.jsx) using MUI.

Logging uses `loglevel` (`log.debug(...)`) throughout for state-change tracing rather than `console.log`.

## Workflow

GitHub flow: `main` is the only long-lived branch and is always releasable. The app deploys only on a release, game data deploys on merge.

- Branch off `main` (`feat/…`, `fix/…`, `chore/…`), open a PR into `main`, squash merge, and the branch is deleted on merge. There is no `develop` branch.
- One PR per change. Put the changelog entry in the same PR: app code changes under `## [Unreleased]` in the root [CHANGELOG.md](CHANGELOG.md), data changes in [game-data/CHANGELOG.md](game-data/CHANGELOG.md) (see Data-driven games).
- Releasing the app deploys it. Open a "release vX.Y.Z" PR that bumps the version in `character-randomizer/package.json` and moves `[Unreleased]` under `## [X.Y.Z] - YYYY-MM-DD` in the root [CHANGELOG.md](CHANGELOG.md). After it merges, tag that commit on `main` (`git tag vX.Y.Z && git push origin vX.Y.Z`). The tag triggers `release.yml`, which deploys and creates the GitHub release. Merging to `main` alone does not deploy the app.

## Deployment

`.github/workflows/ci.yml` runs on every PR and on push to `main`. It only decides what to run and holds the required check: a `changes` job lists the PR's files (anything outside `game-data/` means app, anything under `game-data/public/` means data), then it calls the reusable pipelines and ends with a gate job named `ci`, the required check on `main`. Skipped pipelines count as passed. Do not put `paths` filters on a workflow's own triggers: a workflow skipped by a filter leaves its check pending and blocks the PR. Push to `main` always runs the app pipeline.

- `.github/workflows/app.yml` (reusable): lint, `npm test` (the whole Vitest suite, game-data tests included), the build, and for PRs from this repo (not Dependabot, which cannot read secrets) a Firebase preview channel of the `app` site from the built `dist`.
- `.github/workflows/data.yml` (reusable): the data tests (`npx vitest run src/test/data`) and, with the same Dependabot/fork exclusion, a Firebase preview channel of the `data` site. The app preview does not read it (it is built against production data), so inspect the raw `app-data.json` and images there.

| PR touches | Runs |
|---|---|
| app code only | `app.yml` |
| `game-data/public/**` only | `data.yml` |
| `game-data/CHANGELOG.md` only | nothing, `ci` still passes |
| both | both |

`.github/workflows/release.yml` runs when a `vX.Y.Z` tag is pushed. It checks that the tag is on `main`, that it matches `character-randomizer/package.json` and that `CHANGELOG.md` has a section for it, runs `app.yml` on the tag, deploys `dist` to the Firebase `app` target on the `live` channel, and creates the GitHub release from that changelog section. To redeploy or roll back, run it from the Actions tab (`workflow_dispatch`) with an existing tag.

`firebase-hosting-data-deploy.yml` runs on push to `main` for changes under `game-data/public/**`, runs the data tests (`npx vitest run src/test/data`) and deploys the `data` site, so data changes go live on merge without a release. Editing only `game-data/CHANGELOG.md` deploys nothing. Firebase project config is at the repo root ([firebase.json](firebase.json), [.firebaserc](.firebaserc)).

### Dependency updates

Dependabot ([.github/dependabot.yml](.github/dependabot.yml)) checks npm (`character-randomizer/`) and GitHub Actions monthly and opens PRs against `main`. npm updates are grouped (`mui`, `react`, `testing`, `eslint`, plus a catch-all for minor/patch); major bumps get their own PR. Dependabot PRs cannot read repo secrets, so `ci.yml` still runs lint, tests and the build for them but skips the preview deploy. Dependency bumps are not recorded in the root [CHANGELOG.md](CHANGELOG.md) unless they change app behavior.
