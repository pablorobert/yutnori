<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useLocale } from '@/composables/useLocale'
import GameBoard from '@/components/GameBoard.vue'
import YutSticks from '@/components/YutSticks.vue'
import PlayerPanel from '@/components/PlayerPanel.vue'
import GameLog from '@/components/GameLog.vue'
import { THROW_NAMES } from '@/engine/throw'
import type { Move } from '@/models/types'

const router = useRouter()
const store = useGameStore()
const { t, isKo } = useLocale()

onMounted(() => {
  if (!store.game.value) router.replace('/')
})

const game = computed(() => store.game.value)
const turnState = computed(() => store.turnState.value)
const currentPlayer = computed(() => store.currentPlayer.value)

function onThrow() { store.doThrow() }
function onMoveSelected(move: Move) { store.doExecuteMove(move) }
function onNewGame() { store.doNewGame(); router.replace('/') }
function onReset() { store.doReset() }

const canThrow = computed(() => turnState.value?.phase === 'throwing')
const canUndo = computed(() => store.canUndo.value)
function onUndo() { store.doUndo() }

// Piece selection helpers
const isSelecting = computed(() => turnState.value?.phase === 'selecting')
const selectedPieceIds = computed(() => turnState.value?.selectedPieceIds ?? null)
const homeSelected = computed(() => selectedPieceIds.value?.includes('__home__') ?? false)

const hasHomeMoves = computed(() =>
  turnState.value?.validMoves.some(m => m.fromPosition === null) ?? false
)

function selectHomePiece() {
  store.doSelectPiece(['__home__'])
}

function selectBoardPiece(pieceIds: string[]) {
  store.doSelectPiece(pieceIds)
}

function executeHomeMove() {
  const move = turnState.value?.validMoves.find(m => m.fromPosition === null)
  if (move) store.doExecuteMove(move)
}

function throwLabel(name: string): string {
  return THROW_NAMES[name as keyof typeof THROW_NAMES] ?? name
}
</script>

<template>
  <div v-if="game" class="game-layout">

    <!-- Esquerda: Jogadores -->
    <aside class="sidebar sidebar-left">
      <PlayerPanel
        v-for="player in game.players"
        :key="player.id"
        :player="player"
        :is-active="player.id === currentPlayer?.id"
        :game-phase="game.phase"
      />
    </aside>

    <!-- Centro: Tabuleiro + Controles -->
    <main class="game-center">

      <!-- Banner de vitória -->
      <div v-if="game.phase === 'finished' && store.winner.value" class="winner-banner banner-in">
        <span class="winner-crown">🏆</span>
        <span class="winner-text">
          <strong>{{ store.winner.value.name }}</strong> {{ t('won') }}
        </span>
        <div class="winner-actions">
          <button class="btn-primary" @click="onReset">{{ t('playAgain') }}</button>
          <button class="btn-secondary" @click="onNewGame">{{ t('menu') }}</button>
        </div>
      </div>

      <!-- Indicador de turno — sempre presente, conteúdo condicional -->
      <div class="turn-indicator-wrap">
        <div v-if="game.phase === 'playing' && currentPlayer" class="turn-indicator">
          <span
            class="turn-dot"
            :style="{ background: currentPlayer.color }"
            :class="{ 'glow-pulse': canThrow }"
          ></span>
          <span class="turn-text">
            <template v-if="isKo">
              <strong>{{ currentPlayer.name }}</strong>{{ t('turnOfSuffix') }}
            </template>
            <template v-else>
              {{ t('turnOf') }} <strong>{{ currentPlayer.name }}</strong>
            </template>
            <span v-if="turnState?.phase === 'throwing'"> — {{ t('turnThrow') }}</span>
            <span v-else-if="turnState?.phase === 'selecting'"> — {{ t('turnSelect') }}</span>
          </span>
        </div>
      </div>

      <!-- Tabuleiro -->
      <div class="board-wrapper">
        <GameBoard
          :game="game"
          :valid-moves="turnState?.validMoves ?? []"
          :selected-piece-ids="selectedPieceIds"
          @piece-selected="selectBoardPiece"
          @move-selected="onMoveSelected"
        />
      </div>

      <!-- Área inferior — sempre presente -->
      <div class="bottom-bar-wrap">
      <div v-if="game.phase === 'playing'" class="bottom-bar">
        <YutSticks
          :result="turnState?.currentThrow ?? null"
          :is-throwing="false"
          compact
        />

        <!-- Lançar -->
        <button v-if="canThrow" class="btn-primary throw-btn" @click="onThrow">
          {{ t('throwBtn') }}
        </button>

        <!-- Resultado + escolha de peça (mesma linha) -->
        <template v-else-if="turnState?.currentThrow">
          <div class="throw-result-label">
            <span class="throw-name" :style="{ color: currentPlayer?.color }">
              {{ throwLabel(turnState.currentThrow.name) }}
            </span>
            <span class="throw-steps">
              +{{ turnState.currentThrow.steps }} {{ turnState.currentThrow.steps === 1 ? t('step') : t('steps') }}
            </span>
            <span v-if="turnState.currentThrow.extraTurn" class="throw-extra">{{ t('extraTurn') }}</span>
          </div>

          <!-- Só mostra botão de nova peça; hint de board piece está no turn indicator -->
          <div v-if="isSelecting && hasHomeMoves" class="pick-inline">
            <span class="pick-sep">·</span>
            <button
              class="pick-btn"
              :class="{ 'pick-active': homeSelected }"
              @click="homeSelected ? executeHomeMove() : selectHomePiece()"
            >
              {{ homeSelected ? t('confirmPiece') : t('newPiece') }}
            </button>
          </div>
        </template>
      </div>
      </div><!-- bottom-bar-wrap -->
    </main>

    <!-- Direita: Log -->
    <aside class="sidebar sidebar-right">
      <GameLog :history="game.history" />
      <div class="game-controls">
        <button
          class="btn-secondary ctrl-btn undo-btn"
          :disabled="!canUndo"
          @click="onUndo"
        >{{ t('undo') }}</button>
        <button class="btn-secondary ctrl-btn" @click="onReset">{{ t('restart') }}</button>
        <button class="btn-secondary ctrl-btn" @click="onNewGame">{{ t('menu') }}</button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.game-layout {
  display: grid;
  grid-template-columns: 190px 1fr 190px;
  height: 100vh;
  overflow: hidden;
  background: var(--parchment);
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 10px;
  background: #fff;
  border-right: 1px solid var(--parchment-dark);
  overflow-y: auto;
}

