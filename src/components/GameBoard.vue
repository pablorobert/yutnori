<script setup lang="ts">
import { computed } from 'vue'
import type { GameState, Move, NodeId } from '@/models/types'
import {
  BOARD_NODES, OUTER_LINES, DIAGONAL_LINES, nodeIdAt,
} from '@/engine/board'
import { getNodeId } from '@/engine/movement'

const props = defineProps<{
  game: GameState
  validMoves: Move[]
  selectedPieceIds: string[] | null
}>()

const emit = defineEmits<{
  pieceSelected: [pieceIds: string[]]
  moveSelected: [move: Move]
}>()

// All pieces in game
const allPieces = computed(() => props.game.players.flatMap(p => p.pieces))

// Player lookup
const playerById = computed(() => {
  const m = new Map<string, typeof props.game.players[0]>()
  for (const p of props.game.players) m.set(p.id, p)
  return m
})

// Group board pieces by nodeId
const piecesByNode = computed(() => {
  const m = new Map<NodeId, typeof allPieces.value>()
  for (const piece of allPieces.value) {
    if (piece.state !== 'board' || !piece.position) continue
    const nid = getNodeId(piece.position)
    if (!nid) continue
    if (!m.has(nid)) m.set(nid, [])
    m.get(nid)!.push(piece)
  }
  return m
})

// Valid destination nodeIds from currently selected pieces
const validDestNodeIds = computed(() => {
  if (!props.selectedPieceIds) return new Set<NodeId>()
  const s = new Set<NodeId>()
  for (const move of props.validMoves) {
    const sameSelected = move.pieceIds.every(id => props.selectedPieceIds!.includes(id))
      && props.selectedPieceIds!.every(id => move.pieceIds.includes(id))
    if (sameSelected && move.toNodeId) s.add(move.toNodeId)
    // finish moves (toNodeId null) are handled separately
  }
  return s
})

// nodeIds that are valid move sources (pieces that can move)
const movablePieceNodeIds = computed(() => {
  const s = new Set<NodeId>()
  for (const move of props.validMoves) {
    if (move.fromPosition) {
      const nid = nodeIdAt(move.fromPosition.routeId, move.fromPosition.routeIndex)
      if (nid) s.add(nid)
    }
  }
  return s
})


function handleNodeClick(nodeId: NodeId) {
  // Home piece selected → clicking its destination executes entry
  if (homeSelected.value && homeDestNodeId.value === nodeId) {
    const move = props.validMoves.find(m => m.fromPosition === null)
    if (move) { emit('moveSelected', move); return }
  }

  // Board piece selected → clicking a valid destination executes move
  if (props.selectedPieceIds && !homeSelected.value && validDestNodeIds.value.has(nodeId)) {
    const move = props.validMoves.find(m =>
      m.toNodeId === nodeId &&
      m.pieceIds.every(id => props.selectedPieceIds!.includes(id))
    )
    if (move) { emit('moveSelected', move); return }
  }

  // Click on a board piece to select it (deselects home if active)
  const piecesHere = piecesByNode.value.get(nodeId) ?? []
  const myPieces = piecesHere.filter(p => {
    const currentPlayer = props.game.players[props.game.currentPlayerIndex]
    return p.playerId === currentPlayer.id
  })
  if (myPieces.length > 0 && movablePieceNodeIds.value.has(nodeId)) {
    emit('pieceSelected', myPieces.map(p => p.id))
  }
}

// Home pieces (off-board) that can be placed
const hasMovableHomePiece = computed(() => {
  return props.validMoves.some(m => m.fromPosition === null)
})

// Home piece destination node — for highlighting
const homeDestNodeId = computed((): NodeId | null => {
  const m = props.validMoves.find(mv => mv.fromPosition === null)
  return m?.toNodeId ?? null
})

// Home is "selected" when selectedPieceIds contains a home-piece sentinel
const homeSelected = computed(() =>
  props.selectedPieceIds?.includes('__home__') ?? false
)

function handleHomeClick() {
  // Nothing — home entry is handled via the panel button in GameView
}

function getNodeR(type: string): number {
  if (type === 'home') return 22
  if (type === 'corner') return 18
  if (type === 'center') return 16
  return 12
}

function isSelected(nodeId: NodeId): boolean {
  if (!props.selectedPieceIds) return false
  const piecesHere = piecesByNode.value.get(nodeId) ?? []
  return piecesHere.some(p => props.selectedPieceIds!.includes(p.id))
}
</script>

