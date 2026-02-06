import { Header } from './components/Header'
import { TerminalPanel } from './components/TerminalPanel'
import { GraphPanel } from './components/GraphPanel'
import { StatusBar } from './components/StatusBar'
import { TutorialPanel } from './components/TutorialPanel'
import { Celebration } from './components/Celebration'
import { TourController } from './components/Tour'
import { useTourStore } from './tour'

function App() {
  const tourActive = useTourStore((state) => state.active)
  const showCelebration = useTourStore((state) => state.showCelebration)

  return (
    <div className="app">
      <Header />
      {/* Hide old tutorial panel when new tour is active */}
      {!tourActive && !showCelebration && <TutorialPanel />}
      <div className="container">
        <TerminalPanel />
        <GraphPanel />
      </div>
      <StatusBar />
      {/* Show old celebration only when tour is not active */}
      {!tourActive && !showCelebration && <Celebration />}
      {/* New tooltip-based tour */}
      <TourController />
    </div>
  )
}

export default App
