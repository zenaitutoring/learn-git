import type { ParsedCommand } from './types'

/**
 * Parse a command string into command and arguments.
 * Handles quoted strings and basic shell-like syntax.
 */
export function parseCommand(input: string): ParsedCommand {
  const raw = input.trim()
  if (!raw) {
    return { command: '', args: [], raw }
  }

  const tokens: string[] = []
  let current = ''
  let inQuotes = false
  let quoteChar = ''

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i]

    if (inQuotes) {
      if (char === quoteChar) {
        inQuotes = false
        // Don't add quote char, but keep the accumulated content
      } else {
        current += char
      }
    } else if (char === '"' || char === "'") {
      inQuotes = true
      quoteChar = char
    } else if (char === ' ' || char === '\t') {
      if (current) {
        tokens.push(current)
        current = ''
      }
    } else {
      current += char
    }
  }

  if (current) {
    tokens.push(current)
  }

  const [command = '', ...args] = tokens
  return { command, args, raw }
}

/**
 * Check if arguments contain redirect operator (> or >>)
 * Returns { file, content, append } or null
 */
export function parseRedirect(
  args: string[]
): { filename: string; content: string; append: boolean } | null {
  // Look for > or >> in args
  const redirectIndex = args.findIndex((a) => a === '>' || a === '>>')

  if (redirectIndex === -1) {
    // Check if redirect is attached to a token like "content>file"
    for (let i = 0; i < args.length; i++) {
      const arg = args[i]
      const appendMatch = arg.indexOf('>>')
      const singleMatch = arg.indexOf('>')

      if (appendMatch !== -1) {
        const content = args.slice(0, i).join(' ') + arg.substring(0, appendMatch)
        const filename = arg.substring(appendMatch + 2) || args[i + 1]
        return { filename, content: content.trim(), append: true }
      } else if (singleMatch !== -1) {
        const content = args.slice(0, i).join(' ') + arg.substring(0, singleMatch)
        const filename = arg.substring(singleMatch + 1) || args[i + 1]
        return { filename, content: content.trim(), append: false }
      }
    }
    return null
  }

  const append = args[redirectIndex] === '>>'
  const content = args.slice(0, redirectIndex).join(' ')
  const filename = args[redirectIndex + 1]

  if (!filename) {
    return null
  }

  return { filename, content, append }
}
