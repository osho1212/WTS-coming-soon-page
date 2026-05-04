import { useMemo } from 'react'
import './MobileGalaxy.css'

// Generate box-shadow star positions once per mount.
// Range is kept close to real mobile viewport sizes (420×950) so
// most stars land on-screen regardless of device.
function makeShadows(count, maxW, maxH, minAlpha, maxAlpha) {
  const out = []
  for (let i = 0; i < count; i++) {
    const x = Math.round(Math.random() * maxW)
    const y = Math.round(Math.random() * maxH)
    const a = (Math.random() * (maxAlpha - minAlpha) + minAlpha).toFixed(2)
    // Blue-white tint with slight variation
    const r = Math.round(160 + Math.random() * 95)
    const g = Math.round(170 + Math.random() * 85)
    out.push(`${x}px ${y}px 0 rgba(${r},${g},255,${a})`)
  }
  return out.join(',')
}

export default function MobileGalaxy() {
  const [sm, md, lg] = useMemo(() => [
    makeShadows(140, 420, 950, 0.30, 0.70),  // small stars
    makeShadows(50,  420, 950, 0.55, 0.90),  // mid stars
    makeShadows(15,  420, 950, 0.80, 1.00),  // bright accent stars
  ], [])

  return (
    <div className="mgx-root" aria-hidden="true">
      {/* Nebula glow — lighter colors work with mix-blend-mode:screen */}
      <div className="mgx-nebula" />
      {/* Star layers — 1px dots multiplied via box-shadow, opacity-animated only */}
      <div className="mgx-stars mgx-sm" style={{ boxShadow: sm }} />
      <div className="mgx-stars mgx-md" style={{ boxShadow: md }} />
      <div className="mgx-stars mgx-lg" style={{ boxShadow: lg }} />
    </div>
  )
}
