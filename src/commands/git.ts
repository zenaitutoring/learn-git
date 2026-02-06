import type { CommandHandler, CommandResult } from './types'

export const init: CommandHandler = (_args, ctx): CommandResult => {
  if (ctx.initialized) {
    return [{ text: 'Reinitialized existing Git repository in /project/.git/', type: 'success' }]
  }

  ctx.init()
  return [{ text: 'Initialized empty Git repository in /project/.git/', type: 'success' }]
}

export const status: CommandHandler = (_args, ctx): CommandResult => {
  if (!ctx.initialized) {
    return [{ text: 'fatal: not a git repository (or any of the parent directories): .git', type: 'error' }]
  }

  const results: CommandResult = []
  const branch = ctx.getCurrentBranch()

  results.push({ text: `On branch ${branch ?? 'HEAD detached'}` })

  // Check staged files
  const stagedFiles = Object.keys(ctx.staging.files)

  // Check for untracked/modified files
  const files = ctx.listFiles()
  const untracked = files.filter(f => f.status === 'untracked')
  const modified = files.filter(f => f.status === 'modified')

  if (stagedFiles.length === 0 && untracked.length === 0 && modified.length === 0) {
    results.push({ text: '' })
    results.push({ text: 'nothing to commit, working tree clean', type: 'success' })
    return results
  }

  if (stagedFiles.length > 0) {
    results.push({ text: '' })
    results.push({ text: 'Changes to be committed:' })
    results.push({ text: '  (use "git restore --staged <file>..." to unstage)' })
    for (const file of stagedFiles) {
      const isNew = !(file in ctx.lastCommittedFiles)
      const prefix = isNew ? 'new file:' : 'modified:'
      results.push({ text: `        ${prefix}   ${file}`, type: 'staged' })
    }
  }

  if (modified.length > 0) {
    results.push({ text: '' })
    results.push({ text: 'Changes not staged for commit:' })
    results.push({ text: '  (use "git add <file>..." to update what will be committed)' })
    for (const file of modified) {
      results.push({ text: `        modified:   ${file.name}`, type: 'error' })
    }
  }

  if (untracked.length > 0) {
    results.push({ text: '' })
    results.push({ text: 'Untracked files:' })
    results.push({ text: '  (use "git add <file>..." to include in what will be committed)' })
    for (const file of untracked) {
      results.push({ text: `        ${file.name}`, type: 'untracked' })
    }
  }

  return results
}

export const add: CommandHandler = (args, ctx): CommandResult => {
  if (!ctx.initialized) {
    return [{ text: 'fatal: not a git repository (or any of the parent directories): .git', type: 'error' }]
  }

  if (args.length === 0) {
    return [{ text: 'Nothing specified, nothing added.', type: 'error' }]
  }

  const results: CommandResult = []

  for (const arg of args) {
    if (arg === '.') {
      // Stage all files
      const files = ctx.listFiles()
      const toStage = files.filter(f => f.status === 'untracked' || f.status === 'modified')
      for (const file of toStage) {
        try {
          ctx.stage(file.name)
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          results.push({ text: `error: ${message}`, type: 'error' })
        }
      }
    } else {
      try {
        ctx.stage(arg)
      } catch {
        results.push({ text: `error: pathspec '${arg}' did not match any files`, type: 'error' })
      }
    }
  }

  return results
}

export const commit: CommandHandler = (args, ctx): CommandResult => {
  if (!ctx.initialized) {
    return [{ text: 'fatal: not a git repository (or any of the parent directories): .git', type: 'error' }]
  }

  // Parse -m flag
  let message = ''
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-m') {
      message = args[i + 1] ?? ''
      break
    }
  }

  if (!message) {
    return [{ text: 'error: switch `m\' requires a value', type: 'error' }]
  }

  try {
    const stagedFiles = Object.keys(ctx.staging.files)
    const commitId = ctx.commit(message)
    const branch = ctx.getCurrentBranch()
    const shortId = commitId.substring(0, 7)

    return [
      { text: `[${branch} ${shortId}] ${message}`, type: 'success' },
      { text: ` ${stagedFiles.length} file${stagedFiles.length !== 1 ? 's' : ''} changed` },
    ]
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'Unknown error'
    if (errMessage.includes('Nothing to commit')) {
      return [{ text: 'nothing to commit, working tree clean', type: 'error' }]
    }
    return [{ text: `error: ${errMessage}`, type: 'error' }]
  }
}

