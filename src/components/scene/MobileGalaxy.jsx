import { useMemo } from 'react'
import './MobileGalaxy.css'

// box-shadow star generator — runs once at mount, never again.
function makeShadows(count, maxW, maxH, blur, minA, maxA) {
  const out = []
  for (let i = 0; i < count; i++) {
    const x = Math.round(Math.random() * maxW)
    const y = Math.round(Math.random() * maxH)
    const a = (Math.random() * (maxA - minA) + minA).toFixed(2)
    // Near-white with a cold-blue tint
    const r = Math.round(220 + Math.random() * 35)
    const g = Math.round(228 + Math.random() * 27)
    out.push(`${x}px ${y}px ${blur}px rgba(${r},${g},255,${a})`)
    // Outer glow halo for medium / large stars
    if (blur > 0) {
      const ha = (a * 0.45).toFixed(2)
      out.push(`${x}px ${y}px ${blur * 5}px rgba(160,190,255,${ha})`)
    }
  }
  return out.join(',')
}

export default function MobileGalaxy() {
  const [sm, md, lg] = useMemo(() => [
    makeShadows(130, 440, 960, 0,   0.50, 0.90),  // small hard dots
    makeShadows(45,  440, 960, 1.0, 0.70, 1.00),  // medium + glow
    makeShadows(12,  440, 960, 1.8, 0.90, 1.00),  // bright accent + halo
  ], [])

  return (
    <div className="mgx-root" aria-hidden="true">
      <div className="mgx-stars mgx-sm" style={{ boxShadow: sm }} />
      <div className="mgx-stars mgx-md" style={{ boxShadow: md }} />
      <div className="mgx-stars mgx-lg" style={{ boxShadow: lg }} />
    </div>
  )
}
