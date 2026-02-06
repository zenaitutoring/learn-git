interface BranchLabelProps {
  x: number
  y: number
  name: string
  isMain?: boolean
}

export function BranchLabel({ x, y, name, isMain = false }: BranchLabelProps) {
  const bgColor = isMain ? '#58a6ff' : '#a371f7'
  const textColor = isMain ? '#0d1117' : 'white'

  // Calculate width based on text length (approximately)
  const textWidth = name.length * 7.5
  const padding = 16
  const width = Math.max(50, textWidth + padding)
  const height = 22
  const borderRadius = 6

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={borderRadius}
        fill={bgColor}
      />
      <text
        x={x + width / 2}
        y={y + 15}
        textAnchor="middle"
        fill={textColor}
        fontSize="11"
        fontWeight="bold"
      >
        {name}
      </text>
    </g>
  )
}
