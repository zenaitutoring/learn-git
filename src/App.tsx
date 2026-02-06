import { Header } from './components/Header'
import { TerminalPanel } from './components/TerminalPanel'
import { GraphPanel } from './components/GraphPanel'
import { StatusBar } from './components/StatusBar'
import { TutorialPanel } from './components/TutorialPanel'
import { Celebration } from './components/Celebration'

function App() {
  return (
    <div className="app">
      <Header />
      <TutorialPanel />
      <div className="container">
        <TerminalPanel />
        <GraphPanel />
      </div>
      <StatusBar />
      <Celebration />
    </div>
  )
}

export default App
