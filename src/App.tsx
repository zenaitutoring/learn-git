import { Header } from './components/Header'
import { TerminalPanel } from './components/TerminalPanel'
import { GraphPanel } from './components/GraphPanel'
import { StatusBar } from './components/StatusBar'

function App() {
  return (
    <div className="app">
      <Header />
      <div className="container">
        <TerminalPanel />
        <GraphPanel />
      </div>
      <StatusBar />
    </div>
  )
}

export default App
