<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useLocale } from '@/composables/useLocale'
import GameSetup from '@/components/GameSetup.vue'

const router = useRouter()
const store = useGameStore()
const { t, locale, setLocale } = useLocale()
const showSetup = ref(false)
const hasSaved = ref(false)

onMounted(() => {
  hasSaved.value = store.hasSave()
})

function startNew() { showSetup.value = true }
function continueGame() { store.resumeGame(); router.push('/game') }
</script>

<template>
  <div class="home-screen">

    <!-- Language switcher — top-right -->
    <div class="lang-switcher">
      <button
        class="flag-btn"
        :class="{ active: locale === 'pt' }"
        title="Português"
        @click="setLocale('pt')"
      >🇧🇷</button>
      <button
        class="flag-btn"
        :class="{ active: locale === 'ko' }"
        title="한국어"
        @click="setLocale('ko')"
      >🇰🇷</button>
    </div>

    <div class="home-content">
      <div class="home-hero">
        <div class="hero-glyph">윷</div>
        <h1 class="hero-title">윷놀이</h1>
        <p class="hero-subtitle">{{ t('subtitle') }}</p>
      </div>

      <div v-if="!showSetup" class="home-actions">
        <button class="btn-primary home-btn" @click="startNew">
          {{ t('newGame') }}
        </button>
        <button
          v-if="hasSaved"
          class="btn-secondary home-btn"
          @click="continueGame"
        >
          {{ t('continueGame') }}
        </button>
      </div>

      <GameSetup v-if="showSetup" @back="showSetup = false" />

      <div v-if="!showSetup" class="home-rules">
        <h3>{{ t('howToPlay') }}</h3>
        <div class="rules-grid">
          <div class="rule-card">
            <span class="rule-icon">🎋</span>
            <strong>{{ t('rule1Title') }}</strong>
            <p>{{ t('rule1Body') }}</p>
          </div>
          <div class="rule-card">
            <span class="rule-icon">🏃</span>
            <strong>{{ t('rule2Title') }}</strong>
            <p>{{ t('rule2Body') }}</p>
          </div>
          <div class="rule-card">
            <span class="rule-icon">⚔️</span>
            <strong>{{ t('rule3Title') }}</strong>
            <p>{{ t('rule3Body') }}</p>
          </div>
          <div class="rule-card">
            <span class="rule-icon">🏆</span>
            <strong>{{ t('rule4Title') }}</strong>
            <p>{{ t('rule4Body') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-screen {
  height: 100vh;
  overflow-y: auto;
  background: var(--parchment);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
}

/* ── Language switcher ── */
.lang-switcher {
  position: fixed;
  top: 16px;
  right: 20px;
  display: flex;
  gap: 6px;
  z-index: 100;
}

.flag-btn {
  font-size: 22px;
  line-height: 1;
  padding: 5px 7px;
  border-radius: 8px;
  border: 2px solid transparent;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  transition: all 0.15s;
  opacity: 0.5;
  filter: grayscale(0.4);
}

.flag-btn:hover {
  opacity: 0.85;
  filter: grayscale(0);
}

.flag-btn.active {
  opacity: 1;
  filter: grayscale(0);
  border-color: var(--dancheong-red);
  box-shadow: 0 2px 8px rgba(192,57,43,0.25);
}

/* ── Rest unchanged ── */
.home-content {
  max-width: 720px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
}

.home-hero { text-align: center; }

.hero-glyph {
  font-family: 'Gowun Batang', serif;
  font-size: 72px;
  line-height: 1;
  color: var(--dancheong-red);
  margin-bottom: 8px;
  text-shadow: 0 4px 20px rgba(192,57,43,0.2);
}

.hero-title {
  font-family: 'Gowun Batang', serif;
  font-size: 44px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 6px;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
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
  font-size: 18px;
  text-align: center;
  margin: 0 0 16px;
  color: var(--ink-light);
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.rule-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  box-shadow: var(--shadow-sm);
}

.rule-icon { font-size: 20px; }

.rule-card strong {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: var(--ink);
}

.rule-card p {
  font-size: 12px;
  color: var(--ink-light);
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 480px) {
  .rules-grid { grid-template-columns: 1fr; }
  .hero-glyph { font-size: 56px; }
  .hero-title  { font-size: 32px; }
}
</style>
