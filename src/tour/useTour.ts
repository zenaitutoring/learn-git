import { create } from 'zustand'
import type { TourStore, TourValidationResult } from './types'
import { firstCommitTour, validateStepCommand } from './steps'

export const useTourStore = create<TourStore>((set, get) => ({
  // Initial state - tour starts active by default
  active: true,
  currentStep: 0,
  totalSteps: firstCommitTour.length,
  waitingForAction: false,
  showCelebration: false,
  createdFileName: null,

  // Actions
  startTour: () => {
    set({
      active: true,
      currentStep: 0,
      waitingForAction: false,
      showCelebration: false,
      createdFileName: null,
    })
  },

  endTour: () => {
    set({
      active: false,
      waitingForAction: false,
    })
  },

  nextStep: () => {
    const state = get()
    const nextStepIndex = state.currentStep + 1

    if (nextStepIndex >= firstCommitTour.length) {
      // Tour complete!
      set({
        showCelebration: true,
        waitingForAction: false,
      })
    } else {
      const nextStep = firstCommitTour[nextStepIndex]
      set({
        currentStep: nextStepIndex,
        // Action steps wait for user input
        waitingForAction: nextStep.type === 'action',
      })
    }
  },

  skipTour: () => {
    set({
      active: false,
      waitingForAction: false,
      showCelebration: false,
    })
  },

  validateCommand: (command: string): TourValidationResult => {
    const state = get()

    if (!state.active || !state.waitingForAction) {
      return { valid: false, message: '', type: 'neutral' }
    }

    const currentStep = firstCommitTour[state.currentStep]
    if (!currentStep || currentStep.type !== 'action') {
      return { valid: false, message: '', type: 'neutral' }
    }

    const result = validateStepCommand(currentStep, command)

    if (result.valid) {
      // Track created files
      const touchMatch = command.match(/^touch\s+(\S+)/)
      if (touchMatch) {
        get().setCreatedFileName(touchMatch[1])
      }

      // Auto-advance to next step after successful action
      setTimeout(() => {
        get().nextStep()
      }, 800) // Brief delay to show success message

      return {
        valid: true,
        message: result.message,
        type: 'success',
      }
    } else {
      return {
        valid: false,
        message: result.message,
        type: 'nudge',
      }
    }
  },

  setCreatedFileName: (name: string) => {
    set({ createdFileName: name })
  },

  hideCelebration: () => {
    set({
      showCelebration: false,
      active: false,
    })
  },

  getCurrentStep: () => {
    const state = get()
    if (!state.active) return null
    return firstCommitTour[state.currentStep] ?? null
  },
}))

// Export steps for use in components
export { firstCommitTour }
