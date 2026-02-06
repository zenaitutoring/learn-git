export type OutputType = 'output' | 'success' | 'error' | 'staged' | 'untracked'

export interface TerminalLineProps {
  type: 'command' | 'output'
  content: string
  outputType?: OutputType
  prompt?: string
}

export function TerminalLine({ type, content, outputType, prompt }: TerminalLineProps) {
  if (type === 'command') {
    return (
      <div className="terminal-line">
        <span className="prompt">{prompt ?? '~'}</span>{' '}
        <span className="command">{content}</span>
      </div>
    )
  }

  const className = `terminal-line output ${outputType ?? ''}`
  return <div className={className}>{content}</div>
}
