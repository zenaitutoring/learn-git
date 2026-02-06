import { useTourStore } from '../tour'
import { useGitStore } from '../simulator'

export function Header() {
  const tourActive = useTourStore((state) => state.active)
  const showCelebration = useTourStore((state) => state.showCelebration)
  const startTour = useTourStore((state) => state.startTour)
  const skipTour = useTourStore((state) => state.skipTour)
  const gitReset = useGitStore((state) => state.reset)

  const inTour = tourActive || showCelebration

  const handleRestartTour = () => {
    gitReset()
    startTour()
  }

  return (
    <header className="header">
      <div className="header-left">
        <h1>Learn Git</h1>
        <span className="subtitle">Interactive Git Simulator</span>
      </div>
      <div className="header-right">
        {inTour ? (
          <button
            className="mode-toggle tutorial-active"
            onClick={skipTour}
          >
            <span className="mode-toggle-icon">Exit Tour</span>
          </button>
        ) : (
          <button
            className="mode-toggle"
            onClick={handleRestartTour}
          >
            <span className="mode-toggle-icon">Restart Tour</span>
          </button>
        )}
      </div>
    </header>
  )
}
