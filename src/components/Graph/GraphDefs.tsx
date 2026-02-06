// SVG definitions for gradients and filters used across the graph
export function GraphDefs() {
  return (
    <defs>
      {/* Glow filter for committed nodes */}
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Gradient for committed nodes */}
      <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#e94560' }} />
        <stop offset="100%" style={{ stopColor: '#c73e54' }} />
      </linearGradient>
    </defs>
  )
}
