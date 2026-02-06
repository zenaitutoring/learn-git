import { create } from 'zustand'
import type { GitStore, Commit, Branch, FileInfo, MergeResult } from './types'
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

  getAllCommits: (): Commit[] => {
    const state = get()
    return Object.values(state.commits).sort((a, b) => a.timestamp - b.timestamp)
  },

  merge: (branchName: string): MergeResult => {
    const state = get()
    if (!state.initialized) {
      throw new Error('Repository not initialized. Run git init first.')
    }

    // Cannot merge if in detached HEAD state
    if (state.headIsDetached) {
      throw new Error('Cannot merge in detached HEAD state.')
    }

    // Check if branch exists
    const targetBranch = state.branches.find(b => b.name === branchName)
    if (!targetBranch) {
      throw new Error(`Branch '${branchName}' not found.`)
    }

    // Cannot merge branch into itself
    const currentBranchName = state.head
    if (branchName === currentBranchName) {
      throw new Error('Cannot merge a branch into itself.')
    }

    const currentBranch = state.branches.find(b => b.name === currentBranchName)
    if (!currentBranch) {
      throw new Error('Current branch not found.')
    }

    const currentCommitId = currentBranch.commitId
    const targetCommitId = targetBranch.commitId

    // If target has no commits, nothing to merge
    if (!targetCommitId) {
      throw new Error('Nothing to merge.')
    }

    // Helper: check if ancestor is an ancestor of descendant
    const isAncestor = (ancestorId: string, descendantId: string): boolean => {
      if (!ancestorId || !descendantId) return false
      if (ancestorId === descendantId) return true

      const visited = new Set<string>()
      const queue = [descendantId]

      while (queue.length > 0) {
        const id = queue.shift()!
        if (id === ancestorId) return true
        if (visited.has(id)) continue
        visited.add(id)

        const commit = state.commits[id]
        if (commit) {
          queue.push(...commit.parentIds)
        }
      }
      return false
    }

    // Case 1: Current branch has no commits - fast-forward
    if (!currentCommitId) {
      const targetCommit = state.commits[targetCommitId]
      const updatedBranches = state.branches.map(b =>
        b.name === currentBranchName ? { ...b, commitId: targetCommitId } : b
      )
      set({
        branches: updatedBranches,
        workingDirectory: { files: targetCommit?.files ?? {} },
        lastCommittedFiles: targetCommit?.files ?? {}
      })
      return {
        type: 'fast-forward',
        fromCommit: '',
        toCommit: targetCommitId
      }
    }

    // Case 2: Already up to date (target is ancestor of current)
    if (isAncestor(targetCommitId, currentCommitId)) {
      throw new Error('Already up to date.')
    }

    // Case 3: Fast-forward (current is ancestor of target)
    if (isAncestor(currentCommitId, targetCommitId)) {
      const targetCommit = state.commits[targetCommitId]
      const updatedBranches = state.branches.map(b =>
        b.name === currentBranchName ? { ...b, commitId: targetCommitId } : b
      )
      set({
        branches: updatedBranches,
        workingDirectory: { files: targetCommit?.files ?? {} },
        lastCommittedFiles: targetCommit?.files ?? {}
      })
      return {
        type: 'fast-forward',
        fromCommit: currentCommitId,
        toCommit: targetCommitId
      }
    }

    // Case 4: Three-way merge (neither is ancestor of the other)
    const currentCommit = state.commits[currentCommitId]
    const targetCommit = state.commits[targetCommitId]

    // Merge files: combine files from both commits
    // In a real git, this would handle conflicts - we just combine for now
    const mergedFiles = {
      ...currentCommit?.files,
      ...targetCommit?.files
    }

    const id = generateCommitId()
    const mergeCommit: Commit = {
      id,
      message: `Merge branch '${branchName}'`,
      parentIds: [currentCommitId, targetCommitId],
      timestamp: Date.now(),
      files: mergedFiles
    }

    const updatedBranches = state.branches.map(b =>
      b.name === currentBranchName ? { ...b, commitId: id } : b
    )

    set({
      commits: { ...state.commits, [id]: mergeCommit },
      branches: updatedBranches,
      workingDirectory: { files: mergedFiles },
      lastCommittedFiles: mergedFiles
    })

    return {
      type: 'merge',
      fromCommit: currentCommitId,
      toCommit: targetCommitId,
      newCommitId: id
    }
  },

  reset: () => {
    set(initialState)
  }
}))
