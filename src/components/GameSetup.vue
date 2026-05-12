<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useLocale } from '@/composables/useLocale'
import type { GameSettings } from '@/models/types'

const emit = defineEmits<{ back: [] }>()
const router = useRouter()
const store = useGameStore()
const { t } = useLocale()

const playerCount = ref(2)
const piecesPerPlayer = ref(4)
const playerNames = ref([1, 2, 3, 4].map(n => `${t('playerDefault')} ${n}`))
const COLORS = ['#c0392b', '#1a3a5c', '#2d6a4f', '#c77d0a']

const activePlayers = computed(() => playerNames.value.slice(0, playerCount.value))

function startGame() {
  const settings: GameSettings = {
    playerCount: playerCount.value,
    piecesPerPlayer: piecesPerPlayer.value,
    playerNames: activePlayers.value,
  }
  store.startGame(settings)
  router.push('/game')
}
</script>

<template>
  <div class="setup-card">
    <div class="setup-header">
      <button class="back-btn" @click="emit('back')">{{ t('back') }}</button>
      <h2>{{ t('setupTitle') }}</h2>
    </div>

    <div class="setup-section">
      <label>{{ t('players') }}</label>
      <div class="btn-group">
        <button
          v-for="n in [2, 3, 4]"
          :key="n"
          :class="['count-btn', { active: playerCount === n }]"
          @click="playerCount = n"
        >{{ n }}</button>
      </div>
    </div>

    <div class="setup-section">
      <label>{{ t('piecesPerPlayer') }}</label>
      <div class="btn-group">
        <button
          v-for="n in [2, 3, 4, 5]"
          :key="n"
          :class="['count-btn', { active: piecesPerPlayer === n }]"
          @click="piecesPerPlayer = n"
        >{{ n }}</button>
      </div>
    </div>

    <div class="setup-section">
      <label>{{ t('playerNames') }}</label>
      <div class="names-list">
        <div
          v-for="i in playerCount"
          :key="i"
          class="name-row"
        >
          <span class="player-dot" :style="{ background: COLORS[i-1] }"></span>
          <input
            v-model="playerNames[i-1]"
            class="name-input"
            :placeholder="`${t('playerDefault')} ${i}`"
          />
        </div>
      </div>
    </div>

    <button class="btn-primary start-btn" @click="startGame">
      {{ t('startGame') }}
    </button>
  </div>
</template>

<style scoped>
.setup-card {
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setup-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ink-light);
  font-size: 14px;
  font-family: 'Outfit', sans-serif;
  padding: 0;
}
.back-btn:hover { color: var(--ink); }

h2 {
  font-family: 'Gowun Batang', serif;
  font-size: 22px;
  margin: 0;
  color: var(--ink);
}

.setup-section label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-light);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 10px;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.count-btn {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 2px solid var(--node-border);
  background: var(--parchment);
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--ink);
}
.count-btn:hover { border-color: var(--dancheong-blue); }
.count-btn.active {
  background: var(--dancheong-blue);
  border-color: var(--dancheong-blue);
  color: #fff;
}

.names-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.player-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
}

.name-input {
  flex: 1;
  border: 2px solid var(--node-border);
  border-radius: 10px;
  padding: 8px 12px;
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  color: var(--ink);
  background: var(--parchment);
  outline: none;
  transition: border-color 0.15s;
}
.name-input:focus { border-color: var(--dancheong-blue); }

.start-btn {
  width: 100%;
  font-size: 16px;
  padding: 14px;
}
</style>
