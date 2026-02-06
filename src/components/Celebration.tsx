import { useEffect, useRef } from 'react'
import { useTutorialStore, lessons } from '../tutorial'

interface ConfettiPiece {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  rotation: number
  rotationSpeed: number
  size: number
}

function createConfetti(canvas: HTMLCanvasElement): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = []
  const colors = ['#e94560', '#3fb950', '#58a6ff', '#f0883e', '#a371f7', '#ffbd2e']

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      size: Math.random() * 8 + 4,
    })
  }

  return pieces
}

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const confettiRef = useRef<ConfettiPiece[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create confetti
    confettiRef.current = createConfetti(canvas)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      confettiRef.current.forEach((piece) => {
        ctx.save()
        ctx.translate(piece.x, piece.y)
        ctx.rotate((piece.rotation * Math.PI) / 180)
        ctx.fillStyle = piece.color
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.6)
        ctx.restore()

        // Update position
        piece.x += piece.vx
        piece.y += piece.vy
        piece.vy += 0.1 // gravity
        piece.rotation += piece.rotationSpeed

        // Reset if off screen
        if (piece.y > canvas.height + 20) {
          piece.y = -20
          piece.x = Math.random() * canvas.width
          piece.vy = Math.random() * 3 + 2
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="confetti-canvas" />
}

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
    <>
      <ConfettiCanvas />
      <div className="celebration-overlay">
        <div className="celebration-content">
          <div className="celebration-emoji">{'\uD83C\uDF89'}</div>
          <h2 className="celebration-title">Lesson Complete!</h2>
          <p className="celebration-message">
            Amazing work! You've mastered "{currentLesson?.title}".
            {hasNextLesson
              ? ' Ready for the next challenge?'
              : " You've completed all tutorials! Time to explore on your own."}
          </p>
          <div className="celebration-actions">
            {hasNextLesson ? (
              <>
                <button
                  className="celebration-btn primary"
                  onClick={handleNextLesson}
                >
                  Next Lesson {'\u2192'}
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
                Start Exploring {'\uD83D\uDE80'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