export const branch: CommandHandler = (args, ctx): CommandResult => {
  if (!ctx.initialized) {
    return [{ text: 'fatal: not a git repository (or any of the parent directories): .git', type: 'error' }]
  }

  // No args - list branches
  if (args.length === 0) {
    const branches = ctx.getBranches()
    const currentBranch = ctx.getCurrentBranch()

    if (branches.length === 0) {
      return []
    }

    return branches.map(b => ({
      text: b.name === currentBranch ? `* ${b.name}` : `  ${b.name}`,
      type: b.name === currentBranch ? 'success' : undefined,
    }))
  }

  // Create new branch
  const branchName = args[0]
  try {
    ctx.createBranch(branchName)
    return []
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return [{ text: `fatal: ${message}`, type: 'error' }]
  }
}

export const checkout: CommandHandler = (args, ctx): CommandResult => {
  if (!ctx.initialized) {
    return [{ text: 'fatal: not a git repository (or any of the parent directories): .git', type: 'error' }]
  }

  if (args.length === 0) {
    return [{ text: 'error: you must specify a branch or commit', type: 'error' }]
  }

  // Handle -b flag for creating and switching
  if (args[0] === '-b') {
    const branchName = args[1]
    if (!branchName) {
      return [{ text: 'error: switch `b\' requires a value', type: 'error' }]
    }
    try {
      ctx.createBranch(branchName)
      ctx.checkout(branchName)
      return [{ text: `Switched to a new branch '${branchName}'`, type: 'success' }]
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return [{ text: `fatal: ${message}`, type: 'error' }]
    }
  }

  const target = args[0]
  try {
    ctx.checkout(target)
    return [{ text: `Switched to branch '${target}'`, type: 'success' }]
  } catch {
    return [{ text: `error: pathspec '${target}' did not match any file(s) known to git`, type: 'error' }]
  }
}

export const switchCmd: CommandHandler = (args, ctx): CommandResult => {
  if (!ctx.initialized) {
    return [{ text: 'fatal: not a git repository (or any of the parent directories): .git', type: 'error' }]
  }

  if (args.length === 0) {
    return [{ text: 'error: missing branch or commit argument', type: 'error' }]
  }

  // Handle -c flag for creating and switching
  if (args[0] === '-c') {
    const branchName = args[1]
    if (!branchName) {
      return [{ text: 'error: switch `c\' requires a value', type: 'error' }]
    }
    try {
      ctx.createBranch(branchName)
      ctx.checkout(branchName)
      return [{ text: `Switched to a new branch '${branchName}'`, type: 'success' }]
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return [{ text: `fatal: ${message}`, type: 'error' }]
    }
  }

  const target = args[0]
  try {
    ctx.checkout(target)
    return [{ text: `Switched to branch '${target}'`, type: 'success' }]
  } catch {
    return [{ text: `fatal: invalid reference: ${target}`, type: 'error' }]
  }
}

