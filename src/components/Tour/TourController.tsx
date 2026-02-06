import { useTourStore } from '../../tour'
import { Tooltip } from './Tooltip'
import { Spotlight } from './Spotlight'
import '../../styles/tour.css'

export function TourController() {
  const {
    active,
    currentStep,
    totalSteps,
    showCelebration,
    getCurrentStep,
    nextStep,
    skipTour,
    endTour,
    hideCelebration,
  } = useTourStore()

  const step = getCurrentStep()

  // Don't render if tour is not active
  if (!active && !showCelebration) return null

  // Show celebration overlay
  if (showCelebration) {
    return (
      <div className="tour-welcome-overlay">
        <div className="tour-welcome-content">
          <h2>Nice Work!</h2>
          <p>
            You've mastered the basics of Git. You know how to create files,
            stage them, and commit your changes. Keep practicing!
          </p>
          <div className="tour-welcome-actions">
            <button
              className="tour-btn tour-btn-primary"
              onClick={() => {
                hideCelebration()
              }}
            >
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!step) return null

  // Welcome overlay (no spotlight)
  if (step.type === 'welcome') {
    return (
      <div className="tour-welcome-overlay">
        <div className="tour-welcome-content">
          <h2>{step.title}</h2>
          <p>{step.content}</p>
          <div className="tour-welcome-actions">
            <button
              className="tour-btn tour-btn-primary"
              onClick={nextStep}
            >
              {step.actionLabel || 'Start'}
            </button>
            <button
              className="tour-btn tour-btn-secondary"
              onClick={skipTour}
            >
              Skip to Free Mode
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Complete step
  if (step.type === 'complete') {
    return (
      <>
        <Spotlight target={step.target || null} active={true}>
          <Tooltip
            target={step.target || null}
            position={step.tooltipPosition || 'bottom'}
            visible={true}
          >
            {step.title && <h3>{step.title}</h3>}
            <p>{step.content}</p>
            <button
              className="tooltip-action"
              onClick={endTour}
            >
              {step.actionLabel || 'Continue'}
            </button>
          </Tooltip>
        </Spotlight>

        {/* Skip button */}
        <button className="tour-skip" onClick={skipTour}>
          Skip Tour
        </button>

        {/* Progress indicator */}
        <div className="tour-progress">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`tour-progress-dot ${
                i < currentStep ? 'completed' : i === currentStep ? 'current' : ''
              }`}
            />
          ))}
        </div>
      </>
    )
  }

  // Regular steps with spotlight
  const isActionStep = step.type === 'action'

  return (
    <>
      <Spotlight target={step.target || null} active={true}>
        <Tooltip
          target={step.target || null}
          position={step.tooltipPosition || 'bottom'}
          visible={true}
        >
          {step.title && <h3>{step.title}</h3>}
          <p>{step.content}</p>

          {/* Show command hint for action steps */}
          {isActionStep && step.expectedCommand && (
            <p>
              <code>
                {typeof step.expectedCommand === 'string'
                  ? step.expectedCommand
                  : step.hint?.replace(/^(Try|Type):?\s*/i, '') || 'Enter the command'}
              </code>
            </p>
          )}

          {/* Show action button for non-action steps */}
          {!isActionStep && step.actionLabel && (
            <button
              className="tooltip-action"
              onClick={nextStep}
            >
              {step.actionLabel}
            </button>
          )}
        </Tooltip>
      </Spotlight>

      {/* Skip button */}
      <button className="tour-skip" onClick={skipTour}>
        Skip Tour
      </button>

      {/* Progress indicator */}
      <div className="tour-progress">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`tour-progress-dot ${
              i < currentStep ? 'completed' : i === currentStep ? 'current' : ''
            }`}
          />
        ))}
      </div>
    </>
  )
}
