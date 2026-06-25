import type { Step } from '../lib/types'

export const presagioSteps: Step[] = [
  { label: 'Viento y Pajaros', bpm: 88, measure: 4, compasses: 6 },
  { label: 'Cantar', compasses: 8 },
  { label: 'Intro', compasses: 4 },
  { label: 'A', compasses: 8 },
  { label: 'B', compasses: 4 },
  { label: 'B (rit)', compasses: 2, startRit: true },
  { label: 'B', compasses: 2, bpm: 84 },
  { label: 'C', measure: 4, compasses: 1, startRepeat: true },
  { measure: 3, compasses: 2 },
  { measure: 4, compasses: 1, endRepeat: true },
  { measure: 4, compasses: 6 }
]
