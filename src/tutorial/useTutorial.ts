import { create } from 'zustand'
import type { TutorialStore, ValidationContext, ValidationResult } from './types'
import { lessons } from './lessons'

export const useTutorialStore = create<TutorialStore>((set, get) => ({
  // Initial state
  mode: 'free',
  currentLessonIndex: 0,
  currentStepIndex: 0,
  showHint: false,
  lessonCompleted: false,
  showCelebration: false,
  createdFileName: null,
  createdBranchName: null,

  // Actions
  setMode: (mode) => {
    set({
      mode,
      // Reset tutorial state when switching to tutorial mode
      ...(mode === 'tutorial' ? {
        currentStepIndex: 0,
        showHint: false,
        lessonCompleted: false,
        showCelebration: false,
        createdFileName: null,
        createdBranchName: null,
      } : {})
    })
  },

  nextStep: () => {
    const state = get()
    const currentLesson = lessons[state.currentLessonIndex]

    if (!currentLesson) return

    const nextStepIndex = state.currentStepIndex + 1

    if (nextStepIndex >= currentLesson.steps.length) {
      // Lesson complete!
      set({
        lessonCompleted: true,
        showCelebration: true,
        showHint: false,
      })
    } else {
      set({
        currentStepIndex: nextStepIndex,
        showHint: false,
      })
    }
  },

  skipStep: () => {
    get().nextStep()
  },

  toggleHint: () => {
    set((state) => ({ showHint: !state.showHint }))
  },

  resetLesson: () => {
    set({
      currentStepIndex: 0,
      showHint: false,
      lessonCompleted: false,
      showCelebration: false,
      createdFileName: null,
      createdBranchName: null,
    })
  },

  selectLesson: (index) => {
    if (index >= 0 && index < lessons.length) {
      set({
        currentLessonIndex: index,
        currentStepIndex: 0,
        showHint: false,
        lessonCompleted: false,
        showCelebration: false,
        createdFileName: null,
        createdBranchName: null,
      })
    }
  },

  completeLessonCelebration: () => {
    set({ showCelebration: false })
  },

  setCreatedFileName: (name) => {
    set({ createdFileName: name })
  },

  setCreatedBranchName: (name) => {
    set({ createdBranchName: name })
  },

  validateCommand: (command: string, context: ValidationContext): ValidationResult => {
    const state = get()

    if (state.mode !== 'tutorial' || state.lessonCompleted) {
      return { valid: false, message: '', type: 'neutral' }
    }

    const currentLesson = lessons[state.currentLessonIndex]
    if (!currentLesson) {
      return { valid: false, message: '', type: 'neutral' }
    }

    const currentStep = currentLesson.steps[state.currentStepIndex]
    if (!currentStep) {
      return { valid: false, message: '', type: 'neutral' }
    }

    const isValid = currentStep.validate(command, context)

    if (isValid) {
      // Track created resources for flexible validation in later steps
      const touchMatch = command.match(/^touch\s+(\S+)/)
      if (touchMatch) {
        get().setCreatedFileName(touchMatch[1])
      }

      const branchMatch = command.match(/^git\s+branch\s+(\S+)/)
      if (branchMatch) {
        get().setCreatedBranchName(branchMatch[1])
      }

      return {
        valid: true,
        message: currentStep.successMessage,
        type: 'success',
      }
    } else {
      // Provide a gentle nudge
      return {
        valid: false,
        message: `Hmm, that's not quite what we're looking for. Try: ${currentStep.expectedCommand}`,
        type: 'nudge',
      }
    }
  },
}))

// Export lessons for use in components
export { lessons }
