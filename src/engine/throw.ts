import type { ThrowResult, ThrowName } from '@/models/types'

// Each stick: true = flat/white side up, false = round/dark side up.
// With fair sticks (p=0.5 each), distribution:
//   0 flat (Mo):  1/16 = 6.25%  → 5 steps + extra
//   1 flat (Do):  4/16 = 25%    → 1 step
//   2 flat (Gae): 6/16 = 37.5%  → 2 steps
//   3 flat (Geol):4/16 = 25%    → 3 steps
//   4 flat (Yut): 1/16 = 6.25%  → 4 steps + extra
function throwSticks(): ThrowResult {
  const sticks: [boolean, boolean, boolean, boolean] = [
    Math.random() < 0.5,
    Math.random() < 0.5,
    Math.random() < 0.5,
    Math.random() < 0.5,
  ]
  const flatCount = sticks.filter(Boolean).length
  return resolveThrow(sticks, flatCount)
}

function resolveThrow(
  sticks: [boolean, boolean, boolean, boolean],
  flatCount: number
): ThrowResult {
  const map: Record<number, { name: ThrowName; steps: number; extraTurn: boolean }> = {
    0: { name: 'mo',   steps: 5, extraTurn: true  },
    1: { name: 'do',   steps: 1, extraTurn: false },
    2: { name: 'gae',  steps: 2, extraTurn: false },
    3: { name: 'geol', steps: 3, extraTurn: false },
    4: { name: 'yut',  steps: 4, extraTurn: true  },
  }
  const { name, steps, extraTurn } = map[flatCount]
  return { sticks, name, steps, extraTurn }
}

// Seeded throw for replay/debug
function throwWithSeed(seed: number): ThrowResult {
  const rng = seededRng(seed)
  const sticks: [boolean, boolean, boolean, boolean] = [
    rng() < 0.5, rng() < 0.5, rng() < 0.5, rng() < 0.5,
  ]
  return resolveThrow(sticks, sticks.filter(Boolean).length)
}

function seededRng(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

export const throwEngine = { throwSticks, throwWithSeed }

export const THROW_NAMES: Record<ThrowResult['name'], string> = {
  do:   '도 (Do)',
  gae:  '개 (Gae)',
  geol: '걸 (Geol)',
  yut:  '윷 (Yut)',
  mo:   '모 (Mo)',
}

export const THROW_COLORS: Record<ThrowResult['name'], string> = {
  do:   '#2d6a4f',
  gae:  '#1a3a5c',
  geol: '#6b46c1',
  yut:  '#c77d0a',
  mo:   '#c0392b',
}
