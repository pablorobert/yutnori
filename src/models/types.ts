export type PlayerId = string
export type NodeId = string
export type RouteId = 'main' | 'ne' | 'nw'
export type PieceState = 'home' | 'board' | 'finished'
export type GamePhase = 'setup' | 'playing' | 'finished'
export type TurnPhase = 'throwing' | 'selecting' | 'animating'
export type ThrowName = 'do' | 'gae' | 'geol' | 'yut' | 'mo'

export interface PiecePosition {
  routeId: RouteId
  routeIndex: number
}

export interface Piece {
  id: string
  playerId: PlayerId
  index: number
  state: PieceState
  position: PiecePosition | null
}

export interface Player {
  id: PlayerId
  name: string
  color: string
  colorClass: string
  pieces: Piece[]
}

export interface ThrowResult {
  sticks: [boolean, boolean, boolean, boolean]
  name: ThrowName
  steps: number
  extraTurn: boolean
}

export interface Move {
  pieceIds: string[]
  fromPosition: PiecePosition | null
  toPosition: PiecePosition | null
  toNodeId: NodeId | null
  isCapture: boolean
  capturedPieceIds: string[]
  grantsExtraTurn: boolean
  throwResult: ThrowResult
}

export interface TurnState {
  currentPlayerId: PlayerId
  pendingThrows: ThrowResult[]
  currentThrow: ThrowResult | null
  phase: TurnPhase
  validMoves: Move[]
  selectedPieceIds: string[] | null
}

export interface HistoryEntry {
  id: string
  playerId: PlayerId
  playerName: string
  playerColor: string
  throwResult: ThrowResult
  move: Move | null
  turn: number
  timestamp: number
}

export interface GameSettings {
  playerCount: number
  piecesPerPlayer: number
  playerNames: string[]
}

export interface GameState {
  id: string
  phase: GamePhase
  players: Player[]
  currentPlayerIndex: number
  turn: number
  turnState: TurnState | null
  history: HistoryEntry[]
  winner: PlayerId | null
  settings: GameSettings
  createdAt: number
  updatedAt: number
}
