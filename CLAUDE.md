# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install        # Install dependencies
bun run dev        # Dev server (Vite, hot reload)
bun run build      # Type check + production build
bun run preview    # Preview production build
```

No test or lint scripts exist. TypeScript strict mode is the primary correctness gate.

## Architecture

Clean separation: **Engine → Store → UI**. Engine has zero Vue dependencies — it's pure TS functions.

### Engine (`src/engine/`)

Four pure modules, no side effects:

- **`board.ts`** — 29 named board nodes, 3 routes (main loop + 2 diagonal shortcuts), fork corners for branching paths.
- **`throw.ts`** — Stick simulation. 4 boolean sticks → flat count → move name (Mo/Do/Gae/Geol/Yut) + steps. `throwWithSeed()` for deterministic replay.
- **`movement.ts`** — `calculateValidMoves()` generates legal moves (stacking, fork detection, capture detection). `applyMove()` executes them.
- **`rules.ts`** — Win condition, turn order, extra-turn logic.
- **`game.ts`** — State machine: `createGame()`, `performThrow()`, `selectPiece()`, `executeMove()`, `resetGame()`. Deep-clones state on every mutation (JSON round-trip).

### State (`src/stores/gameStore.ts`)

Vue composable (no Pinia/Vuex). Reactive wrapper around engine:
- Auto-saves to localStorage on every state change (key: `yutnori_game_v1`).
- Undo stack: last 10 states as JSON clones.
- Actions: `doThrow()`, `doSelectPiece()`, `doExecuteMove()`, `doUndo()`, `doReset()`, `doNewGame()`.

### Turn Cycle

```
performThrow() → calculateValidMoves() → phase: selecting
selectPiece()  → filter valid moves by piece
executeMove()  → applyMove() → checkWinner() → nextPlayerIndex() or extra turn
```

### Types (`src/models/types.ts`)

All domain types live here. Key: `Piece.state` is `'home' | 'board' | 'finished'`; `Piece.position` is `null` (at home) or `{routeId, routeIndex}`.

### UI

- **`GameBoard.vue`** — SVG board. Handles piece positioning, valid-move highlights, click handlers, stacking visualization.
- **`YutSticks.vue`** — 4-stick throw animation.
- **`PlayerPanel.vue`**, **`GameLog.vue`**, **`GameSetup.vue`** — Side panels.
- Views: `HomeView.vue` (menu + language picker), `GameView.vue` (3-column grid: players | board | log).

### i18n

`src/composables/useLocale.ts` — PT/KO, persisted to localStorage. No external i18n library.

### Styling

Tailwind CSS 3.4 + CSS custom properties. Dancheong palette (parchment, ink). Fonts: `Gowun Batang` (Korean serif), `Outfit` (sans). 8 CSS keyframe animations. Breakpoint at 900px for 1-column mobile layout.

## Key Constraints

- No backend, no Firebase, no external APIs — entirely client-side.
- Engine designed for future multiplayer/AI use: keep it dependency-free and pure.
- Docker: multi-stage build (Bun builder → Nginx runner on port 80).
