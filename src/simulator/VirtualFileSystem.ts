import type { FileInfo, FileStatus, WorkingDirectory, StagingArea } from './types'

export function createFile(
  workingDir: WorkingDirectory,
  name: string,
  content: string = ''
): WorkingDirectory {
  return {
    files: { ...workingDir.files, [name]: content }
  }
}

export function modifyFile(
  workingDir: WorkingDirectory,
  name: string,
  content: string
): WorkingDirectory {
  if (!(name in workingDir.files)) {
    throw new Error(`File '${name}' does not exist`)
  }
  return {
    files: { ...workingDir.files, [name]: content }
  }
}

export function deleteFile(
  workingDir: WorkingDirectory,
  name: string
): WorkingDirectory {
  if (!(name in workingDir.files)) {
    throw new Error(`File '${name}' does not exist`)
  }
  const { [name]: _, ...rest } = workingDir.files
  return { files: rest }
}

export function readFile(
  workingDir: WorkingDirectory,
  name: string
): string | undefined {
  return workingDir.files[name]
}

export function getFileStatus(
  filename: string,
  workingDir: WorkingDirectory,
  staging: StagingArea,
  lastCommitted: Record<string, string>
): FileStatus {
  const inWorking = filename in workingDir.files
  const inStaging = filename in staging.files
  const inCommitted = filename in lastCommitted

  if (inStaging) {
    return 'staged'
  }

  if (!inCommitted && inWorking) {
    return 'untracked'
  }

  if (inWorking && inCommitted) {
    if (workingDir.files[filename] !== lastCommitted[filename]) {
      return 'modified'
    }
    return 'committed'
  }

  return 'untracked'
}

export function listFiles(
  workingDir: WorkingDirectory,
  staging: StagingArea,
  lastCommitted: Record<string, string>
): FileInfo[] {
  const allFiles = new Set([
    ...Object.keys(workingDir.files),
    ...Object.keys(staging.files)
  ])

  return Array.from(allFiles).map(name => ({
    name,
    status: getFileStatus(name, workingDir, staging, lastCommitted),
    content: workingDir.files[name] ?? staging.files[name] ?? ''
  }))
}
