interface HeadLabelProps {
  x: number
  y: number
}

export function HeadLabel({ x, y }: HeadLabelProps) {
  const width = 50
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
        fill="#238636"
      />
      <text
        x={x + width / 2}
        y={y + 15}
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
      >
        HEAD
      </text>
    </g>
  )
}
