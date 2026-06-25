type StepBase = {
  compasses: number
  measure?: number
  bpm?: number
  label?: string
  endRepeat?: boolean
  startRit?: boolean
}

type StepWithRepeat = StepBase & {
  startRepeat: true
  times?: number
}

export type Step = StepBase | StepWithRepeat

export type FullStep = Omit<Step, 'measure' | 'bpm' | 'times'> & {
  startRepeat?: boolean
  startRit?: boolean
  index: number
  measure: number
  bpm: number
  repeat: boolean
}

export interface Beat {
  index: number
  duration: number
  step: number
  type: 'strong' | 'weak'
  compass: number
}
