import type { Beat, FullStep } from '../lib/types'

export default function StepsTable(props: {
  steps: FullStep[]
  beats: Beat[]
  currentStep: number
  playing: boolean
  onStepTo: (step: FullStep) => void
}) {
  const { steps, beats, currentStep, playing, onStepTo } = props

  function getFullCompass(step: FullStep) {
    const beat = beats.find((b) => b.step === step.index)
    if (!beat) return 0

    return beat.compass
  }

  const rowBg = (index: number) =>
    currentStep === index ? 'bg-green-500 text-white' : 'bg-gray-200'

  const hasSpacing = (step: FullStep) => !step.repeat || step.endRepeat

  const cellPad = (step: FullStep) => (hasSpacing(step) ? 'pt-2 pb-3' : 'py-1')

  const hoverStyle = (index: number) =>
    currentStep !== index && !playing ? 'hover:opacity-80' : ''

  return (
    <div className='mb-4'>
      <h2 className='font-bold text-lg mb-2'>Steps:</h2>
      <table className='border-separate border-spacing-0 text-left'>
        <tbody>
          {steps.flatMap((step, index) => {
            const row = (
              <tr
                key={step.index}
                className='cursor-pointer'
                onClick={() => {
                  if (currentStep !== step.index && !playing) onStepTo(step)
                }}
              >
                <td
                  className={`px-3 rounded-l whitespace-nowrap align-middle ${cellPad(step)} ${rowBg(step.index)} ${hoverStyle(step.index)}`}
                >
                  <span className='font-bold'>{getFullCompass(step)}</span>
                  {step.startRepeat || step.endRepeat ? (
                    <svg
                      className='w-4 h-4 inline ml-1'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z' />
                    </svg>
                  ) : null}
                  {step.startRit && (
                    <span className='text-xs italic ml-1'>rit.</span>
                  )}
                </td>
                <td
                  className={`px-3 whitespace-nowrap align-middle ${cellPad(step)} ${rowBg(step.index)} ${hoverStyle(step.index)}`}
                >
                  {step.compasses} compasses × {step.measure} beats @ {step.bpm}{' '}
                  BPM
                </td>
                <td
                  className={`px-3 rounded-r align-middle w-full ${cellPad(step)} ${rowBg(step.index)} ${hoverStyle(step.index)}`}
                >
                  {step.label && (
                    <span className='font-bold'>{step.label}</span>
                  )}
                </td>
              </tr>
            )

            const spacer =
              hasSpacing(step) && index < steps.length - 1 ? (
                <tr key={`spacer-${step.index.toString()}`}>
                  <td colSpan={3} className='h-2' />
                </tr>
              ) : null

            return spacer ? [row, spacer] : [row]
          })}
        </tbody>
      </table>
    </div>
  )
}
