import { useTutorialStore, lessons } from '../tutorial'

// Calm celebration - no confetti, just a simple overlay message
export function Celebration() {
  const {
    showCelebration,
    currentLessonIndex,
    completeLessonCelebration,
    selectLesson,
    setMode,
  } = useTutorialStore()

  if (!showCelebration) return null

  const currentLesson = lessons[currentLessonIndex]
  const hasNextLesson = currentLessonIndex < lessons.length - 1

  const handleNextLesson = () => {
    completeLessonCelebration()
    selectLesson(currentLessonIndex + 1)
  }

  const handleFreeExplore = () => {
    completeLessonCelebration()
    setMode('free')
  }

  return (
    <div className="celebration-overlay calm">
      <div className="celebration-content">
        <h2 className="celebration-title calm">Nice Work!</h2>
        <p className="celebration-message">
          You've completed "{currentLesson?.title}".
          {hasNextLesson
            ? ' Ready for the next challenge?'
            : ' Time to explore on your own.'}
        </p>
        <div className="celebration-actions">
          {hasNextLesson ? (
            <>
              <button
                className="celebration-btn primary"
                onClick={handleNextLesson}
              >
                Next Lesson
              </button>
              <button
                className="celebration-btn secondary"
                onClick={handleFreeExplore}
              >
                Free Explore
              </button>
            </>
          ) : (
            <button
              className="celebration-btn primary"
              onClick={handleFreeExplore}
            >
              Start Exploring
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
