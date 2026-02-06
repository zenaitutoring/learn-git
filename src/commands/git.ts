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
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
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
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
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
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return [{ text: `fatal: invalid reference: ${target}`, type: 'error' }]
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
}
