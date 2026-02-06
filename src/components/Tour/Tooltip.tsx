import { useState, useEffect, useRef, type ReactNode } from 'react'

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  // Target element to point at - can be a ref, selector, or DOMRect
  target: React.RefObject<HTMLElement> | string | DOMRect | null
  // Content to display in tooltip
  children: ReactNode
  // Preferred position (will adjust if not enough space)
  position?: TooltipPosition
  // Whether the tooltip is visible
  visible?: boolean
  // Optional action button
  action?: {
    label: string
    onClick: () => void
  }
  // Max width of tooltip
  maxWidth?: number
}

interface TooltipStyle {
  top: number
  left: number
  arrowPosition: TooltipPosition
}

const ARROW_SIZE = 10
const PADDING = 16

function getTargetRect(target: TooltipProps['target']): DOMRect | null {
  if (!target) return null

  if (target instanceof DOMRect) {
    return target
  }

  if (typeof target === 'string') {
    const el = document.querySelector(target)
    return el?.getBoundingClientRect() ?? null
  }

  // RefObject
  return target.current?.getBoundingClientRect() ?? null
}

function calculatePosition(
  targetRect: DOMRect,
  tooltipRect: DOMRect,
  preferred: TooltipPosition
): TooltipStyle {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  const targetCenter = {
    x: targetRect.left + targetRect.width / 2,
    y: targetRect.top + targetRect.height / 2,
  }

  // Try positions in order of preference
  const positions: TooltipPosition[] = [preferred, 'top', 'bottom', 'right', 'left']

  for (const pos of positions) {
    let top: number
    let left: number

    switch (pos) {
      case 'top':
        top = targetRect.top - tooltipRect.height - ARROW_SIZE - 8
        left = targetCenter.x - tooltipRect.width / 2
        break
      case 'bottom':
        top = targetRect.bottom + ARROW_SIZE + 8
        left = targetCenter.x - tooltipRect.width / 2
        break
      case 'left':
        top = targetCenter.y - tooltipRect.height / 2
        left = targetRect.left - tooltipRect.width - ARROW_SIZE - 8
        break
      case 'right':
        top = targetCenter.y - tooltipRect.height / 2
        left = targetRect.right + ARROW_SIZE + 8
        break
    }

    // Clamp to viewport
    left = Math.max(PADDING, Math.min(left, viewport.width - tooltipRect.width - PADDING))
    top = Math.max(PADDING, Math.min(top, viewport.height - tooltipRect.height - PADDING))

    // Check if this position works
    const fits =
      (pos === 'top' && targetRect.top > tooltipRect.height + ARROW_SIZE + PADDING) ||
      (pos === 'bottom' && targetRect.bottom + tooltipRect.height + ARROW_SIZE + PADDING < viewport.height) ||
      (pos === 'left' && targetRect.left > tooltipRect.width + ARROW_SIZE + PADDING) ||
      (pos === 'right' && targetRect.right + tooltipRect.width + ARROW_SIZE + PADDING < viewport.width)

    if (fits || pos === positions[positions.length - 1]) {
      return { top, left, arrowPosition: pos }
    }
  }

  // Fallback (should never reach here)
  return {
    top: targetRect.bottom + ARROW_SIZE + 8,
    left: targetCenter.x - tooltipRect.width / 2,
    arrowPosition: 'bottom',
  }
}

export function Tooltip({
  target,
  children,
  position = 'bottom',
  visible = true,
  action,
  maxWidth = 320,
}: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<TooltipStyle | null>(null)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (!visible) {
      setOpacity(0)
      return
    }

    const updatePosition = () => {
      const targetRect = getTargetRect(target)
      const tooltipEl = tooltipRef.current

      if (!targetRect || !tooltipEl) {
        setOpacity(0)
        return
      }

      const tooltipRect = tooltipEl.getBoundingClientRect()
      const newStyle = calculatePosition(targetRect, tooltipRect, position)
      setStyle(newStyle)

      // Fade in after position is calculated
      requestAnimationFrame(() => setOpacity(1))
    }

    // Initial calculation
    updatePosition()

    // Update on resize/scroll
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [target, position, visible])

  if (!visible) return null

  // Arrow position is opposite to where the tooltip is relative to target
  const arrowClass = style ? `tooltip-arrow tooltip-arrow-${style.arrowPosition}` : ''

  return (
    <div
      ref={tooltipRef}
      className="tour-tooltip"
      style={{
        position: 'fixed',
        top: style?.top ?? 0,
        left: style?.left ?? 0,
        maxWidth,
        opacity,
        transform: `translateY(${opacity === 0 ? '10px' : '0'})`,
        pointerEvents: opacity === 0 ? 'none' : 'auto',
        zIndex: 10001,
      }}
    >
      <div className={arrowClass} />
      <div className="tooltip-content">
        {children}
        {action && (
          <button className="tooltip-action" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
