import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import CameraRig from './CameraRig'
import PostProcessing from './PostProcessing'
import DustParticles from './DustParticles'

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768

const StudioScene = ({ children }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
    <Canvas
      dpr={isMobile ? [0.75, 1] : [1, 1.25]}
      camera={{ position: [0, -6, 9], fov: 50 }}
      frameloop="always"
      gl={{ 
        antialias: false, 
        stencil: false,
        depth: true,
        powerPreference: 'high-performance' 
      }}
    >
      <color attach="background" args={['#050505']} />
      <CameraRig />

      <pointLight position={[ 10, -10, -5]}                           intensity={4} color="#0055ff" />
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
