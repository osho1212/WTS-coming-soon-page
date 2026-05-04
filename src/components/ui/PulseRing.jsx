import './PulseRing.css'

/**
 * PulseRing — a pure-CSS animated border that replaces the canvas-based
 * ElectricBorder. A conic-gradient "scanner beam" rotates around the child
 * element; the inner div counter-rotates so the content stays upright.
 * Zero JavaScript, zero canvas, fully GPU-composited.
 */
const PulseRing = ({ children, color = '#3b82f6', speed = 3, className, style }) => (
  <div
    className={`pulse-ring-outer ${className ?? ''}`}
    style={{ '--ring-color': color, '--ring-speed': `${speed}s`, ...style }}
  >
    <div className="pulse-ring-inner">{children}</div>
  </div>
)

export default PulseRing
