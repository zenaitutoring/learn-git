import { useGitStore } from '../simulator'

export function GraphPanel() {
  const initialized = useGitStore(state => state.initialized)
  const commits = useGitStore(state => state.commits)
  const staging = useGitStore(state => state.staging)

  const commitCount = Object.keys(commits).length
  const stagedCount = Object.keys(staging.files).length

  return (
    <div className="graph-panel">
      <div className="graph-header">
        <span>Repository Graph</span>
        <div className="graph-status">
          {stagedCount > 0 && (
            <div className="stat">
              <div className="dot staged"></div> {stagedCount} staged
            </div>
          )}
          <div className="stat">
            <div className="dot committed"></div> {commitCount} commit{commitCount !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      <div className="graph-content">
        {!initialized ? (
          <p style={{ color: '#6e7681' }}>
            Run <code style={{ color: '#58a6ff' }}>git init</code> to start
          </p>
        ) : commitCount === 0 ? (
          <p style={{ color: '#6e7681' }}>
            Create files and commit to see the graph
          </p>
        ) : (
          <p style={{ color: '#6e7681' }}>
            Graph visualization coming in T003
          </p>
        )}
      </div>
      <div className="graph-footer">
        <div className="legend">
          <div className="legend-item">
            <div className="legend-node staged"></div>
            <span>Staged</span>
          </div>
          <div className="legend-item">
            <div className="legend-node committed"></div>
            <span>Committed</span>
          </div>
          <div className="legend-item">
            <div className="legend-label">main</div>
            <span>Branch</span>
          </div>
        </div>
      </div>
    </div>
  )
}
