<script setup lang="ts">
import type { Player, GamePhase } from '@/models/types'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{
  player: Player
  isActive: boolean
  gamePhase: GamePhase
}>()

const { t } = useLocale()
const homePieces = () => props.player.pieces.filter(p => p.state === 'home').length
const boardPieces = () => props.player.pieces.filter(p => p.state === 'board').length
const finishedPieces = () => props.player.pieces.filter(p => p.state === 'finished').length
const total = () => props.player.pieces.length
</script>

<template>
  <div
    class="player-panel"
    :class="{ 'panel-active': isActive }"
    :style="{ '--p-color': player.color }"
  >
    <div class="panel-header">
      <span class="player-color-dot"></span>
      <span class="player-name">{{ player.name }}</span>
      <span v-if="isActive && gamePhase === 'playing'" class="active-badge">{{ t('turnBadge') }}</span>
    </div>

    <div class="piece-track">
      <div
        v-for="piece in player.pieces"
        :key="piece.id"
        class="piece-pip"
        :class="{
          'pip-home': piece.state === 'home',
          'pip-board': piece.state === 'board',
          'pip-done': piece.state === 'finished',
        }"
        :title="piece.state"
      ></div>
    </div>

    <div class="stats">
      <div class="stat">
        <span class="stat-val">{{ homePieces() }}</span>
        <span class="stat-lbl">{{ t('stateHome') }}</span>
      </div>
      <div class="stat">
        <span class="stat-val">{{ boardPieces() }}</span>
        <span class="stat-lbl">{{ t('stateBoard') }}</span>
      </div>
      <div class="stat">
        <span class="stat-val">{{ finishedPieces() }}</span>
        <span class="stat-lbl">{{ t('stateFinished') }}</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: (finishedPieces() / total() * 100) + '%' }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.player-panel {
  border-radius: 14px;
  padding: 14px;
  background: var(--parchment);
  border: 2px solid transparent;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-active {
  background: #fff;
  border-color: var(--p-color);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--p-color) 15%, transparent);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.player-color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--p-color);
  flex-shrink: 0;
}

.player-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.active-badge {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--p-color);
  background: color-mix(in srgb, var(--p-color) 12%, transparent);
  padding: 2px 5px;
  border-radius: 4px;
}

.piece-track {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.piece-pip {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transition: all 0.2s;
}

.pip-home   { background: #d4c5a9; border: 1.5px solid #b8a888; }
.pip-board  { background: var(--p-color); border: 1.5px solid var(--p-color); }
.pip-done   { background: var(--p-color); opacity: 0.3; border: 1.5px dashed var(--p-color); }

.stats {
  display: flex;
  gap: 0;
  text-align: center;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.stat-val {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
}

.stat-lbl {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--ink-light);
}

.progress-bar {
  height: 4px;
  background: #e8dcc8;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--p-color);
  border-radius: 2px;
  transition: width 0.4s ease;
}
</style>
