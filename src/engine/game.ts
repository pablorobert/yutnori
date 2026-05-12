import type {
  GameState, GameSettings, Player, Piece, ThrowResult,
  Move, TurnState, HistoryEntry, PlayerId,
} from '@/models/types'
import { throwEngine } from './throw'
import { calculateValidMoves, applyMove } from './movement'
import { checkWinner, allPieces, nextPlayerIndex, moveGrantsExtraTurn } from './rules'

const PLAYER_COLORS = [
  { color: '#c0392b', colorClass: 'player-red'   },
  { color: '#1a3a5c', colorClass: 'player-blue'  },
  { color: '#2d6a4f', colorClass: 'player-green' },
  { color: '#c77d0a', colorClass: 'player-gold'  },
]

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function createPlayers(settings: GameSettings): Player[] {
  return Array.from({ length: settings.playerCount }, (_, i) => {
    const pieces: Piece[] = Array.from({ length: settings.piecesPerPlayer }, (__, j) => ({
      id: `p${i}-${j}`,
      playerId: `player-${i}`,
      index: j,
      state: 'home',
      position: null,
    }))
    return {
      id: `player-${i}`,
      name: settings.playerNames[i] ?? `Player ${i + 1}`,
      color: PLAYER_COLORS[i].color,
      colorClass: PLAYER_COLORS[i].colorClass,
      pieces,
    }
  })
}

export function createGame(settings: GameSettings): GameState {
  const players = createPlayers(settings)
  return {
    id: uid(),
    phase: 'playing',
    players,
    currentPlayerIndex: 0,
    turn: 1,
    turnState: initTurnState(players[0].id),
    history: [],
    winner: null,
    settings,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function initTurnState(playerId: PlayerId): TurnState {
  return {
    currentPlayerId: playerId,
    pendingThrows: [],
    currentThrow: null,
    phase: 'throwing',
    validMoves: [],
    selectedPieceIds: null,
  }
}

// --- Actions ---

export function performThrow(state: GameState): GameState {
  if (!state.turnState || state.turnState.phase !== 'throwing') return state
  const result = throwEngine.throwSticks()
  return applyThrowResult(state, result)
}

function applyThrowResult(state: GameState, result: ThrowResult): GameState {
  const turn = state.turnState!
  const player = state.players.find(p => p.id === turn.currentPlayerId)!
  const pieces = allPieces(state)
  const validMoves = calculateValidMoves(player, result, pieces)

  const newTurn: TurnState = {
    ...turn,
    currentThrow: result,
    phase: 'selecting',
    validMoves,
    selectedPieceIds: null,
  }

  return { ...state, turnState: newTurn, updatedAt: Date.now() }
}

export function selectPiece(state: GameState, pieceIds: string[]): GameState {
  if (!state.turnState || state.turnState.phase !== 'selecting') return state
  return {
    ...state,
    turnState: { ...state.turnState, selectedPieceIds: pieceIds },
  }
}

export function executeMove(state: GameState, move: Move): GameState {
  if (!state.turnState || state.turnState.phase !== 'selecting') return state

  const player = state.players.find(p => p.id === state.turnState!.currentPlayerId)!

  // Deep-clone players for immutability
  const newPlayers = state.players.map(pl => ({
    ...pl,
    pieces: pl.pieces.map(pc => ({ ...pc, position: pc.position ? { ...pc.position } : null })),
  }))
  const newPieces = newPlayers.flatMap(p => p.pieces)

  applyMove(move, newPieces)

  // Sync back
  for (const pl of newPlayers) {
    pl.pieces = newPieces.filter(p => p.playerId === pl.id)
  }

  const historyEntry: HistoryEntry = {
    id: uid(),
    playerId: player.id,
    playerName: player.name,
    playerColor: player.color,
    throwResult: move.throwResult,
    move,
    turn: state.turn,
    timestamp: Date.now(),
  }

  // Check winner
  const winner = checkWinner(newPlayers)
  if (winner) {
    return {
      ...state,
      players: newPlayers,
      phase: 'finished',
      winner: winner.id,
      history: [historyEntry, ...state.history],
      turnState: null,
      updatedAt: Date.now(),
    }
  }

  const extraTurn = moveGrantsExtraTurn(move)

  let newTurnState: TurnState
  if (extraTurn) {
    // Same player throws again
    newTurnState = {
      currentPlayerId: player.id,
      pendingThrows: [],
      currentThrow: null,
      phase: 'throwing',
      validMoves: [],
      selectedPieceIds: null,
    }
  } else {
    const nextIdx = nextPlayerIndex(state)
    const nextPlayer = newPlayers[nextIdx]
    newTurnState = {
      currentPlayerId: nextPlayer.id,
      pendingThrows: [],
      currentThrow: null,
      phase: 'throwing',
      validMoves: [],
      selectedPieceIds: null,
    }
    return {
      ...state,
      players: newPlayers,
      currentPlayerIndex: nextIdx,
      turn: state.turn + 1,
      turnState: newTurnState,
      history: [historyEntry, ...state.history],
      updatedAt: Date.now(),
    }
  }

  return {
    ...state,
    players: newPlayers,
    turnState: newTurnState,
    history: [historyEntry, ...state.history],
    updatedAt: Date.now(),
  }
}

export function resetGame(state: GameState): GameState {
  return createGame(state.settings)
}