export const log: CommandHandler = (args, ctx): CommandResult => {
  if (!ctx.initialized) {
    return [{ text: 'fatal: not a git repository (or any of the parent directories): .git', type: 'error' }]
  }

  // Parse flags
  const oneline = args.includes('--oneline')
  const showGraph = args.includes('--graph')
  const showAll = args.includes('--all')

  // Get commits
  let commits = showAll ? ctx.getAllCommits() : ctx.getLog()

  if (commits.length === 0) {
    return [{ text: 'fatal: your current branch does not have any commits yet', type: 'error' }]
  }

  // Sort by timestamp descending (newest first) for display
  commits = [...commits].sort((a, b) => b.timestamp - a.timestamp)

  // Build branch label map
  const branches = ctx.getBranches()
  const currentBranch = ctx.getCurrentBranch()
  const commitLabels: Record<string, string[]> = {}

  branches.forEach(b => {
    if (b.commitId) {
      if (!commitLabels[b.commitId]) {
        commitLabels[b.commitId] = []
      }
      commitLabels[b.commitId].push(b.name)
    }
  })

  // Get HEAD info
  const headCommitId = ctx.headIsDetached
    ? ctx.head
    : branches.find(b => b.name === currentBranch)?.commitId

  const results: CommandResult = []

  if (showGraph) {
    // ASCII graph output
    // Build commit column assignments for graph
    const branchColumns: Record<string, number> = {}
    branches.forEach((b, i) => {
      branchColumns[b.name] = b.name === 'main' ? 0 : i
    })

    // Track active columns
    const activeColumns: (string | null)[] = []

    commits.forEach((commit, idx) => {
      const shortHash = commit.id.substring(0, 7)
      const labels = commitLabels[commit.id] || []
      const isHead = commit.id === headCommitId
      const isMerge = commit.parentIds.length > 1

      // Find column for this commit
      let col = activeColumns.indexOf(commit.id)
      if (col === -1) {
        // New commit, find free column or add new
        col = activeColumns.indexOf(null)
        if (col === -1) {
          col = activeColumns.length
          activeColumns.push(commit.id)
        } else {
          activeColumns[col] = commit.id
        }
      }

      // Build graph prefix
      let graphPrefix = ''
      for (let c = 0; c < activeColumns.length; c++) {
        if (c === col) {
          graphPrefix += '*'
        } else if (activeColumns[c] !== null) {
          graphPrefix += '|'
        } else {
          graphPrefix += ' '
        }
        graphPrefix += ' '
      }

      // Build decoration string
      let decoration = ''
      if (labels.length > 0 || isHead) {
        const parts: string[] = []
        if (isHead && !ctx.headIsDetached) {
          parts.push(`HEAD -> ${currentBranch}`)
        } else if (isHead && ctx.headIsDetached) {
          parts.push('HEAD')
        }
        labels.forEach(l => {
          if (l !== currentBranch || ctx.headIsDetached) {
            parts.push(l)
          }
        })
        if (parts.length > 0) {
          decoration = ` (${parts.join(', ')})`
        }
      }

      if (oneline) {
        results.push({ text: `${graphPrefix}${shortHash}${decoration} ${commit.message}` })
      } else {
        results.push({ text: `${graphPrefix}commit ${commit.id}${decoration}` })
        results.push({ text: `${' '.repeat(graphPrefix.length)}Author: User` })
        results.push({ text: `${' '.repeat(graphPrefix.length)}Date:   ${new Date(commit.timestamp).toDateString()}` })
        results.push({ text: '' })
        results.push({ text: `${' '.repeat(graphPrefix.length)}    ${commit.message}` })
        if (idx < commits.length - 1) {
          results.push({ text: '' })
        }
      }

      // Update active columns for parents
      if (isMerge) {
        // Merge commit: show merge lines
        const mergePrefix = graphPrefix.replace('*', '|').replace(/\|(?=[^|]*$)/, '\\')
        results.push({ text: mergePrefix })

        // First parent continues in same column
        activeColumns[col] = commit.parentIds[0] || null
        // Second parent needs a new/existing column
        if (commit.parentIds[1]) {
          let col2 = activeColumns.indexOf(null)
          if (col2 === -1 || col2 <= col) {
            col2 = activeColumns.length
            activeColumns.push(commit.parentIds[1])
          } else {
            activeColumns[col2] = commit.parentIds[1]
          }
        }
      } else {
        // Continue to parent
        activeColumns[col] = commit.parentIds[0] || null
      }

      // Clean up null columns at end
      while (activeColumns.length > 0 && activeColumns[activeColumns.length - 1] === null) {
        activeColumns.pop()
      }
    })
  } else if (oneline) {
    // Oneline output (no graph)
    commits.forEach(commit => {
      const shortHash = commit.id.substring(0, 7)
      const labels = commitLabels[commit.id] || []
      const isHead = commit.id === headCommitId

      let decoration = ''
      if (labels.length > 0 || isHead) {
        const parts: string[] = []
        if (isHead && !ctx.headIsDetached) {
          parts.push(`HEAD -> ${currentBranch}`)
        } else if (isHead && ctx.headIsDetached) {
          parts.push('HEAD')
        }
        labels.forEach(l => {
          if (l !== currentBranch || ctx.headIsDetached) {
            parts.push(l)
          }
        })
        if (parts.length > 0) {
          decoration = ` (${parts.join(', ')})`
        }
      }

      results.push({ text: `${shortHash}${decoration} ${commit.message}` })
    })
  } else {
    // Full output
    commits.forEach((commit, idx) => {
      const labels = commitLabels[commit.id] || []
      const isHead = commit.id === headCommitId

      let decoration = ''
      if (labels.length > 0 || isHead) {
        const parts: string[] = []
        if (isHead && !ctx.headIsDetached) {
          parts.push(`HEAD -> ${currentBranch}`)
        } else if (isHead && ctx.headIsDetached) {
          parts.push('HEAD')
        }
        labels.forEach(l => {
          if (l !== currentBranch || ctx.headIsDetached) {
            parts.push(l)
          }
        })
        if (parts.length > 0) {
          decoration = ` (${parts.join(', ')})`
        }
      }

      results.push({ text: `commit ${commit.id}${decoration}` })
      if (commit.parentIds.length > 1) {
        results.push({ text: `Merge: ${commit.parentIds.map(p => p.substring(0, 7)).join(' ')}` })
      }
      results.push({ text: 'Author: User' })
      results.push({ text: `Date:   ${new Date(commit.timestamp).toDateString()}` })
      results.push({ text: '' })
      results.push({ text: `    ${commit.message}` })
      if (idx < commits.length - 1) {
        results.push({ text: '' })
      }
    })
  }

  return results
}

