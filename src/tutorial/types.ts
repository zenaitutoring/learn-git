// Tutorial system types

export interface TutorialStep {
  id: string
  instruction: string
  explanation: string
  expectedCommand: string
  hint: string
  // Validation function - returns true if the command matches this step
  validate: (command: string, context: ValidationContext) => boolean
  // Success message shown after step completion
  successMessage: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  steps: TutorialStep[]
}

export interface ValidationContext {
  command: string
  // Current state of the simulator (can be extended)
  initialized: boolean
  files: string[]
  stagedFiles: string[]
  branches: string[]
  currentBranch: string | null
  commitCount: number
}

export interface TutorialState {
  mode: 'free' | 'tutorial'
  currentLessonIndex: number
  currentStepIndex: number
  showHint: boolean
  lessonCompleted: boolean
  showCelebration: boolean
  // Track created resources during tutorial (for flexible validation)
  createdFileName: string | null
  createdBranchName: string | null
}

export interface TutorialActions {
  setMode: (mode: 'free' | 'tutorial') => void
  nextStep: () => void
  skipStep: () => void
  toggleHint: () => void
  resetLesson: () => void
  selectLesson: (index: number) => void
  completeLessonCelebration: () => void
  setCreatedFileName: (name: string) => void
  setCreatedBranchName: (name: string) => void
  validateCommand: (command: string, context: ValidationContext) => ValidationResult
}

export interface ValidationResult {
  valid: boolean
  message: string
  type: 'success' | 'nudge' | 'neutral'
}

export interface TutorialStore extends TutorialState, TutorialActions {}
