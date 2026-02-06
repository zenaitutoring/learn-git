interface StagedNodeProps {
  x: number
  y: number
  radius?: number
}

export function StagedNode({ x, y, radius = 16 }: StagedNodeProps) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill="none"
        stroke="#f0883e"
        strokeWidth="3"
        strokeDasharray="6 4"
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
