interface CommitNodeProps {
  x: number
  y: number
  hash: string
  radius?: number
  isNew?: boolean
  isHighlighted?: boolean
}

export function CommitNode({ x, y, hash, radius = 16, isNew = false, isHighlighted = false }: CommitNodeProps) {
  // Display first 3 characters of hash
  const shortHash = hash.substring(0, 3)

  // Animation classes applied via CSS
  const animationClass = isNew ? 'commit-node-new' : ''
  const highlightClass = isHighlighted ? 'commit-node-highlighted' : ''

  return (
    <g className={`commit-node ${animationClass} ${highlightClass}`}>
      {/* Highlight ring for new/highlighted nodes */}
      {(isNew || isHighlighted) && (
        <circle
          cx={x}
          cy={y}
          r={radius + 6}
          fill="none"
          stroke="#3fb950"
          strokeWidth="2"
          opacity="0.6"
          className="commit-highlight-ring"
        />
      )}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill="url(#nodeGradient)"
        filter="url(#glow)"
        className="commit-circle"
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
      >
        {shortHash}
      </text>
    </g>
  )
}
