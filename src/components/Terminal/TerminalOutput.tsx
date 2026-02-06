import { useEffect, useRef } from 'react'
import { TerminalLine, type TerminalLineProps } from './TerminalLine'

export interface TerminalOutputProps {
  lines: TerminalLineProps[]
}

export function TerminalOutput({ lines }: TerminalOutputProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines])

  return (
    <div className="terminal-content" ref={containerRef}>
      {lines.map((line, i) => (
        <TerminalLine key={i} {...line} />
      ))}
    </div>
  )
}
