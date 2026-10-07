import { BOOKING_STEPS } from '../../lib/booking'

function BookingStepper({ currentStepIndex }) {
  const currentStep = BOOKING_STEPS[currentStepIndex]

  return (
    <nav aria-label="預約申請步驟">
      {/* Desktop / Tablet：圓形徽章 */}
      <ol className="hidden md:flex justify-between relative border-b-[0.5px] border-ink/20 pb-4">
        {BOOKING_STEPS.map((step, index) => {
          const isCurrent = index === currentStepIndex
          const isDone = index < currentStepIndex

          return (
            <li
              key={step.key}
              className={`flex flex-col items-center flex-1 gap-2 ${
                isCurrent ? 'text-vermilion' : 'text-tea-brown'
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-style-label-sm bg-background transition-colors duration-300 ${
                  isCurrent
                    ? 'border-vermilion bg-vermilion text-on-primary'
                    : isDone
                      ? 'border-tea-brown bg-tea-brown text-on-primary'
                      : 'border-ink/20'
                }`}
              >
                0{index + 1}
              </span>
              <span className="text-style-label-sm">{step.label}</span>
            </li>
          )
        })}
      </ol>

      {/* Mobile：分段進度條 */}
      <div className="md:hidden flex flex-col items-center py-2">
        <span className="text-style-label-sm text-tea-brown mb-2">
          第 {currentStepIndex + 1} 步，共 {BOOKING_STEPS.length} 步
        </span>
        <div className="w-full flex gap-1 h-1 bg-surface-container-high rounded-full overflow-hidden">
          {BOOKING_STEPS.map((step, index) => (
            <div
              key={step.key}
              className={`h-full w-1/4 rounded-full transition-all duration-500 ${
                index <= currentStepIndex ? 'bg-vermilion' : 'bg-surface-container-high'
              }`}
            />
          ))}
        </div>
        <h2 className="text-style-headline-md text-ink mt-6 text-center">{currentStep.label}</h2>
      </div>
    </nav>
  )
}

export default BookingStepper
