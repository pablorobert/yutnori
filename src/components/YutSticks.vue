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
      :style="{ animationDelay: `${i * 60}ms` }"
    >
      <div class="stick" :class="{ flat: isFlat, round: !isFlat }">
        <div class="stick-face front"><div class="stick-grain"></div></div>
        <div class="stick-face back"><div class="stick-pattern"></div></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticks-row {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  height: 64px;
  flex-shrink: 0;
}

.sticks-row.compact {
  gap: 6px;
  height: 40px;
}

.stick-wrap {
  perspective: 300px;
  width: 40px;
  height: 56px;
  flex-shrink: 0;
}

.compact .stick-wrap {
  width: 24px;
  height: 36px;
}

.stick {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  border-radius: 6px;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stick.flat  { transform: rotateX(0deg); }
.stick.round { transform: rotateX(180deg); }

.stick-face {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  backface-visibility: hidden;
}

.front {
  background: linear-gradient(135deg, #e8d9b8 0%, #d4c090 60%, #c8a870 100%);
  border: 1.5px solid #b8983c;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back {
  background: linear-gradient(135deg, #4a3520 0%, #2e1f0f 60%, #1a1008 100%);
  transform: rotateX(180deg);
  border: 1.5px solid #1a0e06;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stick-grain {
  width: 60%;
  height: 80%;
  background: repeating-linear-gradient(
    90deg,
    transparent 0px, transparent 2px,
    rgba(160,120,40,0.3) 2px, rgba(160,120,40,0.3) 3px
  );
  border-radius: 2px;
}

.stick-pattern {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle, #6b4020 30%, transparent 70%);
}

.stick-throwing {
  animation: stickThrow 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
</style>
