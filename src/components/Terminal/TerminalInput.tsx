import { useState, useRef, useEffect, type KeyboardEvent } from 'react'

export interface TerminalInputProps {
  onSubmit: (command: string) => void
  branch: string | null
  historyUp: () => string | null
  historyDown: () => string | null
}

export function TerminalInput({ onSubmit, branch, historyUp, historyDown }: TerminalInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit(value.trim())
      setValue('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = historyUp()
      if (prev !== null) setValue(prev)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = historyDown()
      setValue(next ?? '')
    }
  }

  const branchDisplay = branch ? `(${branch})` : '(detached)'

  return (
    <div className="terminal-input" onClick={() => inputRef.current?.focus()}>
      <span className="prompt-symbol">➜</span>
      <span className="branch-indicator">{branchDisplay}</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <div className="cursor"></div>
    </div>
  )
}
