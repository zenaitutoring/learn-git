import type { Lesson } from './types'

// Helper to check if command matches a pattern
function matchesCommand(command: string, pattern: string | RegExp): boolean {
  const trimmed = command.trim()
  if (typeof pattern === 'string') {
    return trimmed === pattern
  }
  return pattern.test(trimmed)
}

export const lessons: Lesson[] = [
  {
    id: 'first-commit',
    title: 'Your First Commit',
    description: 'Learn the basics: initialize a repo, create a file, and make your first commit.',
    steps: [
      {
        id: 'init',
        instruction: 'Initialize a Git repository',
        explanation: 'Every Git project starts with `git init`. This creates a hidden .git folder that tracks all your changes.',
        expectedCommand: 'git init',
        hint: 'Type exactly: git init',
        validate: (cmd) => matchesCommand(cmd, 'git init'),
        successMessage: 'Repository initialized! You now have a .git folder tracking your project.',
      },
      {
        id: 'create-file',
        instruction: 'Create a file to track',
        explanation: 'Git can only track files that exist. Let\'s create one using the `touch` command.',
        expectedCommand: 'touch readme.md',
        hint: 'Try: touch readme.md (or any filename you like)',
        validate: (cmd) => matchesCommand(cmd, /^touch\s+\S+/),
        successMessage: 'File created! Git sees it as "untracked" - it knows the file exists but isn\'t tracking changes yet.',
      },
      {
        id: 'status',
        instruction: 'Check the repository status',
        explanation: '`git status` shows you what Git sees: untracked files, changes, and what\'s staged for commit.',
        expectedCommand: 'git status',
        hint: 'Type: git status',
        validate: (cmd) => matchesCommand(cmd, 'git status'),
        successMessage: 'You can see your untracked file in red. Git knows it exists but isn\'t tracking it yet.',
      },
      {
        id: 'add',
        instruction: 'Stage the file for commit',
        explanation: 'Staging tells Git "I want to include this in my next commit". Use `git add` to stage files.',
        expectedCommand: 'git add readme.md',
        hint: 'Use: git add <filename> or git add . to add all files',
        validate: (cmd) => matchesCommand(cmd, /^git\s+add\s+\S+/),
        successMessage: 'File staged! It\'s now in the "staging area" waiting to be committed.',
      },
      {
        id: 'commit',
        instruction: 'Create your first commit',
        explanation: 'A commit is a snapshot of your project. The -m flag lets you add a message describing the change.',
        expectedCommand: 'git commit -m "Initial commit"',
        hint: 'Type: git commit -m "your message here"',
        validate: (cmd) => matchesCommand(cmd, /^git\s+commit\s+-m\s+["'].+["']/),
        successMessage: 'Congratulations! You made your first commit! This snapshot is now saved in Git history.',
      },
    ],
  },
  {
    id: 'branching',
    title: 'Branching & Merging',
    description: 'Learn how to create branches, make changes, and merge them back.',
    steps: [
      {
        id: 'create-branch',
        instruction: 'Create a new branch',
        explanation: 'Branches let you work on features without affecting the main code. Think of them as parallel timelines.',
        expectedCommand: 'git branch feature',
        hint: 'Type: git branch feature (or any branch name)',
        validate: (cmd) => matchesCommand(cmd, /^git\s+branch\s+\S+/),
        successMessage: 'Branch created! You now have a new branch, but you\'re still on the main branch.',
      },
      {
        id: 'checkout-branch',
        instruction: 'Switch to your new branch',
        explanation: '`git checkout` moves you to a different branch. Your files will reflect that branch\'s state.',
        expectedCommand: 'git checkout feature',
        hint: 'Type: git checkout <branch-name>',
        validate: (cmd) => matchesCommand(cmd, /^git\s+checkout\s+(?!main|master)\S+/),
        successMessage: 'You\'re now on your feature branch! Changes here won\'t affect the main branch.',
      },
      {
        id: 'create-feature-file',
        instruction: 'Create a file for your feature',
        explanation: 'Let\'s make a change on this branch to see how branches keep work separate.',
        expectedCommand: 'touch feature.js',
        hint: 'Try: touch feature.js (or any filename)',
        validate: (cmd) => matchesCommand(cmd, /^touch\s+\S+/),
        successMessage: 'File created on the feature branch!',
      },
      {
        id: 'add-and-commit',
        instruction: 'Stage and commit your changes',
        explanation: 'Same workflow as before: add the file, then commit it.',
        expectedCommand: 'git add . && git commit -m "Add feature"',
        hint: 'You can do: git add . then git commit -m "message", or combine them',
        validate: (cmd) => {
          // Accept: git add + git commit, or just git commit (if already staged)
          return matchesCommand(cmd, /^git\s+add/) || matchesCommand(cmd, /^git\s+commit\s+-m/)
        },
        successMessage: 'Changes committed to the feature branch!',
      },
      {
        id: 'checkout-main',
        instruction: 'Switch back to main',
        explanation: 'Before merging, you need to be on the branch you want to merge INTO.',
        expectedCommand: 'git checkout main',
        hint: 'Type: git checkout main',
        validate: (cmd) => matchesCommand(cmd, /^git\s+checkout\s+(main|master)/),
        successMessage: 'Back on main! Notice your feature file is gone - it only exists on the feature branch.',
      },
      {
        id: 'merge',
        instruction: 'Merge your feature branch',
        explanation: '`git merge` brings changes from another branch into your current branch.',
        expectedCommand: 'git merge feature',
        hint: 'Type: git merge <branch-name>',
        validate: (cmd) => matchesCommand(cmd, /^git\s+merge\s+\S+/),
        successMessage: 'Merged! Your feature changes are now part of the main branch.',
      },
      {
        id: 'log-graph',
        instruction: 'View the commit history',
        explanation: 'The --graph flag shows you a visual representation of your branch history.',
        expectedCommand: 'git log --oneline --graph',
        hint: 'Type: git log --oneline --graph',
        validate: (cmd) => matchesCommand(cmd, /^git\s+log/),
        successMessage: 'You can see how the branches merged together in the history!',
      },
    ],
  },
]
