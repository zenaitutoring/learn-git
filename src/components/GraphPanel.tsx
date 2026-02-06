import { useGitStore } from '../simulator'
import {
  CommitNode,
  StagedNode,
  BranchLabel,
  HeadLabel,
  CommitLine,
  Legend,
  GraphDefs
} from './Graph'
import { calculateLayout } from './Graph/layout'

export function GraphPanel() {
  const initialized = useGitStore(state => state.initialized)
  const commits = useGitStore(state => state.commits)
  const branches = useGitStore(state => state.branches)
  const head = useGitStore(state => state.head)
  const headIsDetached = useGitStore(state => state.headIsDetached)
  const staging = useGitStore(state => state.staging)

  const commitCount = Object.keys(commits).length
  const stagedCount = Object.keys(staging.files).length
  const branchCount = branches.length

  // Calculate layout
  const layout = calculateLayout(
    commits,
    branches,
    head,
    headIsDetached,
    stagedCount > 0
  )

  // Get current branch name for display
  const currentBranch = headIsDetached ? `detached at ${head.substring(0, 7)}` : head

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
          {commitCount > 0 && (
            <div className="stat">
              <div className="dot committed"></div> {commitCount} commit{commitCount !== 1 ? 's' : ''}
            </div>
          )}
          {branchCount > 1 && (
            <div className="stat" style={{ color: '#a371f7' }}>
              {branchCount} branches
            </div>
          )}
          {initialized && (
            <div className="stat" style={{ color: '#8b949e' }}>
              on <span style={{ color: headIsDetached ? '#f0883e' : '#a371f7', fontWeight: 600 }}>{currentBranch}</span>
            </div>
          )}
        </div>
      </div>
      <div className="graph-content">
        {!initialized ? (
          <p style={{ color: '#6e7681' }}>
            Run <code style={{ color: '#58a6ff' }}>git init</code> to start
          </p>
        ) : commitCount === 0 && stagedCount === 0 ? (
          <p style={{ color: '#6e7681' }}>
            Create files and commit to see the graph
          </p>
        ) : (
          <svg
            className="graph-svg"
            width={layout.width}
            height={layout.height}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            style={{ overflow: 'visible' }}
          >
            <GraphDefs />

            {/* Render lines first (behind nodes) */}
            {layout.lines.map((line, i) => (
              <CommitLine
                key={`line-${i}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                color={line.color}
                curved={line.curved}
              />
            ))}

            {/* Render nodes */}
            {layout.nodes.map(node => (
              node.type === 'commit' ? (
                <CommitNode
                  key={node.id}
                  x={node.x}
                  y={node.y}
                  hash={node.hash!}
                />
              ) : (
                <StagedNode
                  key={node.id}
                  x={node.x}
                  y={node.y}
                />
              )
            ))}

            {/* Render labels */}
            {layout.labels.map((label, i) => (
              label.isHead ? (
                <HeadLabel
                  key={`label-${i}`}
                  x={label.x}
                  y={label.y}
                />
              ) : (
                <BranchLabel
                  key={`label-${i}`}
                  x={label.x}
                  y={label.y}
                  name={label.name}
                  isMain={label.isMain}
                />
              )
            ))}
          </svg>
        )}
      </div>
      <Legend />
    </div>
  )
}
