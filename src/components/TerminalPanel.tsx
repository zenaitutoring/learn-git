import { useState, useCallback } from 'react'
import { TerminalOutput, TerminalInput, type TerminalLineProps } from './Terminal'
import { useGitStore } from '../simulator'

const WELCOME_LINES: TerminalLineProps[] = [
  { type: 'command', content: 'Welcome to Learn Git!', prompt: '~' },
  { type: 'output', content: 'Type git commands to learn how Git works.' },
]

export function TerminalPanel() {
  const [lines, setLines] = useState<TerminalLineProps[]>(WELCOME_LINES)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const getCurrentBranch = useGitStore((s) => s.getCurrentBranch)
  const initialized = useGitStore((s) => s.initialized)

  const branch = initialized ? getCurrentBranch() : null

  const addLines = useCallback((newLines: TerminalLineProps[]) => {
    setLines((prev) => [...prev, ...newLines])
  }, [])

  const handleSubmit = useCallback(
    (command: string) => {
      // Add command to history
      setHistory((prev) => [...prev, command])
      setHistoryIndex(-1)

      // Echo the command
      addLines([{ type: 'command', content: command, prompt: '~' }])

      // For now, just show a placeholder - commands will be implemented in Phase 2
      addLines([
        {
          type: 'output',
          content: `Command not found: ${command.split(' ')[0]}`,
          outputType: 'error',
        },
      ])
    },
    [addLines]
  )

  const historyUp = useCallback((): string | null => {
    if (history.length === 0) return null
    const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
    setHistoryIndex(newIndex)
    return history[newIndex]
  }, [history, historyIndex])

  const historyDown = useCallback((): string | null => {
    if (historyIndex === -1) return null
    const newIndex = historyIndex + 1
    if (newIndex >= history.length) {
      setHistoryIndex(-1)
      return null
    }
    setHistoryIndex(newIndex)
    return history[newIndex]
  }, [history, historyIndex])

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <div className="window-controls">
          <span className="close"></span>
          <span className="minimize"></span>
          <span className="maximize"></span>
        </div>
        Terminal — bash
      </div>
      <TerminalOutput lines={lines} />
      <TerminalInput
        onSubmit={handleSubmit}
        branch={branch}
        historyUp={historyUp}
        historyDown={historyDown}
      />
    </div>
  )
}
