import type { NodeId, RouteId } from '@/models/types'

export interface BoardNodeDef {
  id: NodeId
  x: number
  y: number
  type: 'home' | 'normal' | 'corner' | 'center'
  label?: string
}

// ViewBox 600x600. Outer square: corners at 90 and 510 (margin=90, size=420).
// Each side divided into 5 equal steps = 84px apart.
const M = 90   // margin
const S = 510  // 90 + 420

export const BOARD_NODES: Record<NodeId, BoardNodeDef> = {
  // SE corner = home/start/finish
  home: { id: 'home', x: S,   y: S,   type: 'home',   label: '🏠' },

  // Right edge going UP (home → ne)
  e1:   { id: 'e1',  x: S,   y: 426, type: 'normal' },
  e2:   { id: 'e2',  x: S,   y: 342, type: 'normal' },
  e3:   { id: 'e3',  x: S,   y: 258, type: 'normal' },
  e4:   { id: 'e4',  x: S,   y: 174, type: 'normal' },

  // NE corner
  ne:   { id: 'ne',  x: S,   y: M,   type: 'corner'  },

  // Top edge going LEFT (ne → nw)
  n1:   { id: 'n1',  x: 426, y: M,   type: 'normal' },
  n2:   { id: 'n2',  x: 342, y: M,   type: 'normal' },
  n3:   { id: 'n3',  x: 258, y: M,   type: 'normal' },
  n4:   { id: 'n4',  x: 174, y: M,   type: 'normal' },

  // NW corner
  nw:   { id: 'nw',  x: M,   y: M,   type: 'corner'  },

  // Left edge going DOWN (nw → sw)
  w1:   { id: 'w1',  x: M,   y: 174, type: 'normal' },
  w2:   { id: 'w2',  x: M,   y: 258, type: 'normal' },
  w3:   { id: 'w3',  x: M,   y: 342, type: 'normal' },
  w4:   { id: 'w4',  x: M,   y: 426, type: 'normal' },

  // SW corner
  sw:   { id: 'sw',  x: M,   y: S,   type: 'corner'  },

  // Bottom edge going RIGHT (sw → home)
  s1:   { id: 's1',  x: 174, y: S,   type: 'normal' },
  s2:   { id: 's2',  x: 258, y: S,   type: 'normal' },
  s3:   { id: 's3',  x: 342, y: S,   type: 'normal' },
  s4:   { id: 's4',  x: 426, y: S,   type: 'normal' },

  // NE diagonal shortcut nodes (ne → center → sw)
  ne_a: { id: 'ne_a', x: 405, y: 195, type: 'normal' },
  ne_b: { id: 'ne_b', x: 352, y: 248, type: 'normal' },
  center: { id: 'center', x: 300, y: 300, type: 'center', label: '✦' },
  sw_b: { id: 'sw_b', x: 248, y: 352, type: 'normal' },
  sw_a: { id: 'sw_a', x: 195, y: 405, type: 'normal' },

  // NW diagonal shortcut nodes (nw → center → home/se)
  nw_a: { id: 'nw_a', x: 195, y: 195, type: 'normal' },
  nw_b: { id: 'nw_b', x: 248, y: 248, type: 'normal' },
  se_b: { id: 'se_b', x: 352, y: 352, type: 'normal' },
  se_a: { id: 'se_a', x: 405, y: 405, type: 'normal' },
}

// Routes: arrays of nodeIds. A piece finishes when it moves past the last index.
// Pieces entering board from home go to ROUTES.main[steps] (index = steps value).
// On-board pieces: newIndex = currentIndex + steps; if >= length → finished.
export const ROUTES: Record<RouteId, NodeId[]> = {
  // Main outer loop (20 nodes, index 0–19)
  main: [
    'home',           // 0
    'e1', 'e2', 'e3', 'e4',  // 1–4
    'ne',             // 5  ← fork: can take 'ne' shortcut
    'n1', 'n2', 'n3', 'n4',  // 6–9
    'nw',             // 10 ← fork: can take 'nw' shortcut
    'w1', 'w2', 'w3', 'w4',  // 11–14
    'sw',             // 15
    's1', 's2', 's3', 's4',  // 16–19
    // index 20 → finished
  ],

  // NE shortcut (starts at 'ne', goes through center to sw, then tail to finish)
  ne: [
    'ne',                   // 0
    'ne_a', 'ne_b',         // 1–2
    'center',               // 3
    'sw_b', 'sw_a',         // 4–5
    'sw',                   // 6
    's1', 's2', 's3', 's4', // 7–10
    // index 11 → finished
  ],

  // NW shortcut (starts at 'nw', goes through center to home/finish)
  nw: [
    'nw',                   // 0
    'nw_a', 'nw_b',         // 1–2
    'center',               // 3
    'se_b', 'se_a',         // 4–5
    // index 6 → finished
  ],
}

// Corners that offer a shortcut fork when a piece starts its move there
export const FORK_CORNERS: Partial<Record<NodeId, RouteId>> = {
  ne: 'ne',
  nw: 'nw',
}

export function nodeIdAt(routeId: RouteId, idx: number): NodeId | null {
  const r = ROUTES[routeId]
  return idx < r.length ? r[idx] : null
}

export function nodePosition(id: NodeId): { x: number; y: number } {
  return BOARD_NODES[id] ?? { x: 300, y: 300 }
}

export function isFinished(routeId: RouteId, idx: number): boolean {
  return idx >= ROUTES[routeId].length
}

// Lines to draw for outer ring
export const OUTER_LINES: [NodeId, NodeId][] = [
  ['home', 'e1'], ['e1', 'e2'], ['e2', 'e3'], ['e3', 'e4'], ['e4', 'ne'],
  ['ne', 'n1'],   ['n1', 'n2'], ['n2', 'n3'], ['n3', 'n4'], ['n4', 'nw'],
  ['nw', 'w1'],   ['w1', 'w2'], ['w2', 'w3'], ['w3', 'w4'], ['w4', 'sw'],
  ['sw', 's1'],   ['s1', 's2'], ['s2', 's3'], ['s3', 's4'], ['s4', 'home'],
]

// Lines for diagonals
export const DIAGONAL_LINES: [NodeId, NodeId][] = [
  ['ne', 'ne_a'],   ['ne_a', 'ne_b'],   ['ne_b', 'center'],
  ['center', 'sw_b'], ['sw_b', 'sw_a'], ['sw_a', 'sw'],
  ['nw', 'nw_a'],   ['nw_a', 'nw_b'],   ['nw_b', 'center'],
  ['center', 'se_b'], ['se_b', 'se_a'], ['se_a', 'home'],
]
