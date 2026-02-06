import type { OutputType } from '../components/Terminal'
import type { MergeResult, Commit } from '../simulator/types'

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
  merge: (branchName: string) => MergeResult
  getBranches: () => { name: string; commitId: string }[]
  getCurrentBranch: () => string | null
  getCommit: (id: string) => Commit | undefined
  getLog: () => Commit[]
  getAllCommits: () => Commit[]

  // State
  initialized: boolean
  commits: Record<string, Commit>
  head: string
  headIsDetached: boolean
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
