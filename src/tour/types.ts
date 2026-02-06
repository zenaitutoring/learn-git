// Tour system types

export type StepType = 'welcome' | 'explanation' | 'action' | 'observe' | 'complete'

export interface TourStep {
  id: string
  type: StepType
  // Target element to spotlight (CSS selector)
  target?: string
  // Tooltip position relative to target
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  // Content
  title?: string
  content: string
  // For action steps: what command to expect
  expectedCommand?: string | RegExp
  // For action steps: hint text
  hint?: string
  // Success message after action
  successMessage?: string
  // Action button for non-action steps
  actionLabel?: string
  // Auto-advance delay for observation steps (ms)
  autoAdvanceDelay?: number
}

export interface TourState {
  // Is tour active?
  active: boolean
  // Current step index
  currentStep: number
  // Total steps in current tour
  totalSteps: number
  // Is waiting for user action?
  waitingForAction: boolean
  // Show celebration at end?
  showCelebration: boolean
  // Track created resources during tour
  createdFileName: string | null
}

export interface TourActions {
  startTour: () => void
  endTour: () => void
  nextStep: () => void
  skipTour: () => void
  validateCommand: (command: string) => TourValidationResult
  setCreatedFileName: (name: string) => void
  hideCelebration: () => void
}

export interface TourValidationResult {
  valid: boolean
  message: string
  type: 'success' | 'nudge' | 'neutral'
}

export interface TourStore extends TourState, TourActions {
  // Get current step
  getCurrentStep: () => TourStep | null
}
