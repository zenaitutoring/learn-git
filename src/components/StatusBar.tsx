import { useGitStore } from '../simulator'

export function StatusBar() {
  const initialized = useGitStore(state => state.initialized)
  const head = useGitStore(state => state.head)
  const headIsDetached = useGitStore(state => state.headIsDetached)
  const listFiles = useGitStore(state => state.listFiles)
  const staging = useGitStore(state => state.staging)

  const files = initialized ? listFiles() : []
  const fileNames = files.map(f => f.name).join(', ') || '—'
  const stagedCount = Object.keys(staging.files).length
  const modifiedCount = files.filter(f => f.status === 'modified' || f.status === 'untracked').length

  const getWorkingTreeStatus = () => {
    if (!initialized) return { text: 'not initialized', className: '' }
    if (stagedCount > 0) return { text: `${stagedCount} staged`, className: 'modified' }
    if (modifiedCount > 0) return { text: `${modifiedCount} modified`, className: 'modified' }
    return { text: 'clean', className: 'clean' }
  }

  const workingTree = getWorkingTreeStatus()

  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="label">Files:</span>
        <span className="value">{fileNames}</span>
      </div>
      <div className="status-item">
        <span className="label">Branch:</span>
        <span className="value branch">
          {headIsDetached ? `(${head.slice(0, 7)})` : head}
        </span>
      </div>
      <div className="status-item">
        <span className="label">Working tree:</span>
        <span className={`value ${workingTree.className}`}>{workingTree.text}</span>
      </div>
    </div>
  )
}
