import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import CameraRig from './CameraRig'
import PostProcessing from './PostProcessing'
import DustParticles from './DustParticles'

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768

/**
 * FrameController — drives the Three.js render loop at a capped 60 fps only
 * while the studio scene is actually on screen. Capping at 60 fps prevents
 * 120/144 Hz displays from doubling GPU work with no visual benefit.
 * When ReelPanels take over they set window._wtsSceneVisible = false; at that
 * point we stop calling invalidate() and Three.js draws nothing, cutting its
 * GPU cost to zero for the remainder of the scroll journey.
 */
const TARGET_FRAME_MS = 1000 / 60

const FrameController = () => {
  const { invalidate } = useThree()
  useEffect(() => {
    let rafId
    let lastTime = 0
    const tick = (t) => {
      if (window._wtsSceneVisible !== false && t - lastTime >= TARGET_FRAME_MS) {
        lastTime = t
        invalidate()
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [invalidate])
  return null
}

const StudioScene = ({ children }) => (
  <div id="studio-scene-root" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
    <Canvas
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      camera={{ position: [0, -6, 9], fov: 50 }}
      frameloop="demand"
      gl={{
        antialias: !isMobile,
        stencil: false,
        depth: true,
        powerPreference: isMobile ? 'default' : 'high-performance'
      }}
    >
      <FrameController />
      <color attach="background" args={['#050505']} />
      <CameraRig />

      <pointLight position={[ 10, -10, -5]} intensity={4} color="#0055ff" />
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, -8]} intensity={2} color="#000a40" />

      <DustParticles />

      <Suspense fallback={null}>
        <Environment preset="city" background={false} />
        {children}
      </Suspense>

      <PostProcessing />
    </Canvas>
  </div>
)

export default StudioScene
