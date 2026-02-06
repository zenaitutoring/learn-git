import { create } from 'zustand'
import type { GitStore, Commit, Branch, FileInfo } from './types'
import * as VFS from './VirtualFileSystem'

function generateCommitId(): string {
  return Math.random().toString(36).substring(2, 9)
}

const initialState = {
  initialized: false,
  commits: {} as Record<string, Commit>,
  branches: [] as Branch[],
  head: 'main',
  headIsDetached: false,
  staging: { files: {} },
  workingDirectory: { files: {} },
  lastCommittedFiles: {} as Record<string, string>
}

export const useGitStore = create<GitStore>((set, get) => ({
  ...initialState,

  init: () => {
    set({
      ...initialState,
      initialized: true,
      branches: [{ name: 'main', commitId: '' }]
    })
  },

  createFile: (name: string, content: string = '') => {
    const state = get()
    if (!state.initialized) {
      throw new Error('Repository not initialized. Run git init first.')
    }
    set({
      workingDirectory: VFS.createFile(state.workingDirectory, name, content)
    })
  },

  modifyFile: (name: string, content: string) => {
    const state = get()
    if (!state.initialized) {
      throw new Error('Repository not initialized. Run git init first.')
    }
    set({
      workingDirectory: VFS.modifyFile(state.workingDirectory, name, content)
    })
  },

  deleteFile: (name: string) => {
    const state = get()
    if (!state.initialized) {
      throw new Error('Repository not initialized. Run git init first.')
    }
    set({
      workingDirectory: VFS.deleteFile(state.workingDirectory, name)
    })
  },

  readFile: (name: string) => {
    const state = get()
    return VFS.readFile(state.workingDirectory, name)
  },

  listFiles: (): FileInfo[] => {
    const state = get()
    return VFS.listFiles(
      state.workingDirectory,
      state.staging,
      state.lastCommittedFiles
    )
  },

  stage: (filename: string) => {
    const state = get()
    if (!state.initialized) {
      throw new Error('Repository not initialized. Run git init first.')
    }
    const content = state.workingDirectory.files[filename]
    if (content === undefined) {
      throw new Error(`File '${filename}' does not exist`)
    }
    set({
      staging: {
        files: { ...state.staging.files, [filename]: content }
      }
    })
  },

  unstage: (filename: string) => {
    const state = get()
    if (!(filename in state.staging.files)) {
      throw new Error(`File '${filename}' is not staged`)
    }
    const { [filename]: _, ...rest } = state.staging.files
    set({
      staging: { files: rest }
    })
  },

  commit: (message: string): string => {
    const state = get()
    if (!state.initialized) {
      throw new Error('Repository not initialized. Run git init first.')
    }
    if (Object.keys(state.staging.files).length === 0) {
      throw new Error('Nothing to commit. Stage files first with git add.')
    }

    const id = generateCommitId()
    const currentBranch = state.branches.find(b => b.name === state.head)
    const parentIds = currentBranch?.commitId ? [currentBranch.commitId] : []

    // Merge staged files into committed files
    const newCommittedFiles = {
      ...state.lastCommittedFiles,
      ...state.staging.files
    }

    const commit: Commit = {
      id,
      message,
      parentIds,
      timestamp: Date.now(),
      files: { ...newCommittedFiles }
    }

    // Update branch to point to new commit
    const updatedBranches = state.branches.map(b =>
      b.name === state.head ? { ...b, commitId: id } : b
    )

    set({
      commits: { ...state.commits, [id]: commit },
      branches: updatedBranches,
      staging: { files: {} },
      lastCommittedFiles: newCommittedFiles
    })

    return id
  },

  createBranch: (name: string) => {
    const state = get()
    if (!state.initialized) {
      throw new Error('Repository not initialized. Run git init first.')
    }
    if (state.branches.some(b => b.name === name)) {
      throw new Error(`Branch '${name}' already exists`)
    }

    const currentBranch = state.branches.find(b => b.name === state.head)
    const commitId = currentBranch?.commitId ?? ''

    set({
      branches: [...state.branches, { name, commitId }]
    })
  },

  checkout: (target: string) => {
    const state = get()
    if (!state.initialized) {
      throw new Error('Repository not initialized. Run git init first.')
    }

    // Check if target is a branch
    const branch = state.branches.find(b => b.name === target)
    if (branch) {
      // Checkout branch
      const commit = state.commits[branch.commitId]
      set({
        head: target,
        headIsDetached: false,
        workingDirectory: { files: commit?.files ?? {} },
        lastCommittedFiles: commit?.files ?? {},
        staging: { files: {} }
      })
      return
    }

    // Check if target is a commit
    const commit = state.commits[target]
    if (commit) {
      // Detached HEAD
      set({
        head: target,
        headIsDetached: true,
        workingDirectory: { files: commit.files },
        lastCommittedFiles: commit.files,
        staging: { files: {} }
      })
      return
    }

    throw new Error(`Branch or commit '${target}' not found`)
  },

  getBranches: (): Branch[] => {
    return get().branches
  },

  getCurrentBranch: (): string | null => {
    const state = get()
    if (state.headIsDetached) return null
    return state.head
  },

  getCommit: (id: string) => {
    return get().commits[id]
  },

  getLog: (): Commit[] => {
    const state = get()
    const commits: Commit[] = []

    // Start from current HEAD
    let currentId: string | undefined
    if (state.headIsDetached) {
      currentId = state.head
    } else {
      const branch = state.branches.find(b => b.name === state.head)
      currentId = branch?.commitId
    }

    // Walk back through parent commits
    while (currentId && state.commits[currentId]) {
      const commit = state.commits[currentId]
      commits.push(commit)
      currentId = commit.parentIds[0] // Follow first parent
    }

    return commits
  },

  reset: () => {
    set(initialState)
  }
}))
