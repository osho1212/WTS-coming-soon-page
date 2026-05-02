import { useEffect, useRef, useState } from 'react'

export default function CinemaLoader({ onComplete }) {
  const [percent, setPercent] = useState(0)
  const [exiting, setExiting] = useState(false)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    const duration = 2600

    function tick(ts) {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const t = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      const p = Math.floor(eased * 100)
      setPercent(p)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setPercent(100)
        setTimeout(() => {
          setExiting(true)
          setTimeout(() => onComplete?.(), 700)
        }, 300)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#003DA5',
        display: 'flex',
        flexDirection: 'column',
        padding: '48px',
        opacity: exiting ? 0 : 1,
        transition: 'opacity 0.7s ease',
        pointerEvents: exiting ? 'none' : 'all',
        fontFamily: "'Oswald', sans-serif",
      }}
    >
      {/* WTS title top-left */}
      <div
        style={{
          color: '#ffffff',
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: 700,
          letterSpacing: '0.06em',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        WTS
      </div>

      {/* Loading bar at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '48px',
          left: '48px',
          right: '48px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            Loading
          </span>
          <span
            style={{
              color: '#ffffff',
              fontSize: 'clamp(13px, 2vw, 16px)',
              fontWeight: 700,
              letterSpacing: '0.05em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {percent}%
          </span>
        </div>

        {/* Track */}
        <div
          style={{
            width: '100%',
            height: '2px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          {/* Fill */}
          <div
            style={{
              height: '100%',
              width: `${percent}%`,
              background: '#ffffff',
              borderRadius: '2px',
              transition: 'width 0.05s linear',
            }}
          />
        </div>
      </div>
    </div>
  )
}
