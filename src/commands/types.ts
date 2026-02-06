import type { OutputType } from '../components/Terminal'

export interface CommandOutput {
  text: string
  type?: OutputType
}

export type CommandResult = CommandOutput[]

export interface CommandContext {
  // Actions from GitStore
  init: () => void
  createFile: (name: string, content?: string) => void
  modifyFile: (name: string, content: string) => void
  readFile: (name: string) => string | undefined
  listFiles: () => { name: string; status: string; content: string }[]
  stage: (filename: string) => void
  commit: (message: string) => string
  createBranch: (name: string) => void
  checkout: (target: string) => void
  getBranches: () => { name: string; commitId: string }[]
  getCurrentBranch: () => string | null

  // State
  initialized: boolean
  staging: { files: Record<string, string> }
  workingDirectory: { files: Record<string, string> }
  lastCommittedFiles: Record<string, string>

  // Terminal actions
  clearTerminal: () => void
}

export interface ParsedCommand {
  command: string
  args: string[]
  raw: string
}

export type CommandHandler = (
  args: string[],
  ctx: CommandContext
) => CommandResult
