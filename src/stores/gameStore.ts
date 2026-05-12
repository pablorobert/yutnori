import { reactive, computed, watch } from 'vue'
import type { GameState, GameSettings, Move } from '@/models/types'
import { createGame, performThrow, selectPiece, executeMove, resetGame } from '@/engine/game'
import { saveGame, loadGame, clearSave, hasSave } from '@/utils/storage'

const state = reactive<{ game: GameState | null }>({ game: null })

// Auto-save on every change
watch(
  () => state.game,
  (g) => { if (g) saveGame(g) },
  { deep: true },
)

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

  function startGame(settings: GameSettings) {
    state.game = createGame(settings)
  }

  function resumeGame() {
    const saved = loadGame()
    if (saved) state.game = saved
  }

  function doThrow() {
    if (!state.game) return
    state.game = performThrow(state.game)
  }

  function doSelectPiece(pieceIds: string[]) {
    if (!state.game) return
    state.game = selectPiece(state.game, pieceIds)
  }

  function doExecuteMove(move: Move) {
    if (!state.game) return
    state.game = executeMove(state.game, move)
  }

  function doReset() {
    if (!state.game) return
    state.game = resetGame(state.game)
  }

  function doNewGame() {
    state.game = null
    clearSave()
  }

  return {
    game,
    turnState,
    currentPlayer,
    allPlayers,
    allPieces,
    winner,
    hasSave,
    startGame,
    resumeGame,
    doThrow,
    doSelectPiece,
    doExecuteMove,
    doReset,
    doNewGame,
  }
}
