interface StagedNodeProps {
  x: number
  y: number
  radius?: number
  isNew?: boolean
  isHighlighted?: boolean
}

export function StagedNode({ x, y, radius = 16, isNew = false, isHighlighted = false }: StagedNodeProps) {
  // Animation classes applied via CSS
  const animationClass = isNew ? 'staged-node-new' : ''
  const highlightClass = isHighlighted ? 'staged-node-highlighted' : ''

  return (
    <g className={`staged-node ${animationClass} ${highlightClass}`}>
      {/* Highlight ring for new/highlighted nodes */}
      {(isNew || isHighlighted) && (
        <circle
          cx={x}
          cy={y}
          r={radius + 6}
          fill="none"
          stroke="#f0883e"
          strokeWidth="2"
          opacity="0.6"
          className="staged-highlight-ring"
        />
      )}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill="none"
        stroke="#f0883e"
        strokeWidth="3"
        strokeDasharray="6 4"
        className="staged-circle"
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fill="#f0883e"
        fontSize="11"
        fontWeight="bold"
      >
        ?
      </text>
    </g>
  )
}
