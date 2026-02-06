import type { Commit, Branch } from '../../simulator/types'

export interface NodePosition {
  id: string
  x: number
  y: number
  type: 'commit' | 'staged'
  hash?: string
}

export interface LabelPosition {
  x: number
  y: number
  name: string
  isHead: boolean
  isBranch: boolean
  isMain: boolean
}

export interface LinePosition {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  curved: boolean
}

export interface GraphLayout {
  nodes: NodePosition[]
  labels: LabelPosition[]
  lines: LinePosition[]
  width: number
  height: number
}

// Layout constants
const NODE_RADIUS = 16
const VERTICAL_SPACING = 60
const HORIZONTAL_SPACING = 100
const LABEL_OFFSET_X = 20  // Distance from node to labels
const LABEL_HEIGHT = 22
const LABEL_GAP = 6
const PADDING = 60
const MAIN_COLOR = '#58a6ff'
const FEATURE_COLOR = '#a371f7'

/**
 * Calculate graph layout from git state
 *
 * Layout rules:
 * - Commits flow bottom-to-top (oldest at bottom)
 * - Main branch is leftmost column
 * - Feature branches offset to the right
 * - Branch points show curved lines
 */
export function calculateLayout(
  commits: Record<string, Commit>,
  branches: Branch[],
  head: string,
  headIsDetached: boolean,
  hasStagedFiles: boolean
): GraphLayout {
  const nodes: NodePosition[] = []
  const labels: LabelPosition[] = []
  const lines: LinePosition[] = []

  // Get all commits sorted by timestamp (oldest first for bottom-to-top)
  const allCommits = Object.values(commits).sort((a, b) => a.timestamp - b.timestamp)

  if (allCommits.length === 0 && !hasStagedFiles) {
    return { nodes, labels, lines, width: 0, height: 0 }
  }

  // Assign columns to branches
  // main is always column 0, other branches get subsequent columns
  const branchColumns: Record<string, number> = {}
  const mainBranch = branches.find(b => b.name === 'main')
  if (mainBranch) {
    branchColumns['main'] = 0
  }

  let nextColumn = 1
  branches.forEach(b => {
    if (b.name !== 'main' && !branchColumns[b.name]) {
      branchColumns[b.name] = nextColumn++
    }
  })

  // Map commits to their column based on which branch they're on
  // This requires figuring out which branch each commit belongs to
  const commitColumns: Record<string, number> = {}
  const commitBranch: Record<string, string> = {}

  // For each branch, walk back from tip and assign commits to that branch
  // Process main first, then other branches
  const sortedBranches = [...branches].sort((a, b) => {
    if (a.name === 'main') return -1
    if (b.name === 'main') return 1
    return 0
  })

  sortedBranches.forEach(branch => {
    let currentId = branch.commitId
    while (currentId && commits[currentId]) {
      if (!commitColumns[currentId]) {
        // Not yet assigned to a branch
        commitColumns[currentId] = branchColumns[branch.name] ?? 0
        commitBranch[currentId] = branch.name
      }
      const commit = commits[currentId]
      currentId = commit.parentIds[0] // Follow first parent
    }
  })

  // Calculate positions for commits (bottom-to-top layout)
  const totalHeight = (allCommits.length * VERTICAL_SPACING) + (hasStagedFiles ? VERTICAL_SPACING : 0) + PADDING * 2
  const maxColumn = Math.max(...Object.values(commitColumns), 0)
  const totalWidth = ((maxColumn + 1) * HORIZONTAL_SPACING) + PADDING * 2 + 100 // Extra for labels

  allCommits.forEach((commit, index) => {
    const column = commitColumns[commit.id] ?? 0
    const x = PADDING + (column * HORIZONTAL_SPACING)
    const y = totalHeight - PADDING - (index * VERTICAL_SPACING) - NODE_RADIUS

    nodes.push({
      id: commit.id,
      x,
      y,
      type: 'commit',
      hash: commit.id
    })
  })

  // Add staged node above the topmost commit on current branch
  if (hasStagedFiles) {
    const currentBranchName = headIsDetached ? null : head
    const currentBranch = branches.find(b => b.name === currentBranchName)
    const tipCommitId = currentBranch?.commitId

    // Find position of tip commit, or use default if no commits
    let stagedX = PADDING
    let stagedY = PADDING + NODE_RADIUS

    if (tipCommitId) {
      const tipNode = nodes.find(n => n.id === tipCommitId)
      if (tipNode) {
        stagedX = tipNode.x
        stagedY = tipNode.y - VERTICAL_SPACING
      }
    } else if (allCommits.length === 0) {
      // No commits yet, place staged node in center
      stagedX = PADDING
      stagedY = PADDING + NODE_RADIUS
    }

    nodes.push({
      id: 'staged',
      x: stagedX,
      y: stagedY,
      type: 'staged'
    })
  }

  // Create lines connecting commits
  allCommits.forEach(commit => {
    const childNode = nodes.find(n => n.id === commit.id)
    if (!childNode) return

    const isMergeCommit = commit.parentIds.length > 1

    commit.parentIds.forEach((parentId, parentIndex) => {
      const parentNode = nodes.find(n => n.id === parentId)
      if (!parentNode) return

      const childColumn = commitColumns[commit.id] ?? 0
      const parentColumn = commitColumns[parentId] ?? 0

      // For merge commits, first parent uses child's branch color,
      // second parent uses the parent's branch color (showing where merge came from)
      let color: string
      if (isMergeCommit && parentIndex > 0) {
        // Second parent - use parent's branch color
        const parentBranchName = commitBranch[parentId] ?? 'main'
        color = parentBranchName === 'main' ? MAIN_COLOR : FEATURE_COLOR
      } else {
        // First parent or non-merge - use child's branch color
        const branchName = commitBranch[commit.id] ?? 'main'
        color = branchName === 'main' ? MAIN_COLOR : FEATURE_COLOR
      }

      // Line from parent (below) to child (above)
      // Curved if columns differ (branching/merging)
      const isCurved = childColumn !== parentColumn

      lines.push({
        x1: parentNode.x,
        y1: parentNode.y - NODE_RADIUS,  // Top of parent node
        x2: childNode.x,
        y2: childNode.y + NODE_RADIUS,   // Bottom of child node
        color,
        curved: isCurved
      })
    })
  })

  // Add labels for branches and HEAD
  branches.forEach(branch => {
    if (!branch.commitId) {
      // Branch exists but points to no commit (initial state)
      // Show label next to staged node if exists, otherwise skip
      if (hasStagedFiles) {
        const stagedNode = nodes.find(n => n.id === 'staged')
        if (stagedNode) {
          const labelX = stagedNode.x + NODE_RADIUS + LABEL_OFFSET_X
          let labelY = stagedNode.y - LABEL_HEIGHT / 2

          labels.push({
            x: labelX,
            y: labelY,
            name: branch.name,
            isHead: false,
            isBranch: true,
            isMain: branch.name === 'main'
          })

          // Add HEAD label if this is the current branch
          if (!headIsDetached && head === branch.name) {
            labels.push({
              x: labelX,
              y: labelY + LABEL_HEIGHT + LABEL_GAP,
              name: 'HEAD',
              isHead: true,
              isBranch: false,
              isMain: false
            })
          }
        }
      }
      return
    }

    const commitNode = nodes.find(n => n.id === branch.commitId)
    if (!commitNode) return

    // Position label to the right of the commit node
    const labelX = commitNode.x + NODE_RADIUS + LABEL_OFFSET_X

    // Check if there are other labels at this commit
    const existingLabelsAtCommit = labels.filter(l =>
      l.x === labelX && !l.isHead
    )
    let labelY = commitNode.y - LABEL_HEIGHT / 2 + (existingLabelsAtCommit.length * (LABEL_HEIGHT + LABEL_GAP))

    labels.push({
      x: labelX,
      y: labelY,
      name: branch.name,
      isHead: false,
      isBranch: true,
      isMain: branch.name === 'main'
    })

    // Add HEAD label below branch label if this is the current branch
    if (!headIsDetached && head === branch.name) {
      labels.push({
        x: labelX,
        y: labelY + LABEL_HEIGHT + LABEL_GAP,
        name: 'HEAD',
        isHead: true,
        isBranch: false,
        isMain: false
      })
    }
  })

  // Add HEAD label for detached HEAD state
  if (headIsDetached) {
    const commitNode = nodes.find(n => n.id === head)
    if (commitNode) {
      const labelX = commitNode.x + NODE_RADIUS + LABEL_OFFSET_X
      // Check existing labels
      const existingLabels = labels.filter(l =>
        Math.abs(l.x - labelX) < 5 && Math.abs(l.y - (commitNode.y - LABEL_HEIGHT / 2)) < LABEL_HEIGHT * 2
      )
      const labelY = commitNode.y - LABEL_HEIGHT / 2 + (existingLabels.length * (LABEL_HEIGHT + LABEL_GAP))

      labels.push({
        x: labelX,
        y: labelY,
        name: 'HEAD',
        isHead: true,
        isBranch: false,
        isMain: false
      })
    }
  }

  return {
    nodes,
    labels,
    lines,
    width: Math.max(totalWidth, 280),
    height: Math.max(totalHeight, 120)
  }
}
