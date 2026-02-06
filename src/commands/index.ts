import { parseCommand } from './parser'
import { shellCommands } from './shell'
import { gitCommands } from './git'
import type { CommandContext, CommandResult } from './types'

export type { CommandContext, CommandResult, CommandOutput, ParsedCommand } from './types'

export function executeCommand(
  input: string,
  ctx: CommandContext
): CommandResult {
  const { command, args } = parseCommand(input)

  if (!command) {
    return []
  }

  // Handle git commands
  if (command === 'git') {
    const subcommand = args[0]
    const subArgs = args.slice(1)

    if (!subcommand) {
      return [{ text: 'usage: git <command> [<args>]', type: 'error' }]
    }

    const handler = gitCommands[subcommand]
    if (handler) {
      return handler(subArgs, ctx)
    }

    return [{ text: `git: '${subcommand}' is not a git command`, type: 'error' }]
  }

  // Handle shell commands
  const shellHandler = shellCommands[command]
  if (shellHandler) {
    return shellHandler(args, ctx)
  }

  return [{ text: `Command not found: ${command}`, type: 'error' }]
}
