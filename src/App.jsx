import { useEffect, useRef, useState } from 'react'
import StudioScene from './components/scene/StudioScene'
import RibbonReel from './components/scene/RibbonReel'
import ComingSoonLogo from './components/scene/ComingSoonLogo'
import Galaxy from './components/scene/Galaxy'
import ReelPanels from './components/ui/ReelPanels'
import CinemaLoader from './components/ui/CinemaLoader'

import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

// Evaluated once at module load — safe since UA and screen width don't change mid-session
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768

function App() {
  const scrollHintRef = useRef(null)
  const [loaderDone, setLoaderDone] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({
      duration: isMobile ? 0.8 : 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,   // never intercept native iOS momentum scroll
      touchMultiplier: 1,
    })

    window._lenis = lenis

    let hasAutoScrolled = false

    lenis.on('scroll', ({ scroll }) => {
      ScrollTrigger.update()

      // Auto-scroll only on non-touch devices — on iOS this fights the ongoing
      // touch gesture and can freeze the scroll position
      if (!isMobile && !hasAutoScrolled && scroll > 20 && loaderDone) {
        hasAutoScrolled = true
        lenis.scrollTo(window.innerHeight * 1.2, {
          duration: 1.8,
          easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        })
      }

      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = Math.max(0, 1 - scroll / (window.innerHeight * 0.1))
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

      {/* Galaxy is a second full-screen OGL WebGL context — skip on mobile to
          prevent GPU memory exhaustion alongside the Three.js canvas */}
      {!isMobile && (
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
            density={0.55}
            glowIntensity={0.4}
            saturation={0.8}
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
      )}

      <div className="scroll-spacer" />

      {loaderDone && (
        <div style={{ position: 'relative', zIndex: 10 }}>
          <ReelPanels />
        </div>
      )}
    </div>
  )
}

export default App
