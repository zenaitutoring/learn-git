export function TerminalPanel() {
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
      <div className="terminal-content">
        <div className="terminal-line">
          <span className="prompt">~</span>{' '}
          <span className="command">Welcome to Learn Git!</span>
        </div>
        <div className="terminal-line output">
          Type git commands to learn how Git works.
        </div>
      </div>
      <div className="terminal-input">
        <span className="prompt-symbol">➜</span>
        <span className="branch-indicator">(main)</span>
        <input type="text" placeholder="Type a command..." readOnly />
        <div className="cursor"></div>
      </div>
    </div>
  )
}
