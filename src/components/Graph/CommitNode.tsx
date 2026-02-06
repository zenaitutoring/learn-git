interface CommitNodeProps {
  x: number
  y: number
  hash: string
  radius?: number
}

export function CommitNode({ x, y, hash, radius = 16 }: CommitNodeProps) {
  // Display first 3 characters of hash
  const shortHash = hash.substring(0, 3)

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill="url(#nodeGradient)"
        filter="url(#glow)"
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
