import { reactive, computed, watch } from 'vue'
import type { GameState, GameSettings, Move } from '@/models/types'
import { createGame, performThrow, selectPiece, executeMove, resetGame } from '@/engine/game'
import { saveGame, loadGame, clearSave, hasSave } from '@/utils/storage'

const state = reactive<{ game: GameState | null; undoStack: GameState[] }>({
  game: null,
  undoStack: [],
})

// Auto-save on every change
watch(
  () => state.game,
  (g) => { if (g) saveGame(g) },
  { deep: true },
)

function snapshot() {
  if (!state.game) return
  // Keep max 10 undo steps, deep-clone via JSON
  const clone = JSON.parse(JSON.stringify(state.game)) as GameState
  state.undoStack.push(clone)
  if (state.undoStack.length > 10) state.undoStack.shift()
}

export function useGameStore() {
  const game = computed(() => state.game)
  const turnState = computed(() => state.game?.turnState ?? null)
  const currentPlayer = computed(() => {
    if (!state.game) return null
    return state.game.players[state.game.currentPlayerIndex]
  })
  const allPlayers = computed(() => state.game?.players ?? [])
  const allPieces = computed(() => state.game?.players.flatMap(p => p.pieces) ?? [])
  const winner = computed(() => {
    if (!state.game?.winner) return null
    return state.game.players.find(p => p.id === state.game!.winner) ?? null
  })
  const canUndo = computed(() => state.undoStack.length > 0)

  function startGame(settings: GameSettings) {
    state.undoStack = []
    state.game = createGame(settings)
  }

  function resumeGame() {
    const saved = loadGame()
    if (saved) state.game = saved
  }

  function doThrow() {
    if (!state.game) return
    snapshot()
    state.game = performThrow(state.game)
  }

  function doSelectPiece(pieceIds: string[]) {
    if (!state.game) return
    state.game = selectPiece(state.game, pieceIds)
  }

  function doExecuteMove(move: Move) {
    if (!state.game) return
    snapshot()
    state.game = executeMove(state.game, move)
  }

  function doUndo() {
    const prev = state.undoStack.pop()
    if (prev) state.game = prev
  }

  function doReset() {
    if (!state.game) return
    state.undoStack = []
    state.game = resetGame(state.game)
  }

  function doNewGame() {
    state.game = null
    state.undoStack = []
    clearSave()
  }

  return {
    game,
    turnState,
    currentPlayer,
    allPlayers,
    allPieces,
    winner,
    canUndo,
    hasSave,
    startGame,
    resumeGame,
    doThrow,
    doSelectPiece,
    doExecuteMove,
    doUndo,
    doReset,
    doNewGame,
  }
}
