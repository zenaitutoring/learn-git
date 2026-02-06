import type { TourStep } from './types'

// Helper to match commands flexibly
function matchesCommand(command: string, pattern: string | RegExp): boolean {
  const trimmed = command.trim()
  if (typeof pattern === 'string') {
    return trimmed === pattern
  }
  return pattern.test(trimmed)
}

export const firstCommitTour: TourStep[] = [
  // Welcome
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Welcome to Learn Git!',
    content: "Let's learn Git step by step. I'll guide you through creating your first commit.",
    actionLabel: 'Start Learning',
  },

  // Introduce terminal
  {
    id: 'intro-terminal',
    type: 'explanation',
    target: '.terminal-input',
    tooltipPosition: 'top',
    title: 'This is the Terminal',
    content: "You'll type Git commands here. Don't worry - I'll tell you exactly what to type.",
    actionLabel: 'Got it',
  },

  // Initialize Git
  {
    id: 'git-init',
    type: 'action',
    target: '.terminal-input',
    tooltipPosition: 'top',
    title: 'Initialize Git',
    content: 'Every project starts with git init. Type it now:',
    expectedCommand: 'git init',
    hint: 'Type exactly: git init',
    successMessage: 'Git is now tracking this folder!',
  },

  // Explain init
  {
    id: 'explain-init',
    type: 'explanation',
    target: '.terminal-panel',
    tooltipPosition: 'right',
    content: "Git created a hidden .git folder. But there's nothing to track yet - let's create a file!",
    actionLabel: 'Next',
  },

  // Create first file
  {
    id: 'create-file-1',
    type: 'action',
    target: '.terminal-input',
    tooltipPosition: 'top',
    title: 'Create a File',
    content: "Let's create a readme file. Type:",
    expectedCommand: /^touch\s+\S+/,
    hint: 'Try: touch readme.md',
    successMessage: 'File created!',
  },

  // Stage the file
  {
    id: 'stage-file-1',
    type: 'action',
    target: '.terminal-input',
    tooltipPosition: 'top',
    title: 'Stage the File',
    content: 'Now tell Git to track this file with git add:',
    expectedCommand: /^git\s+add\s+\S+/,
    hint: 'Type: git add readme.md (or whatever file you created)',
    successMessage: 'File staged!',
  },

  // Explain staging - point at graph
  {
    id: 'explain-staging',
    type: 'explanation',
    target: '.graph-content',
    tooltipPosition: 'left',
    title: 'The Staging Area',
    content: 'See this dashed circle? Your file is "staged" - ready to be saved in a commit.',
    actionLabel: 'Got it',
  },

  // Commit
  {
    id: 'commit-1',
    type: 'action',
    target: '.terminal-input',
    tooltipPosition: 'top',
    title: 'Create Your First Commit',
    content: 'Now save it permanently with a commit:',
    expectedCommand: /^git\s+commit\s+-m\s+["'].+["']/,
    hint: 'Type: git commit -m "first commit"',
    successMessage: 'Your first commit!',
  },

  // Explain commit - point at graph
  {
    id: 'explain-commit',
    type: 'explanation',
    target: '.graph-content',
    tooltipPosition: 'left',
    title: 'Your First Commit!',
    content: "This solid circle is your commit - a permanent snapshot of your project. It's saved forever in Git history.",
    actionLabel: 'Got it',
  },

  // Repetition intro
  {
    id: 'repetition-intro',
    type: 'explanation',
    target: '.terminal-input',
    tooltipPosition: 'top',
    title: "Let's Practice!",
    content: 'The best way to learn is repetition. Create another file and commit it.',
    actionLabel: "Let's go",
  },

  // Create second file
  {
    id: 'create-file-2',
    type: 'action',
    target: '.terminal-input',
    tooltipPosition: 'top',
    title: 'Create Another File',
    content: 'Create a new file:',
    expectedCommand: /^touch\s+\S+/,
    hint: 'Try: touch index.html',
    successMessage: 'Another file created!',
  },

  // Stage second file
  {
    id: 'stage-file-2',
    type: 'action',
    target: '.terminal-input',
    tooltipPosition: 'top',
    title: 'Stage It',
    content: 'Stage the new file:',
    expectedCommand: /^git\s+add\s+\S+/,
    hint: 'Type: git add <filename>',
    successMessage: 'Staged!',
  },

  // Second commit
  {
    id: 'commit-2',
    type: 'action',
    target: '.terminal-input',
    tooltipPosition: 'top',
    title: 'Commit Again',
    content: 'Create your second commit:',
    expectedCommand: /^git\s+commit\s+-m\s+["'].+["']/,
    hint: 'Type: git commit -m "your message"',
    successMessage: 'Second commit done!',
  },

  // Complete
  {
    id: 'complete',
    type: 'complete',
    target: '.graph-content',
    tooltipPosition: 'left',
    title: "You've Got It!",
    content: "Excellent! You now know the core Git workflow: create, stage, commit. You're ready to explore on your own or learn about branching.",
    actionLabel: 'Free Explore',
  },
]

// Validate a command against current step
export function validateStepCommand(
  step: TourStep,
  command: string
): { valid: boolean; message: string } {
  if (!step.expectedCommand) {
    return { valid: false, message: '' }
  }

  const isValid = matchesCommand(command, step.expectedCommand)

  if (isValid) {
    return {
      valid: true,
      message: step.successMessage || 'Correct!',
    }
  } else {
    return {
      valid: false,
      message: `Hmm, that's not quite right. ${step.hint || ''}`,
    }
  }
}
