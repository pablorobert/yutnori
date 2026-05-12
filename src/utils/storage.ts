import type { GameState } from '@/models/types'

const KEY = 'yutnori_game_v1'

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as GameState
  } catch {
    return null
  }
}

export function clearSave(): void {
  localStorage.removeItem(KEY)
}

export function hasSave(): boolean {
  return localStorage.getItem(KEY) !== null
}
