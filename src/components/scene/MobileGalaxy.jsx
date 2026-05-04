import { useMemo } from 'react'
import './MobileGalaxy.css'

// box-shadow star generator — runs once at mount, never again.
// blur > 0 gives medium/large stars a soft glow.
function makeShadows(count, maxW, maxH, blur, minA, maxA) {
  const out = []
  for (let i = 0; i < count; i++) {
    const x   = Math.round(Math.random() * maxW)
    const y   = Math.round(Math.random() * maxH)
    const a   = (Math.random() * (maxA - minA) + minA).toFixed(2)
    // Blue-white tint — bright enough to show on dark (#050505) canvas
    const r   = Math.round(200 + Math.random() * 55)
    const g   = Math.round(210 + Math.random() * 45)
    out.push(`${x}px ${y}px ${blur}px rgba(${r},${g},255,${a})`)
    // Halo on medium/large stars
    if (blur > 0) {
      out.push(`${x}px ${y}px ${blur * 4}px rgba(140,170,255,${(a * 0.35).toFixed(2)})`)
    }
  }
  return out.join(',')
}

export default function MobileGalaxy() {
  const [sm, md, lg] = useMemo(() => [
    makeShadows(130, 440, 960, 0,   0.45, 0.85),  // small hard dots
    makeShadows(45,  440, 960, 0.8, 0.65, 1.00),  // medium with glow
    makeShadows(12,  440, 960, 1.5, 0.85, 1.00),  // bright accent + halo
  ], [])

  return (
    <div className="mgx-root" aria-hidden="true">
      <div className="mgx-stars mgx-sm" style={{ boxShadow: sm }} />
      <div className="mgx-stars mgx-md" style={{ boxShadow: md }} />
      <div className="mgx-stars mgx-lg" style={{ boxShadow: lg }} />
    </div>
  )
}
