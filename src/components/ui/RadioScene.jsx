import React from 'react'

const RadioScene = () => {
  const generateBars = (count, offset, scale) => {
    return Array.from({ length: count }, (_, i) => {
      const base = 25
        + Math.sin(i * 0.1 + offset) * 15
        + Math.cos(i * 0.3 + offset) * 10
        + Math.sin(i * 0.8 + offset) * 5
      return (Math.abs(base) + 5) * scale
    })
  }

  const layers = [
    { id: 'back',  bars: generateBars(40, 0,  0.5), blur: 8, opacity: 0.3, duration: 40, scale: 1.0  },
    { id: 'mid',   bars: generateBars(30, 20, 0.8), blur: 3, opacity: 0.6, duration: 25, scale: 1.05 },
    { id: 'front', bars: generateBars(20, 40, 1.2), blur: 0, opacity: 1.0, duration: 15, scale: 1.1  },
  ]

  return (
    <div className="scene-radio-full" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FF007F" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF8A00" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>

      {layers.map((layer) => (
        <div
          key={layer.id}
          style={{
            position: 'absolute', inset: 0,
            opacity: layer.opacity,
            filter: `blur(${layer.blur}px)`,
            transform: `scale(${layer.scale})`,
            display: 'flex', alignItems: 'center',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              width: '200%', height: '100%', flexShrink: 0,
              animation: `panWave ${layer.duration}s linear infinite alternate`,
            }}
          >
            {layer.bars.map((h, i) => {
              const x = (i / layer.bars.length) * 100
              const w = (100 / layer.bars.length) * 0.6
              return (
                <rect
                  key={i}
                  x={x}
                  y={50 - h / 2}
                  width={w}
                  height={h}
                  fill="url(#waveGrad)"
                  rx={w / 2}
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animationName: 'radioBarPulse',
                    animationDuration: `${3 + Math.abs(Math.sin(i)) * 2}s`,
                    animationDelay: `${-(i * 0.18) % 3}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDirection: 'alternate',
                  }}
                />
              )
            })}
          </svg>
        </div>
      ))}
    </div>
  )
}

export default RadioScene
