import { useRef, useState } from 'react'

import { Howl } from 'howler'

import type { Beat, FullStep } from '../lib/types'

import clickStrong from '../sounds/click-strong.wav'
import clickWeak from '../sounds/click-weak.wav'

const strongSound = new Howl({ src: [clickStrong], preload: true })
const weakSound = new Howl({ src: [clickWeak], preload: true })

export default function PlayControls(props: {
  steps: FullStep[]
  beats: Beat[]
  playing: boolean
  setPlaying: (playing: boolean) => void
  currentStep: number
  setStep: (step: number) => void
  compass: number
  setCompass: (compass: number) => void
  currentBpm: number
  setCurrentBpm: (bpm: number) => void
}) {
  const {
    steps,
    beats,
    playing,
    setPlaying,
    currentStep,
    setStep,
    compass,
    setCompass,
    currentBpm,
    setCurrentBpm
  } = props

  const [speed, setSpeed] = useState(100)
  const playTimeout = useRef<number | null>(null)

  function pauseBeats() {
    if (playTimeout.current !== null) clearTimeout(playTimeout.current)
    setPlaying(false)
  }

  function getCurrentLabel() {
    for (let i = currentStep; i >= 0; i--) {
      if (steps[i].label) return steps[i].label
    }
  }

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
    setCurrentBpm(Math.round(60000 / beat.duration))
    sound.play()

    const delay = beats[0].duration * (100 / speed)
    playTimeout.current = setTimeout(() => {
      playBeats(beats.slice(1))
    }, delay)
  }

  return (
    <>
      <div className='mb-4 p-4 bg-blue-100 rounded'>
        <p className='text-lg font-semibold'>
          Current Section:{' '}
          <span className='text-blue-700'>{getCurrentLabel()}</span>
        </p>
        <p className='text-lg font-semibold'>
          Current Compass: <span className='text-blue-700'>{compass}</span>
        </p>
        <p className='text-lg font-semibold'>
          Current BPM: <span className='text-blue-700'>{currentBpm}</span>
        </p>
      </div>
      <div className='flex items-center gap-4 mt-2'>
        <button
          type='button'
          className={`text-white p-4 rounded-md ${
            playing ? 'bg-red-700' : 'bg-blue-700'
          }`}
          onClick={playing ? pauseBeats : startBeats}
        >
          {playing ? 'Pause' : 'Start click'}
        </button>
        <label className='flex items-center gap-2 text-sm font-semibold'>
          <span>Speed:</span>
          <input
            type='range'
            min='1'
            max='100'
            value={speed}
            onChange={(e) => {
              setSpeed(Number(e.target.value))
            }}
            className='w-24'
          />
          <span className='w-8'>{speed}%</span>
        </label>
      </div>
    </>
  )
}
