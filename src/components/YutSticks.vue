<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ThrowResult } from '@/models/types'

const props = defineProps<{
  result: ThrowResult | null
  isThrowing: boolean
  compact?: boolean
}>()

const animStates = ref([false, false, false, false])

watch(() => props.result, (newVal) => {
  if (!newVal) return
  animStates.value = [true, true, true, true]
  setTimeout(() => { animStates.value = [false, false, false, false] }, 900)
})
</script>

<template>
  <div class="sticks-row" :class="{ compact }">
    <div
      v-for="(isFlat, i) in (result?.sticks ?? [false, false, false, false])"
      :key="i"
      class="stick-wrap"
      :class="{ 'stick-throwing': animStates[i] }"
      :style="{ animationDelay: `${i * 70}ms` }"
    >
      <div class="stick" :class="{ flat: isFlat, round: !isFlat }">
        <!-- Flat side (belly) — light wood, grain lines -->
        <div class="stick-face front">
          <div class="grain-lines">
            <div v-for="n in 5" :key="n" class="grain-line" :style="{ left: `${10 + n * 14}%` }" />
          </div>
          <div class="flat-edge left" />
          <div class="flat-edge right" />
        </div>
        <!-- Round side (back) — dark, curved highlight -->
        <div class="stick-face back">
          <div class="curve-highlight" />
          <div class="back-dot" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticks-row {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  height: 80px;
  flex-shrink: 0;
}

.sticks-row.compact {
  gap: 7px;
  height: 54px;
}

.stick-wrap {
  perspective: 400px;
  width: 18px;
  height: 72px;
  flex-shrink: 0;
}

.compact .stick-wrap {
  width: 14px;
  height: 50px;
}

.stick {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.34, 1.2, 0.64, 1);
  border-radius: 3px;
}

.stick.flat  { transform: rotateX(0deg); }
.stick.round { transform: rotateX(180deg); }

.stick-face {
  position: absolute;
  inset: 0;
  border-radius: 3px;
  backface-visibility: hidden;
  overflow: hidden;
}

/* ── FLAT SIDE (belly, light) ── */
.front {
  background: linear-gradient(
    to bottom,
    #e8d5a0 0%,
    #d9c278 30%,
    #cdb560 60%,
    #d2bc70 100%
  );
  border: 1px solid #b8973a;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
}

.grain-lines {
  position: absolute;
  inset: 0;
}

.grain-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(140, 90, 20, 0.18);
}

/* Slight shadow on left/right edges — shows flat face of half-cylinder */
.flat-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(100, 60, 0, 0.22);
}
.flat-edge.left  { left: 0; }
.flat-edge.right { right: 0; }

/* ── ROUND SIDE (back, dark) ── */
.back {
  background: linear-gradient(
    to right,
    #2a1a0a 0%,
    #5c3515 18%,
    #7a4820 35%,
    #8c5528 50%,
    #7a4820 65%,
    #5c3515 82%,
    #2a1a0a 100%
  );
  border: 1px solid #1a0e06;
  transform: rotateX(180deg);
}

/* Central highlight simulating curved surface catching light */
.curve-highlight {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 35%;
  background: linear-gradient(
    to bottom,
    rgba(255,200,120,0.15) 0%,
    rgba(255,200,120,0.25) 40%,
    rgba(255,200,120,0.12) 100%
  );
  border-radius: 0 0 2px 2px;
}

/* Small decorative dot (traditional carving mark) */
.back-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: radial-gradient(circle, #c87040 30%, #6b2e10 100%);
  opacity: 0.8;
}

.compact .back-dot {
  width: 3px;
  height: 3px;
}

/* ── THROW ANIMATION ── */
.stick-throwing {
  animation: stickThrow 0.75s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes stickThrow {
  0%   { transform: rotateX(0deg) translateY(0px); opacity: 1; }
  25%  { transform: rotateX(540deg) translateY(-18px); opacity: 0.9; }
  70%  { transform: rotateX(900deg) translateY(4px); opacity: 1; }
  100% { transform: rotateX(var(--final-rot, 0deg)) translateY(0px); }
}
</style>
