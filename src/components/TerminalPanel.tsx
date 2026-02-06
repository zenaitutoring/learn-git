import { useState, useCallback } from 'react'
import { TerminalOutput, TerminalInput, type TerminalLineProps } from './Terminal'
import { useGitStore } from '../simulator'
import { executeCommand, type CommandContext } from '../commands'
import { useTutorialStore } from '../tutorial'
import type { ValidationContext } from '../tutorial'

const WELCOME_LINES: TerminalLineProps[] = [
  { type: 'command', content: 'Welcome to Learn Git!', prompt: '~' },
  { type: 'output', content: 'Type git commands to learn how Git works.' },
]

export function TerminalPanel() {
  const [lines, setLines] = useState<TerminalLineProps[]>(WELCOME_LINES)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const store = useGitStore()
  const tutorial = useTutorialStore()

  const branch = store.initialized ? store.getCurrentBranch() : null

  const clearTerminal = useCallback(() => {
    setLines([])
  }, [])

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

      // Build command context
      const ctx: CommandContext = {
        init: store.init,
        createFile: store.createFile,
        modifyFile: store.modifyFile,
        readFile: store.readFile,
        listFiles: store.listFiles,
        stage: store.stage,
        commit: store.commit,
        createBranch: store.createBranch,
        checkout: store.checkout,
        merge: store.merge,
        getBranches: store.getBranches,
        getCurrentBranch: store.getCurrentBranch,
        getCommit: store.getCommit,
        getLog: store.getLog,
        getAllCommits: store.getAllCommits,
        initialized: store.initialized,
        commits: store.commits,
        head: store.head,
        headIsDetached: store.headIsDetached,
        staging: store.staging,
        workingDirectory: store.workingDirectory,
        lastCommittedFiles: store.lastCommittedFiles,
        clearTerminal,
      }

      // Execute command
      const results = executeCommand(command, ctx)

      // Convert results to terminal lines
      const outputLines: TerminalLineProps[] = results.map((r) => ({
        type: 'output' as const,
        content: r.text,
        outputType: r.type,
      }))

      if (outputLines.length > 0) {
        addLines(outputLines)
      }

      // Tutorial validation - happens after command execution
      if (tutorial.mode === 'tutorial' && !tutorial.lessonCompleted) {
        const validationContext: ValidationContext = {
          command,
          initialized: store.initialized,
          files: Object.keys(store.workingDirectory.files),
          stagedFiles: Object.keys(store.staging.files),
          branches: store.getBranches().map((b) => b.name),
          currentBranch: store.getCurrentBranch(),
          commitCount: Object.keys(store.commits).length,
        }

        const result = tutorial.validateCommand(command, validationContext)

        if (result.type !== 'neutral') {
          // Show tutorial feedback
          addLines([
            {
              type: 'output' as const,
              content: result.message,
              outputType: result.type === 'success' ? 'success' : 'staged',
            },
          ])

          // If valid, advance to next step
          if (result.valid) {
            tutorial.nextStep()
          }
        }
      }
    },
    [store, addLines, clearTerminal, tutorial]
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
