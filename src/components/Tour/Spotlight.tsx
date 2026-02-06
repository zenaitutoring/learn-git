import { useState, useEffect, type ReactNode } from 'react'

export interface SpotlightProps {
  // Target element to spotlight - can be a selector or DOMRect
  target: string | DOMRect | null
  // Whether the spotlight is active
  active?: boolean
  // Padding around the target element
  padding?: number
  // Border radius for the spotlight cutout
  borderRadius?: number
  // Optional click handler for the backdrop (e.g., to dismiss)
  onBackdropClick?: () => void
  // Children to render on top of spotlight (e.g., tooltips)
  children?: ReactNode
}

interface TargetRect {
  top: number
  left: number
  width: number
  height: number
}

function getTargetRect(target: SpotlightProps['target'], padding: number): TargetRect | null {
  if (!target) return null

  let rect: DOMRect

  if (target instanceof DOMRect) {
    rect = target
  } else {
    const el = document.querySelector(target)
    if (!el) return null
    rect = el.getBoundingClientRect()
  }

  return {
    top: rect.top - padding,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  }
}

export function Spotlight({
  target,
  active = true,
  padding = 8,
  borderRadius = 8,
  onBackdropClick,
  children,
}: SpotlightProps) {
  const [rect, setRect] = useState<TargetRect | null>(null)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (!active) {
      setOpacity(0)
      return
    }

    const updateRect = () => {
      const newRect = getTargetRect(target, padding)
      setRect(newRect)

      // Fade in after position is calculated
      requestAnimationFrame(() => setOpacity(1))
    }

    // Initial calculation
    updateRect()

    // Update on resize/scroll
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)

    // Poll for changes in case target moves (e.g., animations)
    const interval = setInterval(updateRect, 100)

    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
      clearInterval(interval)
    }
  }, [target, padding, active])

  if (!active) return null

  // Create a clip path that cuts out the target area
  // This creates a "spotlight" effect by masking everything except the target
  const clipPath = rect
    ? `polygon(
        0% 0%,
        0% 100%,
        ${rect.left}px 100%,
        ${rect.left}px ${rect.top}px,
        ${rect.left + rect.width}px ${rect.top}px,
        ${rect.left + rect.width}px ${rect.top + rect.height}px,
        ${rect.left}px ${rect.top + rect.height}px,
        ${rect.left}px 100%,
        100% 100%,
        100% 0%
      )`
    : 'none'

  return (
    <div className="spotlight-container" style={{ opacity }}>
      {/* Dark overlay with cutout */}
      <div
        className="spotlight-backdrop"
        onClick={onBackdropClick}
        style={{
          clipPath,
        }}
      />

      {/* Highlight border around target */}
      {rect && (
        <div
          className="spotlight-highlight"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            borderRadius,
          }}
        />
      )}

      {/* Children (e.g., tooltips) */}
      {children}
    </div>
  )
}
