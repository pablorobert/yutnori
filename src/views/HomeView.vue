<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import GameSetup from '@/components/GameSetup.vue'

const router = useRouter()
const store = useGameStore()
const showSetup = ref(false)
const hasSaved = ref(false)

onMounted(() => {
  hasSaved.value = store.hasSave()
})

function startNew() {
  showSetup.value = true
}

function continueGame() {
  store.resumeGame()
  router.push('/game')
}
</script>

<template>
  <div class="home-screen">
    <div class="home-content">
      <div class="home-hero">
        <div class="hero-glyph">윷</div>
        <h1 class="hero-title">윷놀이</h1>
        <p class="hero-subtitle">Yutnori · Traditional Korean Board Game</p>
      </div>

      <div v-if="!showSetup" class="home-actions">
        <button class="btn-primary home-btn" @click="startNew">
          New Game
        </button>
        <button
          v-if="hasSaved"
          class="btn-secondary home-btn"
          @click="continueGame"
        >
          Continue Game
        </button>
      </div>

      <GameSetup v-if="showSetup" @back="showSetup = false" />

      <div class="home-rules">
        <h3>How to Play</h3>
        <div class="rules-grid">
          <div class="rule-card">
            <span class="rule-icon">🎋</span>
            <strong>Throw Sticks</strong>
            <p>Throw 4 yut sticks. Each has a flat (white) and round (dark) side.</p>
          </div>
          <div class="rule-card">
            <span class="rule-icon">🏃</span>
            <strong>Move Pieces</strong>
            <p>Do=1, Gae=2, Geol=3, Yut=4, Mo=5. Yut & Mo give an extra throw!</p>
          </div>
          <div class="rule-card">
            <span class="rule-icon">⚔️</span>
            <strong>Capture</strong>
            <p>Land on an enemy piece to send it back home. You earn another throw!</p>
          </div>
          <div class="rule-card">
            <span class="rule-icon">🏆</span>
            <strong>Win</strong>
            <p>First player to bring all pieces around the board and home wins!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-screen {
  min-height: 100vh;
  background: var(--parchment);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.home-content {
  max-width: 720px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
}

.home-hero {
  text-align: center;
}

.hero-glyph {
  font-family: 'Gowun Batang', serif;
  font-size: 80px;
  line-height: 1;
  color: var(--dancheong-red);
  margin-bottom: 12px;
  text-shadow: 0 4px 20px rgba(192,57,43,0.2);
}

.hero-title {
  font-family: 'Gowun Batang', serif;
  font-size: 48px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 8px;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  color: var(--ink-light);
  margin: 0;
  letter-spacing: 0.5px;
}

.home-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.home-btn {
  min-width: 160px;
  font-size: 16px;
}

.home-rules h3 {
  font-family: 'Gowun Batang', serif;
  font-size: 20px;
  text-align: center;
  margin: 0 0 20px;
  color: var(--ink-light);
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.rule-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: var(--shadow-sm);
}

.rule-icon {
  font-size: 24px;
}

.rule-card strong {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: var(--ink);
}

.rule-card p {
  font-size: 13px;
  color: var(--ink-light);
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 480px) {
  .rules-grid { grid-template-columns: 1fr; }
  .hero-glyph { font-size: 60px; }
  .hero-title  { font-size: 36px; }
}
</style>
