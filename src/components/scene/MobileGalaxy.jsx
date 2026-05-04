import { useMemo } from 'react'
import './MobileGalaxy.css'

// Generate box-shadow star positions once per mount.
// Range covers any mobile viewport — shadows outside the screen are clipped by overflow:hidden.
function makeShadows(count, maxW, maxH, minAlpha, maxAlpha) {
  const out = []
  for (let i = 0; i < count; i++) {
    const x = Math.round(Math.random() * maxW)
    const y = Math.round(Math.random() * maxH)
    const a = (Math.random() * (maxAlpha - minAlpha) + minAlpha).toFixed(2)
    // Blue-white tint: vary R/G slightly while keeping B high
    const r = Math.round(180 + Math.random() * 75)
    const g = Math.round(190 + Math.random() * 65)
    out.push(`${x}px ${y}px 0 rgba(${r},${g},255,${a})`)
  }
  return out.join(',')
}

export default function MobileGalaxy() {
  const [sm, md, lg] = useMemo(() => [
    makeShadows(130, 820, 1600, 0.12, 0.55),  // tiny dim stars
    makeShadows(45,  820, 1600, 0.35, 0.75),  // mid stars
    makeShadows(12,  820, 1600, 0.60, 1.00),  // bright accent stars
  ], [])

  return (
    <div className="mgx-root" aria-hidden="true">
      {/* Nebula glow — pure CSS gradients, no paint cost */}
      <div className="mgx-nebula" />
      {/* Star layers — 1px dots multiplied via box-shadow, animated with opacity only */}
      <div className="mgx-stars mgx-sm" style={{ boxShadow: sm }} />
      <div className="mgx-stars mgx-md" style={{ boxShadow: md }} />
      <div className="mgx-stars mgx-lg" style={{ boxShadow: lg }} />
    </div>
  )
}