.sidebar-right {
  border-right: none;
  border-left: 1px solid var(--parchment-dark);
}

.game-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  overflow: hidden;
  height: 100%;
}

.winner-banner {
  background: var(--ink);
  color: #fff;
  border-radius: 14px;
  padding: 16px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 380px;
  flex-shrink: 0;
}
.winner-crown { font-size: 28px; }
.winner-text  { font-size: 18px; font-family: 'Gowun Batang', serif; }
.winner-text strong { font-weight: 700; }
.winner-actions { display: flex; gap: 8px; }

.turn-indicator-wrap {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bottom-bar-wrap {
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
}

.turn-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 50px;
  padding: 7px 18px;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.turn-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.turn-text {
  font-size: 13px;
  font-weight: 400;
  color: var(--ink);
}
.turn-text strong { font-weight: 600; }

/* Board expands to fill available space */
.board-wrapper {
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.board-wrapper > * {
  max-height: 100%;
  max-width: 100%;
  aspect-ratio: 1;
}

/* bottom-bar: linha única, sem wrap, altura fixa */
.bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 14px;
  padding: 10px 16px;
  box-shadow: var(--shadow-sm);
  width: 100%;
  max-width: 560px;
  overflow: hidden;
  white-space: nowrap;
}

.pick-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.pick-sep {
  color: var(--node-border);
  font-size: 18px;
  line-height: 1;
}

.pick-btn {
  border: 1.5px solid var(--node-border);
  border-radius: 8px;
  background: var(--parchment);
  padding: 5px 11px;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink);
  transition: all 0.15s;
  white-space: nowrap;
}
.pick-btn:hover { border-color: var(--dancheong-blue); background: #fff; }
.pick-btn.pick-active {
  background: var(--dancheong-red);
  border-color: var(--dancheong-red);
  color: #fff;
}

.pick-or {
  font-size: 11px;
  color: var(--ink-light);
  font-style: italic;
}

.pick-hint {
  font-size: 11px;
  color: var(--ink-light);
  font-style: italic;
  white-space: nowrap;
}

.throw-btn {
  font-size: 15px;
  padding: 10px 24px;
}

.throw-result-label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.throw-name {
  font-family: 'Gowun Batang', serif;
  font-size: 18px;
  font-weight: 700;
}

.throw-steps {
  font-size: 14px;
  color: var(--ink-light);
  font-weight: 500;
}

.throw-extra {
  background: var(--dancheong-red);
  color: #fff;
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 600;
}

.game-controls {
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--parchment-dark);
  flex-shrink: 0;
}

.ctrl-btn {
  flex: 1;
  font-size: 11px;
  padding: 6px 4px;
}

.undo-btn:disabled {
  opacity: 0.35;
  cursor: default;
}

@media (max-width: 900px) {
  .game-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    height: 100vh;
    overflow: hidden;
  }

  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
    border-right: none;
    border-bottom: 1px solid var(--parchment-dark);
    padding: 10px;
    gap: 8px;
    overflow-y: visible;
    flex-shrink: 0;
  }

  .sidebar-right {
    border-left: none;
    border-top: 1px solid var(--parchment-dark);
    flex-shrink: 0;
    max-height: 140px;
  }

  .board-wrapper { max-width: min(100%, 60vh); }
}
</style>
