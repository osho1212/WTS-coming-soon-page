import { useEffect, useRef, useState } from 'react'
import StudioScene from './components/StudioScene'
import RibbonReel from './components/RibbonReel'
import ComingSoonLogo from './components/ComingSoonLogo'
import Galaxy from './components/Galaxy'
import ReelPanels from './components/ReelPanels'
import CinemaLoader from './components/CinemaLoader'

import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const scrollHintRef = useRef(null)
  const transitionOverlayRef = useRef(null)
  const [loaderDone, setLoaderDone] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    window._lenis = lenis

    lenis.on('scroll', ({ scroll }) => {
      ScrollTrigger.update()

      // Scroll hint fades on first scroll
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const p = maxScroll > 0 ? scroll / maxScroll : 0
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = Math.max(0, 1 - p / 0.08)
      }

      // Transition overlay: fades in as camera dives into the iPhone screen
      const spacerEl = document.querySelector('.scroll-spacer')
      if (spacerEl && transitionOverlayRef.current) {
        const spacerEnd = spacerEl.offsetTop + spacerEl.offsetHeight - window.innerHeight
        if (scroll <= spacerEnd) {
          const sp = spacerEnd > 0 ? scroll / spacerEnd : 0
          const opacity = Math.max(0, Math.min(1, (sp - 0.92) / 0.08))
          transitionOverlayRef.current.style.opacity = opacity
        }
      }
    })

    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      window._lenis = null
    }
  }, [])

  return (
    <div className="app-container">
      {!loaderDone && <CinemaLoader onComplete={() => setLoaderDone(true)} />}
      <StudioScene>
        <RibbonReel />
        <ComingSoonLogo />
      </StudioScene>

      <div
        ref={scrollHintRef}
        className="fixed bottom-10 left-0 w-full flex flex-col items-center gap-3 z-20 pointer-events-none"
      >
        <div className="scroll-arrow" />
        <p className="text-[10px] tracking-[0.38em] uppercase text-blue-500/55 font-medium">
          Scroll to explore
        </p>
      </div>

      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        opacity: 0.35,
      }}>
        <Galaxy
          mouseRepulsion={false}
          mouseInteraction={false}
          density={0.9}
          glowIntensity={0.5}
          saturation={1}
          hueShift={160}
          twinkleIntensity={0.5}
          rotationSpeed={0}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.3}
          speed={1}
          transparent={false}
        />
      </div>

      {/* Transition veil: scroll-driven fade-to-black as camera dives into screen */}
      <div
        ref={transitionOverlayRef}
        className="scene-transition-overlay"
        style={{
          position: 'fixed', inset: 0,
          background: '#080808',
          opacity: 0,
          zIndex: 9,
          pointerEvents: 'none',
        }}
      />

      <div className="scroll-spacer" />

      {/* Only mount ReelPanels after the loader — it's 700vh away and this shaves setup cost off the critical path */}
      {loaderDone && (
        <div style={{ position: 'relative', zIndex: 10 }}>
          <ReelPanels />
        </div>
      )}
    </div>
  )
}

export default App
