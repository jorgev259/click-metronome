import type { Step, Beat, FullStep } from './types'

function bpmToMilliseconds(bpm: number): number {
  return 60000 / bpm
}

export function stepsToBeats(steps: Step[]): {
  beats: Beat[]
  steps: FullStep[]
} {
  const beats: Beat[] = []
  const fullSteps: FullStep[] = []
  let fullCompass = 0

  if (!steps[0].measure || !steps[0].bpm)
    throw new Error('Song has no initial BPM or measure')

  let measure = steps[0].measure
  let bpm = steps[0].bpm
  let index = -1
  let repeat = false

  let repeatBuffer: FullStep[] = []
  let repeatTimes = 0
  let inRepeat = false

  let ritBuffer: FullStep[] = []
  let inRit = false
  let ritBpmStart = 0

  const generateBeats = (fullStep: FullStep) => {
    for (let compass = 1; compass <= fullStep.compasses; compass++) {
      ++fullCompass
      for (let beat = 1; beat <= fullStep.measure; beat++) {
        beats.push({
          index: beats.length,
          duration: bpmToMilliseconds(fullStep.bpm),
          step: fullStep.index,
          type: beat === 1 ? 'strong' : 'weak',
          compass: fullCompass
        })
      }
    }
  }

  const generateRitBeats = (
    ritSteps: FullStep[],
    bpmStart: number,
    bpmEnd: number
  ) => {
    let totalBeats = 0
    for (const s of ritSteps) {
      totalBeats += s.compasses * s.measure
    }
    let beatInRit = 0
    for (const s of ritSteps) {
      for (let compass = 1; compass <= s.compasses; compass++) {
        ++fullCompass
        for (let beat = 1; beat <= s.measure; beat++) {
          const t = totalBeats > 1 ? beatInRit / (totalBeats - 1) : 0
          const currentBpm = bpmStart + (bpmEnd - bpmStart) * t
          beats.push({
            index: beats.length,
            duration: bpmToMilliseconds(currentBpm),
            step: s.index,
            type: beat === 1 ? 'strong' : 'weak',
            compass: fullCompass
          })
          beatInRit++
        }
      }
    }
  }

  steps.forEach((step) => {
    if ('startRepeat' in step) {
      repeat = true
      repeatTimes = step.times ?? 2
      repeatBuffer = []
      inRepeat = true
    }

    measure = step.measure || measure
    bpm = step.bpm || bpm
    index++

    const { compasses, label } = step
    const fullStep: FullStep = {
      compasses,
      label,
      startRepeat: 'startRepeat' in step ? true : undefined,
      startRit: 'startRit' in step ? true : undefined,
      endRepeat: step.endRepeat,
      index,
      measure,
      bpm,
      repeat
    }
    fullSteps.push(fullStep)

    if (inRepeat) {
      repeatBuffer.push(fullStep)
    }

    const stepOwnBpm = step.bpm

    if (!inRepeat) {
      if ('startRit' in step) {
        inRit = true
        ritBuffer = [fullStep]
        ritBpmStart = bpm
      } else if (inRit) {
        if (stepOwnBpm) {
          generateRitBeats(ritBuffer, ritBpmStart, stepOwnBpm)
          ritBuffer = []
          inRit = false
        } else {
          ritBuffer.push(fullStep)
        }
      }
    }

    if (step.endRepeat) {
      if (repeatBuffer.length > 0) {
        const repeatStartCompass = fullCompass
        for (let r = 0; r < repeatTimes; r++) {
          if (r > 0) fullCompass = repeatStartCompass
          for (const s of repeatBuffer) {
            generateBeats(s)
          }
        }
      }
      repeatBuffer = []
      inRepeat = false
      repeat = false
    } else if (!inRepeat && !inRit) {
      generateBeats(fullStep)
    }
  })

  if (repeatBuffer.length > 0) {
    const repeatStartCompass = fullCompass
    for (let r = 0; r < repeatTimes; r++) {
      if (r > 0) fullCompass = repeatStartCompass
      for (const s of repeatBuffer) {
        generateBeats(s)
      }
    }
  }

  if (ritBuffer.length > 0) {
    for (const s of ritBuffer) {
      generateBeats(s)
    }
  }

  return { beats, steps: fullSteps }
}
