interface CommitLineProps {
  x1: number
  y1: number
  x2: number
  y2: number
  color?: string
  curved?: boolean
}

export function CommitLine({
  x1,
  y1,
  x2,
  y2,
  color = '#58a6ff',
  curved = false
}: CommitLineProps) {
  if (curved) {
    // Create a curved path for branch/merge lines
    // (x1, y1) is parent (below), (x2, y2) is child (above)
    // y1 > y2 since parent is lower on screen (higher y value)
    const midY = (y1 + y2) / 2

    if (x1 < x2) {
      // Branching: parent is left, child is right
      // Path: go up from parent, then curve right to child
      const d = `M ${x1} ${y1}
                 L ${x1} ${midY}
                 Q ${x1} ${y2} ${(x1 + x2) / 2} ${y2}
                 L ${x2} ${y2}`
      return (
        <path
          d={d}
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
      )
    } else {
      // Merging: parent is right, child is left
      // Path: go up from parent, then curve left to child
      const d = `M ${x1} ${y1}
                 L ${x1} ${midY}
                 Q ${x1} ${y2} ${(x1 + x2) / 2} ${y2}
                 L ${x2} ${y2}`
      return (
        <path
          d={d}
          stroke={color}
          strokeWidth="3"
          fill="none"
        />
      )
    }
  }

  // Straight line
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth="3"
    />
  )
}