<template>
  <div class="board-container">
    <svg
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      class="board-svg"
    >
      <!-- Board background -->
      <rect x="0" y="0" width="600" height="600" rx="20" fill="#fdfaf4" />

      <!-- Diagonal lines (behind outer) -->
      <g class="diagonal-lines">
        <line
          v-for="([a, b], i) in DIAGONAL_LINES"
          :key="'d'+i"
          :x1="BOARD_NODES[a].x" :y1="BOARD_NODES[a].y"
          :x2="BOARD_NODES[b].x" :y2="BOARD_NODES[b].y"
          stroke="#c8b89a" stroke-width="3" stroke-linecap="round"
          stroke-dasharray="6 4"
        />
      </g>

      <!-- Outer ring lines -->
      <g class="outer-lines">
        <line
          v-for="([a, b], i) in OUTER_LINES"
          :key="'o'+i"
          :x1="BOARD_NODES[a].x" :y1="BOARD_NODES[a].y"
          :x2="BOARD_NODES[b].x" :y2="BOARD_NODES[b].y"
          stroke="#a89070" stroke-width="4" stroke-linecap="round"
        />
      </g>

      <!-- Valid destination highlights (pulse ring) -->
      <g class="highlights">
        <!-- Highlight home entry destination when home piece is selected -->
        <circle
          v-if="homeSelected && homeDestNodeId"
          :cx="BOARD_NODES[homeDestNodeId].x"
          :cy="BOARD_NODES[homeDestNodeId].y"
          r="28"
          fill="rgba(192,57,43,0.15)"
          stroke="#c0392b"
          stroke-width="2.5"
          class="valid-highlight"
        />
        <circle
          v-for="nodeId in validDestNodeIds"
          :key="'h'+nodeId"
          :cx="BOARD_NODES[nodeId].x"
          :cy="BOARD_NODES[nodeId].y"
          r="24"
          fill="none"
          stroke="#1a3a5c"
          stroke-width="2.5"
          opacity="0.5"
          class="valid-highlight"
        />
      </g>

      <!-- Nodes -->
      <g class="nodes">
        <g
          v-for="node in Object.values(BOARD_NODES)"
          :key="node.id"
          @click="node.id === 'home' ? handleHomeClick() : handleNodeClick(node.id)"
          class="node-group"
          :class="{
            'clickable': movablePieceNodeIds.has(node.id) || validDestNodeIds.has(node.id) || (node.id === 'home' && hasMovableHomePiece),
            'valid-dest': validDestNodeIds.has(node.id),
          }"
        >
          <!-- Outer glow for valid destinations -->
          <circle
            v-if="validDestNodeIds.has(node.id)"
            :cx="node.x" :cy="node.y"
            :r="getNodeR(node.type) + 6"
            fill="rgba(26,58,92,0.12)"
            class="dest-glow"
          />

          <!-- Node body -->
          <circle
            :cx="node.x" :cy="node.y"
            :r="getNodeR(node.type)"
            :fill="
              node.type === 'home' ? '#1a3a5c' :
              node.type === 'corner' ? '#e8dcc8' :
              node.type === 'center' ? '#c77d0a' :
              '#e8dcc8'
            "
            :stroke="
              isSelected(node.id) ? '#1a3a5c' :
              node.type === 'home' ? '#0f2540' :
              node.type === 'corner' ? '#a89070' :
              node.type === 'center' ? '#a06008' :
              '#c4a882'
            "
            :stroke-width="isSelected(node.id) ? 3 : 2"
          />

          <!-- Node label -->
          <text
            v-if="node.type === 'home'"
            :x="node.x" :y="node.y + 1"
            text-anchor="middle" dominant-baseline="middle"
            font-size="14" fill="#fff" font-family="serif"
          >START</text>
          <text
            v-else-if="node.type === 'center'"
            :x="node.x" :y="node.y + 1"
            text-anchor="middle" dominant-baseline="middle"
            font-size="12" fill="#fff"
          >✦</text>
        </g>
      </g>

      <!-- Pieces on board -->
      <g class="pieces">
        <g
          v-for="[nid, piecesHere] in piecesByNode"
          :key="'pieces-'+nid"
        >
          <g
            v-for="(piece, idx) in piecesHere"
            :key="piece.id"
            @click="handleNodeClick(nid)"
            class="piece-token"
            :class="{ 'piece-selectable': movablePieceNodeIds.has(nid) }"
          >
            <!-- Stack offset -->
            <circle
              :cx="BOARD_NODES[nid].x + (idx > 0 ? (idx % 2 === 0 ? -6 : 6) : 0)"
              :cy="BOARD_NODES[nid].y + (idx > 1 ? 6 : 0)"
              r="11"
              :fill="playerById.get(piece.playerId)?.color ?? '#888'"
              stroke="#fff"
              stroke-width="2"
              class="piece-circle"
              :class="{ 'selected-piece': selectedPieceIds?.includes(piece.id) }"
            />
            <text
              :x="BOARD_NODES[nid].x + (idx > 0 ? (idx % 2 === 0 ? -6 : 6) : 0)"
              :y="BOARD_NODES[nid].y + (idx > 1 ? 6 : 0) + 1"
              text-anchor="middle" dominant-baseline="middle"
              font-size="9" fill="#fff" font-weight="bold" font-family="Outfit,sans-serif"
            >{{ piece.index + 1 }}</text>
          </g>
        </g>
      </g>

      <!-- Home pieces indicator (off-board counts) -->
      <g class="home-counts">
        <g
          v-for="(player, idx) in game.players"
          :key="'home-'+player.id"
        >
          <template v-if="player.pieces.filter(p => p.state === 'home').length > 0">
            <!-- Position around start node -->
            <circle
              :cx="BOARD_NODES.home.x + [30, -30, 30, -30][idx]"
              :cy="BOARD_NODES.home.y + [-30, -30, 30, 30][idx]"
              r="14"
              :fill="player.color"
              opacity="0.25"
            />
            <circle
              :cx="BOARD_NODES.home.x + [30, -30, 30, -30][idx]"
              :cy="BOARD_NODES.home.y + [-30, -30, 30, 30][idx]"
              r="11"
              :fill="player.color"
              stroke="#fff"
              stroke-width="1.5"
            />
            <text
              :x="BOARD_NODES.home.x + [30, -30, 30, -30][idx]"
              :y="BOARD_NODES.home.y + [-30, -30, 30, 30][idx] + 1"
              text-anchor="middle" dominant-baseline="middle"
              font-size="10" fill="#fff" font-weight="bold" font-family="Outfit,sans-serif"
            >{{ player.pieces.filter(p => p.state === 'home').length }}</text>
          </template>
        </g>
      </g>

      <!-- Finish indicators (finished piece counts) -->
      <g class="finish-counts">
        <g
          v-for="(player, idx) in game.players"
          :key="'fin-'+player.id"
        >
          <template v-if="player.pieces.filter(p => p.state === 'finished').length > 0">
            <circle
              :cx="60 + idx * 130"
              :cy="560"
              r="12"
              :fill="player.color"
              opacity="0.85"
            />
            <text
              :x="60 + idx * 130"
              :y="561"
              text-anchor="middle" dominant-baseline="middle"
              font-size="10" fill="#fff" font-weight="bold" font-family="Outfit,sans-serif"
            >✓{{ player.pieces.filter(p => p.state === 'finished').length }}</text>
          </template>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.board-container {
  width: 100%;
  height: 100%;
}

.board-svg {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
  overflow: visible;
}

.node-group { cursor: default; }
.node-group.clickable { cursor: pointer; }

.node-group.valid-dest circle:first-child {
  animation: destPulse 1.4s ease-in-out infinite;
}

@keyframes destPulse {
  0%, 100% { opacity: 0.12; r: 20; }
  50%       { opacity: 0.25; r: 26; }
}

.piece-token { cursor: pointer; }
.piece-circle { transition: transform 0.15s; }
.piece-token:hover .piece-circle { transform: scale(1.15); }

.selected-piece {
  stroke: #fff !important;
  stroke-width: 3 !important;
  filter: drop-shadow(0 0 4px rgba(255,255,255,0.8));
}

.valid-highlight {
  animation: hlPulse 1.2s ease-in-out infinite;
}

@keyframes hlPulse {
  0%, 100% { opacity: 0.3; r: 20; }
  50%       { opacity: 0.7; r: 26; }
}

.dest-glow {
  animation: glowAnim 1.4s ease-in-out infinite;
}

@keyframes glowAnim {
  0%, 100% { opacity: 0.8; }
  50%       { opacity: 0.3; }
}
</style>
