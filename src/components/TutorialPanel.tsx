import { useTutorialStore, lessons } from '../tutorial/useTutorial'
import { useGitStore } from '../simulator'
import '../styles/tutorial.css'

export function TutorialPanel() {
  const {
    mode,
    currentLessonIndex,
    currentStepIndex,
    showHint,
    lessonCompleted,
    toggleHint,
    skipStep,
    resetLesson,
    selectLesson,
  } = useTutorialStore()

  const gitStore = useGitStore()

  // Don't render if not in tutorial mode
  if (mode !== 'tutorial') {
    return null
  }

  const currentLesson = lessons[currentLessonIndex]
  if (!currentLesson) return null

  const currentStep = currentLesson.steps[currentStepIndex]
  const totalSteps = currentLesson.steps.length

  const handleResetLesson = () => {
    // Reset both tutorial state and git simulator
    resetLesson()
    gitStore.reset()
  }

  const handleSelectLesson = (index: number) => {
    selectLesson(index)
    gitStore.reset()
  }

  return (
    <div className="tutorial-panel">
      <div className="tutorial-header">
        <div className="tutorial-title">
          <span className="tutorial-icon">{'\uD83D\uDCDA'}</span>
          <span className="lesson-title">{currentLesson.title}</span>
        </div>
        <div className="tutorial-progress">
          <span className="step-counter">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <div className="progress-dots">
            {currentLesson.steps.map((_, index) => (
              <span
                key={index}
                className={`progress-dot ${
                  index < currentStepIndex
                    ? 'completed'
                    : index === currentStepIndex
                    ? 'current'
                    : ''
                }`}
              >
                {index <= currentStepIndex ? '\u25CF' : '\u25CB'}
              </span>
            ))}
          </div>
          <button
            className="tutorial-btn reset-btn"
            onClick={handleResetLesson}
            title="Restart this lesson"
          >
            {'\u21BA'} Reset
          </button>
        </div>
      </div>

      {!lessonCompleted && currentStep && (
        <div className="tutorial-content">
          <h3 className="step-instruction">{currentStep.instruction}</h3>
          <p className="step-explanation">{currentStep.explanation}</p>

          <div className="expected-command">
            <span className="command-icon">{'\uD83D\uDC49'}</span>
            <code>Type: {currentStep.expectedCommand}</code>
          </div>

          {showHint && (
            <div className="hint-box">
              <span className="hint-icon">{'\uD83D\uDCA1'}</span>
              <span>{currentStep.hint}</span>
            </div>
          )}

          <div className="tutorial-actions">
            <button
              className="tutorial-btn hint-btn"
              onClick={toggleHint}
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <button
              className="tutorial-btn skip-btn"
              onClick={skipStep}
            >
              Skip Step
            </button>
          </div>
        </div>
      )}

      {lessonCompleted && (
        <div className="tutorial-content completed">
          <p className="completed-message">
            You've completed all steps in this lesson!
          </p>
          <button
            className="tutorial-btn reset-btn"
            onClick={handleResetLesson}
          >
            Restart Lesson
          </button>
        </div>
      )}

      {/* Lesson Selector */}
      <div className="lesson-selector">
        {lessons.map((lesson, index) => (
          <button
            key={lesson.id}
            className={`lesson-btn ${index === currentLessonIndex ? 'active' : ''}`}
            onClick={() => handleSelectLesson(index)}
          >
            {index + 1}. {lesson.title}
          </button>
        ))}
      </div>
    </div>
  )
}