export const merge: CommandHandler = (args, ctx): CommandResult => {
  if (!ctx.initialized) {
    return [{ text: 'fatal: not a git repository (or any of the parent directories): .git', type: 'error' }]
  }

  if (args.length === 0) {
    return [{ text: 'fatal: No branch name specified.', type: 'error' }]
  }

  const branchName = args[0]

  try {
    const result = ctx.merge(branchName)

    if (result.type === 'fast-forward') {
      const fromShort = result.fromCommit ? result.fromCommit.substring(0, 7) : '0000000'
      const toShort = result.toCommit.substring(0, 7)
      return [
        { text: `Updating ${fromShort}..${toShort}` },
        { text: 'Fast-forward', type: 'success' }
      ]
    } else {
      // Three-way merge
      return [
        { text: `Merge made by the 'ort' strategy.`, type: 'success' }
      ]
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (message.includes('not found')) {
      return [{ text: `merge: ${branchName} - not something we can merge`, type: 'error' }]
    }
    if (message.includes('into itself')) {
      return [{ text: `Already up to date.`, type: 'success' }]
    }
    if (message.includes('Already up to date')) {
      return [{ text: `Already up to date.`, type: 'success' }]
    }
    return [{ text: `fatal: ${message}`, type: 'error' }]
  }
}

export const gitCommands: Record<string, CommandHandler> = {
  init,
  status,
  add,
  commit,
  branch,
  checkout,
  switch: switchCmd,
  merge,
  log,
}
