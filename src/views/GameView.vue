<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import GameBoard from '@/components/GameBoard.vue'
import YutSticks from '@/components/YutSticks.vue'
import PlayerPanel from '@/components/PlayerPanel.vue'
import GameLog from '@/components/GameLog.vue'
import type { Move } from '@/models/types'

const router = useRouter()
const store = useGameStore()

onMounted(() => {
  if (!store.game.value) router.replace('/')
})

const game = computed(() => store.game.value)
const turnState = computed(() => store.turnState.value)
const currentPlayer = computed(() => store.currentPlayer.value)

function onThrow() {
  store.doThrow()
}

function onMoveSelected(move: Move) {
  store.doExecuteMove(move)
}

function onPieceSelected(pieceIds: string[]) {
  store.doSelectPiece(pieceIds)
}

function onNewGame() {
  store.doNewGame()
  router.replace('/')
}

function onReset() {
  store.doReset()
}

const canThrow = computed(() =>
  turnState.value?.phase === 'throwing'
)
</script>

<template>
  <div v-if="game" class="game-layout">
    <!-- Left: Players -->
    <aside class="sidebar sidebar-left">
      <PlayerPanel
        v-for="player in game.players"
        :key="player.id"
        :player="player"
        :is-active="player.id === currentPlayer?.id"
        :game-phase="game.phase"
      />
    </aside>

    <!-- Center: Board + Controls -->
    <main class="game-center">
      <!-- Winner banner -->
      <div v-if="game.phase === 'finished' && store.winner.value" class="winner-banner banner-in">
        <span class="winner-crown">🏆</span>
        <span class="winner-text">
          <strong>{{ store.winner.value.name }}</strong> wins!
        </span>
        <div class="winner-actions">
          <button class="btn-primary" @click="onReset">Play Again</button>
          <button class="btn-secondary" @click="onNewGame">New Game</button>
        </div>
      </div>

      <!-- Turn indicator -->
      <div v-if="game.phase === 'playing' && currentPlayer" class="turn-indicator">
        <span
          class="turn-dot"
          :style="{ background: currentPlayer.color }"
          :class="{ 'glow-pulse': canThrow }"
        ></span>
        <span class="turn-text">
          {{ currentPlayer.name }}'s turn
          <span v-if="turnState?.phase === 'throwing'"> — throw the sticks!</span>
          <span v-else-if="turnState?.phase === 'selecting'"> — pick a piece to move</span>
        </span>
      </div>

      <!-- Board -->
      <div class="board-wrapper">
        <GameBoard
          :game="game"
          :valid-moves="turnState?.validMoves ?? []"
          :selected-piece-ids="turnState?.selectedPieceIds ?? null"
          @piece-selected="onPieceSelected"
          @move-selected="onMoveSelected"
        />
      </div>

      <!-- Sticks + Throw button -->
      <div v-if="game.phase === 'playing'" class="throw-area">
        <YutSticks
          :result="turnState?.currentThrow ?? null"
          :is-throwing="false"
        />
        <button
          v-if="canThrow"
          class="btn-primary throw-btn"
          @click="onThrow"
        >
          🎋 Throw Sticks
        </button>
        <div v-else-if="turnState?.currentThrow" class="throw-result-label">
          <span
            class="throw-name"
            :style="{ color: currentPlayer?.color }"
          >{{ throwLabel(turnState.currentThrow.name) }}</span>
          <span class="throw-steps">+{{ turnState.currentThrow.steps }} steps</span>
          <span v-if="turnState.currentThrow.extraTurn" class="throw-extra">Extra Turn!</span>
        </div>
      </div>
    </main>

    <!-- Right: Log -->
    <aside class="sidebar sidebar-right">
      <GameLog :history="game.history" />
      <div class="game-controls">
        <button class="btn-secondary ctrl-btn" @click="onReset">Restart</button>
        <button class="btn-secondary ctrl-btn" @click="onNewGame">Menu</button>
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import { THROW_NAMES } from '@/engine/throw'
function throwLabel(name: string): string {
  return THROW_NAMES[name as keyof typeof THROW_NAMES] ?? name
}
</script>

<style scoped>
.game-layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  min-height: 100vh;
  background: var(--parchment);
  gap: 0;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 12px;
  background: #fff;
  border-right: 1px solid var(--parchment-dark);
}

.sidebar-right {
  border-right: none;
  border-left: 1px solid var(--parchment-dark);
}

.game-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 16px;
}

.winner-banner {
  background: var(--ink);
  color: #fff;
  border-radius: 16px;
  padding: 20px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 400px;
}

.winner-crown { font-size: 32px; }
.winner-text { font-size: 20px; font-family: 'Gowun Batang', serif; }
.winner-text strong { font-weight: 700; }

.winner-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.turn-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 50px;
  padding: 8px 20px;
  box-shadow: var(--shadow-sm);
}

.turn-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.turn-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
}

.board-wrapper {
  width: 100%;
  max-width: 560px;
  aspect-ratio: 1;
}

.throw-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.throw-btn {
  font-size: 16px;
  padding: 12px 28px;
}

.throw-result-label {
  display: flex;
  align-items: center;
  gap: 12px;
}

.throw-name {
  font-family: 'Gowun Batang', serif;
  font-size: 20px;
  font-weight: 700;
}

.throw-steps {
  font-size: 15px;
  color: var(--ink-light);
  font-weight: 500;
}

.throw-extra {
  background: var(--dancheong-red);
  color: #fff;
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
}

.game-controls {
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--parchment-dark);
}

.ctrl-btn {
  flex: 1;
  font-size: 13px;
  padding: 8px 12px;
}

@media (max-width: 900px) {
  .game-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }

  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
    border-right: none;
    border-bottom: 1px solid var(--parchment-dark);
  }

  .sidebar-right {
    border-left: none;
    border-top: 1px solid var(--parchment-dark);
  }

  .board-wrapper { max-width: 100%; }
}
</style>
