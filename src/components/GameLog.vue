<script setup lang="ts">
import type { HistoryEntry } from '@/models/types'
import { THROW_NAMES, THROW_COLORS } from '@/engine/throw'

defineProps<{ history: HistoryEntry[] }>()
</script>

<template>
  <div class="log-panel">
    <h3 class="log-title">Histórico</h3>
    <div class="log-entries">
      <div v-if="history.length === 0" class="log-empty">
        Nenhuma jogada ainda.
      </div>
      <div
        v-for="entry in history.slice(0, 30)"
        :key="entry.id"
        class="log-entry"
      >
        <span class="entry-dot" :style="{ background: entry.playerColor }"></span>
        <div class="entry-body">
          <span class="entry-name">{{ entry.playerName }}</span>
          <span
            class="entry-throw"
            :style="{ color: THROW_COLORS[entry.throwResult.name] }"
          >{{ THROW_NAMES[entry.throwResult.name] }}</span>
          <span v-if="entry.move?.isCapture" class="entry-capture">⚔️ captura!</span>
          <span v-if="entry.move === null" class="entry-nomove">sem movimentos</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}

.log-title {
  font-family: 'Gowun Batang', serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--parchment-dark);
}

.log-entries {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.log-empty {
  font-size: 12px;
  color: var(--ink-light);
  text-align: center;
  margin-top: 16px;
}

.log-entry {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.entry-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.entry-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.entry-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink);
}

.entry-throw {
  font-size: 12px;
  font-weight: 700;
}

.entry-capture {
  font-size: 10px;
  color: var(--dancheong-red);
}

.entry-nomove {
  font-size: 10px;
  color: var(--ink-light);
  font-style: italic;
}
</style>
