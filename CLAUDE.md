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
```

There is no test suite configured in this project.

## Architecture

### Data-driven games

Everything about a supported game (currently ZZZ = Zenless Zone Zero, WUWA = Wuthering Waves) lives in [character-randomizer/src/data/app-data.json](character-randomizer/src/data/app-data.json), keyed by game code:

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
- Character images are served from `character-randomizer/public/character-images/<zzz|wuwa>/...` and referenced by absolute path (`img` field) in the JSON.
- Adding a new character/game is a data change (edit `app-data.json` + add the image under `public/character-images/`), not a code change. Check [CHANGELOG.md](CHANGELOG.md) for the pattern used when characters are added (one changelog entry per addition, under `[Unreleased]` until released).

### State management

`AppContext` ([character-randomizer/src/store/app-context.jsx](character-randomizer/src/store/app-context.jsx)) is the single source of truth, providing: `selectedGame`, `randomizerConfig` (`characterSlots`: `"single"|"team"`, `isRepetitionAllowed`), `owned`, `selectionHistory`, `selected`, and `isDrawerOpen`, plus setters.

State is persisted via `useLocalStorage` ([character-randomizer/src/hooks/useLocalStorage.js](character-randomizer/src/hooks/useLocalStorage.js)), which namespaces keys as `<selectedGame>.<key>` (e.g. `WUWA.owned`). When `selectedGame` changes, `AppContextProvider`'s effect re-reads all per-game keys directly from `localStorage` (bypassing the hook's own setter) to swap in that game's saved state — this dual-read pattern is intentional, not redundant, since `useLocalStorage`'s internal state doesn't know when the active game changed.

### Randomization logic

Lives in [character-randomizer/src/components/CharacterSlots/CharacterSlots.jsx](character-randomizer/src/components/CharacterSlots/CharacterSlots.jsx) (`getRandomizedCharacters` + Fisher–Yates `shuffleArray`). The candidate pool is `owned` characters minus already-selected ones. Two modes:
- **Repetition allowed**: pool excludes nothing from history; every randomize draws fresh from all owned characters.
- **Repetition disallowed**: drawn characters accumulate in `selectionHistory` (excluded from future draws) until history covers all owned characters, at which point history resets (a Snackbar notifies the user).

### Component structure

`App.jsx` composes `TopBar`, `MenuDrawer` (game switcher), `CharacterSlots` (the randomizer + "Randomize" button), `ConfigPanel` (wraps `SelectionConfig`; `FilterConfig` exists but is currently commented out/unused), and `CharacterGrid` (the full roster grid — clicking a character card toggles it in/out of `owned`). Theming is centralized in [character-randomizer/src/theme/AppTheme.jsx](character-randomizer/src/theme/AppTheme.jsx) using MUI.

Logging uses `loglevel` (`log.debug(...)`) throughout for state-change tracing rather than `console.log`.

## Deployment

CI (`.github/workflows/firebase-hosting-merge.yml`) builds (`cd character-randomizer && npm ci && npm run build`) and deploys `character-randomizer/dist` to Firebase Hosting on push to `main`; PRs get preview channel deploys via `firebase-hosting-pull-request.yml`. Firebase project config is at the repo root ([firebase.json](firebase.json), [.firebaserc](.firebaserc)).
