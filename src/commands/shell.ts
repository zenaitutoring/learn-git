import type { CommandHandler, CommandResult } from './types'
import { parseRedirect } from './parser'

export const touch: CommandHandler = (args, ctx): CommandResult => {
  if (args.length === 0) {
    return [{ text: 'touch: missing file operand', type: 'error' }]
  }

  if (!ctx.initialized) {
    // Allow file creation even without git init (like real terminal)
    // Files will just be untracked
  }

  try {
    for (const filename of args) {
      // Only create if doesn't exist
      if (ctx.readFile(filename) === undefined) {
        ctx.createFile(filename, '')
      }
    }
    return []
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return [{ text: `touch: ${message}`, type: 'error' }]
  }
}

export const echo: CommandHandler = (args, ctx): CommandResult => {
  // Check for redirect
  const redirect = parseRedirect(args)

  if (redirect) {
    try {
      const { filename, content, append } = redirect

      if (append) {
        // Append mode
        const existing = ctx.readFile(filename) ?? ''
        const newContent = existing ? existing + '\n' + content : content
        if (ctx.readFile(filename) !== undefined) {
          ctx.modifyFile(filename, newContent)
        } else {
          ctx.createFile(filename, newContent)
        }
      } else {
        // Overwrite mode
        if (ctx.readFile(filename) !== undefined) {
          ctx.modifyFile(filename, content)
        } else {
          ctx.createFile(filename, content)
        }
      }
      return []
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return [{ text: `echo: ${message}`, type: 'error' }]
    }
  }

  // No redirect - just print
  return [{ text: args.join(' ') }]
}

export const ls: CommandHandler = (_args, ctx): CommandResult => {
  const files = ctx.listFiles()

  if (files.length === 0) {
    return []
  }

  return files.map((f) => ({ text: f.name }))
}

export const cat: CommandHandler = (args, ctx): CommandResult => {
  if (args.length === 0) {
    return [{ text: 'cat: missing file operand', type: 'error' }]
  }

  const results: CommandResult = []

  for (const filename of args) {
    const content = ctx.readFile(filename)
    if (content === undefined) {
      results.push({ text: `cat: ${filename}: No such file or directory`, type: 'error' })
    } else if (content === '') {
      // Empty file - no output
    } else {
      // Split content by lines
      const lines = content.split('\n')
      for (const line of lines) {
        results.push({ text: line })
      }
    }
  }

  return results
}

export const clear: CommandHandler = (_args, ctx): CommandResult => {
  ctx.clearTerminal()
  return []
}

export const pwd: CommandHandler = (): CommandResult => {
  return [{ text: '/project' }]
}

export const shellCommands: Record<string, CommandHandler> = {
  touch,
  echo,
  ls,
  cat,
  clear,
  pwd,
}
