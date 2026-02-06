export interface Commit {
  id: string
  message: string
  parentIds: string[]
  timestamp: number
  files: Record<string, string> // snapshot of files at this commit
}

export interface Branch {
  name: string
  commitId: string
}

export interface StagingArea {
  files: Record<string, string> // filename -> content
}

export interface WorkingDirectory {
  files: Record<string, string> // filename -> content
}

export type FileStatus = 'untracked' | 'modified' | 'staged' | 'committed'

export interface FileInfo {
  name: string
  status: FileStatus
  content: string
}

export interface GitState {
  initialized: boolean
  commits: Record<string, Commit>
  branches: Branch[]
  head: string // branch name or commit id (detached HEAD)
  headIsDetached: boolean
  staging: StagingArea
  workingDirectory: WorkingDirectory
  lastCommittedFiles: Record<string, string> // files at HEAD commit
}

export interface MergeResult {
  type: 'fast-forward' | 'merge'
  fromCommit: string
  toCommit: string
  newCommitId?: string // Only for three-way merge
}

export interface GitStore extends GitState {
  // Actions
  init: () => void
  createFile: (name: string, content?: string) => void
  modifyFile: (name: string, content: string) => void
  deleteFile: (name: string) => void
  readFile: (name: string) => string | undefined
  listFiles: () => FileInfo[]
  stage: (filename: string) => void
  unstage: (filename: string) => void
  commit: (message: string) => string
  createBranch: (name: string) => void
  checkout: (target: string) => void
  merge: (branchName: string) => MergeResult
  getBranches: () => Branch[]
  getCurrentBranch: () => string | null
  getCommit: (id: string) => Commit | undefined
  getLog: () => Commit[]
  getAllCommits: () => Commit[]
  reset: () => void
}
