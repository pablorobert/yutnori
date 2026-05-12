import type { Piece, PiecePosition, Move, ThrowResult, Player, RouteId, NodeId } from '@/models/types'
import { FORK_CORNERS, nodeIdAt, isFinished } from './board'

function getNodeId(pos: PiecePosition): NodeId | null {
  return nodeIdAt(pos.routeId, pos.routeIndex)
}

function getPiecesAtNode(nodeId: NodeId, pieces: Piece[]): Piece[] {
  return pieces.filter(p => {
    if (p.state !== 'board' || !p.position) return false
    return getNodeId(p.position) === nodeId
  })
}

function getFriendlyStack(piece: Piece, allPieces: Piece[]): string[] {
  if (piece.state === 'home') return [piece.id]
  if (!piece.position) return [piece.id]
  const nodeId = getNodeId(piece.position)
  if (!nodeId) return [piece.id]
  return allPieces
    .filter(p => p.playerId === piece.playerId && p.state === 'board' && p.position && getNodeId(p.position) === nodeId)
    .map(p => p.id)
}

function buildMove(
  pieceIds: string[],
  fromPosition: PiecePosition | null,
  toRouteId: RouteId,
  toRouteIndex: number,
  throwResult: ThrowResult,
  allPieces: Piece[],
  movingPlayerId: string,
): Move {
  const finished = isFinished(toRouteId, toRouteIndex)
  const toNodeId = finished ? null : nodeIdAt(toRouteId, toRouteIndex)

  let capturedPieceIds: string[] = []
  if (toNodeId) {
    capturedPieceIds = getPiecesAtNode(toNodeId, allPieces)
      .filter(p => p.playerId !== movingPlayerId)
      .map(p => p.id)
  }

  const toPosition: PiecePosition | null = finished
    ? null
    : { routeId: toRouteId, routeIndex: toRouteIndex }

  return {
    pieceIds,
    fromPosition,
    toPosition,
    toNodeId,
    isCapture: capturedPieceIds.length > 0,
    capturedPieceIds,
    grantsExtraTurn: capturedPieceIds.length > 0,
    throwResult,
  }
}

export function calculateValidMoves(
  player: Player,
  throwResult: ThrowResult,
  allPieces: Piece[],
): Move[] {
  const moves: Move[] = []
  const steps = throwResult.steps
  const seen = new Set<string>() // deduplicate by (pieceId sorted, toNodeId)

  // Collect one representative per group (home pieces + unique board positions)
  const groups: Piece[] = []

  // Home pieces — any one represents all home pieces (each moves independently)
  for (const p of player.pieces) {
    if (p.state === 'home') groups.push(p)
  }

  // Board pieces grouped by node
  const boardByNode = new Map<NodeId, Piece>()
  for (const p of player.pieces) {
    if (p.state !== 'board' || !p.position) continue
    const nid = getNodeId(p.position)
    if (!nid) continue
    if (!boardByNode.has(nid)) boardByNode.set(nid, p)
  }
  groups.push(...boardByNode.values())

  for (const piece of groups) {
    const stackIds = getFriendlyStack(piece, allPieces)

    if (piece.state === 'home') {
      // Enter board: land at main[steps]
      const destIndex = steps
      const key = `[${piece.id}]:main:${destIndex}`
      if (!seen.has(key)) {
        seen.add(key)
        moves.push(buildMove([piece.id], null, 'main', destIndex, throwResult, allPieces, player.id))
      }
      continue
    }

    if (!piece.position) continue
    const { routeId, routeIndex } = piece.position
    const currentNodeId = getNodeId(piece.position)

    // Fork check: if piece is AT a fork corner and can take a shortcut
    const forkRoute = currentNodeId ? FORK_CORNERS[currentNodeId] : undefined
    const routesToTry: RouteId[] = [routeId]

    // Only offer fork if coming from main route and sitting at the corner
    if (forkRoute && routeId === 'main') {
      routesToTry.push(forkRoute)
    }

    for (const rId of routesToTry) {
      const baseIndex = rId === routeId ? routeIndex : 0
      const destIndex = baseIndex + steps
      const key = `[${stackIds.join(',')}]:${rId}:${destIndex}`
      if (seen.has(key)) continue
      seen.add(key)
      moves.push(buildMove(stackIds, piece.position, rId, destIndex, throwResult, allPieces, player.id))
    }
  }

  return moves
}

export function applyMove(move: Move, allPieces: Piece[]): void {
  // Move captured enemies back home
  for (const capId of move.capturedPieceIds) {
    const cap = allPieces.find(p => p.id === capId)
    if (cap) {
      cap.state = 'home'
      cap.position = null
    }
  }

  // Move each piece in the stack
  for (const pid of move.pieceIds) {
    const piece = allPieces.find(p => p.id === pid)
    if (!piece) continue
    if (move.toPosition === null) {
      piece.state = 'finished'
      piece.position = null
    } else {
      piece.state = 'board'
      piece.position = { ...move.toPosition }
    }
  }
}

export { getNodeId }
