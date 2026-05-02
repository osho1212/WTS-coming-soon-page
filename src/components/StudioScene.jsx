import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import CameraRig from './CameraRig'
import PostProcessing from './PostProcessing'
import DustParticles from './DustParticles'

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768

const FrameDriver = () => {
  const { invalidate } = useThree()

  useEffect(() => {
    const INTERVAL = 1000 / 60
    let last = 0
    let id

    const tick = (now) => {
      id = requestAnimationFrame(tick)
      if (now - last >= INTERVAL) {
        last = now - ((now - last) % INTERVAL)
        invalidate()
      }
    }

    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [invalidate])

  return null
}

const StudioScene = ({ children }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
    <Canvas
      dpr={isMobile ? [0.75, 1] : [1, 1.5]}
      camera={{ position: [0, -6, 9], fov: 50 }}
      frameloop="demand"
      gl={{ antialias: false }}
    >

      <color attach="background" args={['#050505']} />
      <FrameDriver />
      <CameraRig />

      <pointLight position={[ 10, -10, -5]}                           intensity={4} color="#0055ff" />
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, -8]} intensity={2} color="#000a40" />

      <DustParticles />

      <Suspense fallback={null}>
        {/* IBL inside Suspense so it loads cleanly without blocking the canvas */}
        <Environment preset="city" background={false} />
        {children}
      </Suspense>

      <PostProcessing />
    </Canvas>
  </div>
)

export default StudioScene
