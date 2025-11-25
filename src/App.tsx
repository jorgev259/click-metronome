import { Howl } from 'howler'
import { useRef, useState } from 'react'

import clickStrong from './sounds/click-strong.wav'
import clickWeak from './sounds/click-weak.wav'

interface Step {
  index: number
  compasses: number
  measure: number
  bpm: number
  label?: string
  times?: number
}

interface Beat {
  index: number
  duration: number
  step: number
  type: 'strong' | 'weak'
  compass: number
}

function bpmToMilliseconds(bpm: number): number {
  return 60000 / bpm
}

function stepsToBeats(steps: Step[]): Beat[] {
  const beats: Beat[] = []
  let fullCompass = 0

  steps.forEach((step) => {
    const startCompass = fullCompass
    for (let times = 1; times <= (step.times ?? 1); times++) {
      fullCompass = startCompass
      for (let compass = 1; compass <= step.compasses; compass++) {
        ++fullCompass
        for (let beat = 1; beat <= step.measure; beat++) {
          beats.push({
            index: beats.length,
            duration: bpmToMilliseconds(step.bpm),
            step: step.index,
            type: beat === 1 ? 'strong' : 'weak',
            compass: fullCompass
          })
        }
      }
    }
  })
  return beats
}

const strongSound = new Howl({ src: [clickStrong], preload: true })
const weakSound = new Howl({ src: [clickWeak], preload: true })

function App(props: { song: Step[] }) {
  const { song } = props
  const beats = stepsToBeats(song)

  const [playing, setPlaying] = useState(false)
  const [compass, setCompass] = useState(0)
  const [currentStep, setStep] = useState(0)
  const playTimeout = useRef<number | null>(null)

  function startBeats() {
    const beatIndex = beats.findIndex((b) => b.step === currentStep)
    const currentBeats = beats.slice(beatIndex)

    setPlaying(true)
    playBeats(currentBeats)
  }

  function playBeats(beats: Beat[]) {
    const beat = beats[0]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!beat) {
      setPlaying(false)
      return
    }

    const sound = beat.type === 'strong' ? strongSound : weakSound
    if (beat.compass !== compass) setCompass(beat.compass)
    if (currentStep !== beat.step) setStep(beat.step)
    sound.play()

    playTimeout.current = setTimeout(() => {
      playBeats(beats.slice(1))
    }, beats[0].duration)
  }

  function stepTo(step: Step) {
    const beat = beats.find((b) => b.step === step.index)
    setStep(step.index)
    if (beat) setCompass(beat.compass)
  }

  function pauseBeats() {
    if (playTimeout.current !== null) clearTimeout(playTimeout.current)
    setPlaying(false)
  }

  function getFullCompass(step: Step) {
    const beat = beats.find((b) => b.step === step.index)
    if (!beat) return 0

    return beat.compass
  }

  return (
    <div>
      <div className='space-y-4'>
        <div className='mb-4'>
          <h2 className='font-bold text-lg mb-2'>Steps:</h2>
          <div className='space-y-2'>
            {song.map((step) => (
              <button
                type='button'
                key={step.index}
                disabled={currentStep === step.index || playing}
                className={`flex p-2 rounded w-full justify-start space-x-1 ${
                  currentStep === step.index
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200'
                }`}
                onClick={() => {
                  stepTo(step)
                }}
              >
                <span className='font-bold'>{getFullCompass(step)}</span>
                <span>|</span>
                <span>
                  {step.compasses} compasses × {step.measure} beats @ {step.bpm}{' '}
                  BPM
                </span>
                {step.label && (
                  <>
                    <span>-</span>
                    <span className='font-bold'>{step.label}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className='mb-4 p-4 bg-blue-100 rounded'>
        <p className='text-lg font-semibold'>
          Current Compass: <span className='text-blue-700'>{compass}</span>
        </p>
      </div>
      <button
        type='button'
        className={`text-white mt-2 p-4 rounded-md ${
          playing ? 'bg-red-700' : 'bg-blue-700'
        }`}
        onClick={playing ? pauseBeats : startBeats}
      >
        {playing ? 'Pause' : 'Start click'}
      </button>
    </div>
  )
}

export default App
