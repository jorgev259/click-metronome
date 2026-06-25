import { useState } from 'react'

import type { Step } from './lib/types'
import { stepsToBeats } from './lib/steps'
import StepsTable from './components/StepsTable'
import PlayControls from './components/PlayControls'

function App(props: { song: Step[] }) {
  const { song } = props
  const { beats, steps } = stepsToBeats(song)

  const [playing, setPlaying] = useState(false)
  const [compass, setCompass] = useState(0)
  const [currentStep, setStep] = useState(0)
  const [currentBpm, setCurrentBpm] = useState(0)

  return (
    <div className='flex flex-col md:flex-row gap-6'>
      <div className='order-2 md:order-1 flex-1 min-w-0 space-y-4 pt-4 md:pt-0'>
        <StepsTable
          steps={steps}
          beats={beats}
          currentStep={currentStep}
          playing={playing}
          onStepTo={(step) => {
            const beat = beats.find((b) => b.step === step.index)
            setStep(step.index)
            if (beat) {
              setCompass(beat.compass)
              setCurrentBpm(Math.round(60000 / beat.duration))
            }
          }}
        />
      </div>
      <div className='order-1 md:order-2 sticky top-0 z-10 bg-white shadow-sm -mx-6 px-6 pb-4 pt-4 md:bg-transparent md:shadow-none md:mx-0 md:px-0 md:pb-0 md:w-80 md:shrink-0 md:self-start'>
        <PlayControls
          steps={steps}
          beats={beats}
          playing={playing}
          setPlaying={setPlaying}
          currentStep={currentStep}
          setStep={setStep}
          compass={compass}
          setCompass={setCompass}
          currentBpm={currentBpm}
          setCurrentBpm={setCurrentBpm}
        />
      </div>
    </div>
  )
}

export default App
