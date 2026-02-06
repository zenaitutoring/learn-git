import { useTutorialStore } from '../tutorial'

export function Header() {
  const { mode, setMode } = useTutorialStore()

  const toggleMode = () => {
    setMode(mode === 'free' ? 'tutorial' : 'free')
  }

  return (
    <header className="header">
      <div className="header-left">
        <h1>Learn Git</h1>
        <span className="subtitle">Interactive Git Simulator</span>
      </div>
      <div className="header-right">
        <button
          className={`mode-toggle ${mode === 'tutorial' ? 'tutorial-active' : ''}`}
          onClick={toggleMode}
        >
          <span className="mode-toggle-icon">
            {mode === 'tutorial' ? '\uD83D\uDCDA' : '\uD83D\uDDA5\uFE0F'}
          </span>
          {mode === 'tutorial' ? 'Tutorial Mode' : 'Free Mode'}
        </button>
      </div>
    </header>
  )
}
