import type { GameState, Player, Move } from '@/models/types'

export function checkWinner(players: Player[]): Player | null {
  return players.find(p => p.pieces.every(piece => piece.state === 'finished')) ?? null
}

export function allPieces(state: GameState) {
  return state.players.flatMap(p => p.pieces)
}

export function nextPlayerIndex(state: GameState): number {
  return (state.currentPlayerIndex + 1) % state.players.length
}

export function moveGrantsExtraTurn(move: Move): boolean {
  return move.throwResult.extraTurn || move.isCapture
}
