import { useRef, useState } from 'react'

import type { Step, Beat } from './lib/types'
import { stepsToBeats, strongSound, weakSound } from './lib/steps'
import StepsTable from './components/StepsTable'

function App(props: { song: Step[] }) {
  const { song } = props
  const { beats, steps } = stepsToBeats(song)

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

  function pauseBeats() {
    if (playTimeout.current !== null) clearTimeout(playTimeout.current)
    setPlaying(false)
  }

  function getCurrentLabel() {
    for (let i = currentStep; i >= 0; i--) {
      if (steps[i].label) return steps[i].label
    }
  }

  return (
    <div>
      <div className='space-y-4'>
        <StepsTable
          steps={steps}
          beats={beats}
          currentStep={currentStep}
          playing={playing}
          onStepTo={(step) => {
            const beat = beats.find((b) => b.step === step.index)
            setStep(step.index)
            if (beat) setCompass(beat.compass)
          }}
        />
      </div>
      <div className='mb-4 p-4 bg-blue-100 rounded'>
        <p className='text-lg font-semibold'>
          Current Section:{' '}
          <span className='text-blue-700'>{getCurrentLabel()}</span>
        </p>
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
