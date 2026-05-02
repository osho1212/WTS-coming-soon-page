import { Text3D, Center, useGLTF, Clone, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, Suspense, useMemo } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// --- SUB-COMPONENT: Screen Image ---
const ScreenImage = () => {
  const texture = useTexture('/7f786d58-0bfd-497f-86f9-fce8d5e009e7.jpg')

  const geometry = useMemo(() => {
    const width = 1.45
    const height = 3.05
    const radius = 0.22

    const w = width / 2
    const h = height / 2

    const shape = new THREE.Shape()
    shape.moveTo(-w + radius, -h)
    shape.lineTo(w - radius, -h)
    shape.quadraticCurveTo(w, -h, w, -h + radius)
    shape.lineTo(w, h - radius)
    shape.quadraticCurveTo(w, h, w - radius, h)
    shape.lineTo(-w + radius, h)
    shape.quadraticCurveTo(-w, h, -w, h - radius)
    shape.lineTo(-w, -h + radius)
    shape.quadraticCurveTo(-w, -h, -w + radius, -h)

    const geo = new THREE.ShapeGeometry(shape, 8)

    // Fix UVs: ShapeGeometry uses local-space coords — remap to [0,1]
    const pos = geo.attributes.position
    const uvs = geo.attributes.uv
    for (let i = 0; i < pos.count; i++) {
      uvs.setXY(
        i,
        (pos.getX(i) + w) / width,
        (pos.getY(i) + h) / height,
      )
    }
    uvs.needsUpdate = true

    return geo
  }, [])

  return (
    <mesh geometry={geometry} position={[0, 0, 0.12]} renderOrder={10}>
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

// --- SUB-COMPONENT: Screen Title (centered on phone screen) ---
const ScreenTitle = ({ titleRef, scrollProgress }) => {
  const initialGroupRef = useRef()
  const finalGroupRef = useRef()

  // Shared material builders
  const blueMat = (
    <meshStandardMaterial
      color="#1a6fff"
      emissive="#1a6fff"
      emissiveIntensity={0.45}
      metalness={0.7}
      roughness={0.05}
      toneMapped={false}
    />
  )
  const whiteMat = (
    <meshStandardMaterial
      color="#ffffff"
      emissive="#ffffff"
      emissiveIntensity={0.35}
      metalness={0.7}
      roughness={0.05}
      toneMapped={false}
    />
  )

  const text3DProps = {
    font: '/fonts/optimer_bold.typeface.json',
    size: 0.28,
    height: 0.06,
    curveSegments: 32,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.006,
    bevelSegments: 12,
  }

  // Toggle visibility based on scroll threshold
  useFrame(() => {
    // If we are in the exit phase, we want to show the FINAL "Coming Soon" state
    // regardless of the initial scroll progress.
    const isExiting = window._wtsExitProgress > 0
    const p = scrollProgress.current
    
    // During normal scroll, switch at 0.8. During exit, always show final once exit starts.
    const showFinal = isExiting ? (window._wtsExitProgress > 0.1) : (p > 0.8)
    
    if (initialGroupRef.current) initialGroupRef.current.visible = !showFinal
    if (finalGroupRef.current)   finalGroupRef.current.visible = showFinal
  })

  return (
    <group ref={titleRef} position={[0, 0, 0.25]} renderOrder={20}>

      {/* === INITIAL: "Walktalk Studios" (Perfectly Centered) === */}
      <group ref={initialGroupRef} position={[0, 0.45, 0]}>
        <Center top left={false} center>
          <Text3D {...text3DProps}>Walktalk Studios{whiteMat}</Text3D>
        </Center>
      </group>

      {/* === FINAL: "Walktalk Studios / Coming Soon" === */}
      <group ref={finalGroupRef}>
        <group position={[0, 0.18, 0]}>
          <Center><Text3D {...text3DProps}>Walktalk Studios{whiteMat}</Text3D></Center>
        </group>
        <group position={[0, -0.18, 0]}>
          <Center><Text3D {...text3DProps}>Coming Soon{whiteMat}</Text3D></Center>
        </group>
      </group>

    </group>
  )
}

// --- SUB-COMPONENT: iPhone ---
const IPhoneMockup = ({ titleRef, scrollProgress }) => {
  const { scene } = useGLTF('/models/iphone_17_pro.glb')

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach((m) => {
          m.metalness = Math.min(m.metalness, 0.45)
          m.roughness = Math.max(m.roughness, 0.25)
          m.emissive = new THREE.Color('#0a0c10')
          m.emissiveIntensity = 0.6
          m.envMapIntensity = 3
          m.needsUpdate = true
        })
      }
    })
  }, [scene])

  const { scale, offsetY } = useMemo(() => {
    if (!scene) return { scale: 1, offsetY: 0 }
    scene.scale.set(1, 1, 1)
    scene.position.set(0, 0, 0)
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const s = 3.2 / size.y
    return { scale: s, offsetY: -center.y * s }
  }, [scene])

  return (
    <group position={[0, 0, -0.4]}>
      <pointLight position={[-2, 6, 4]}  intensity={90}  color="#ffffff" distance={20} />
      <pointLight position={[4, -1, 4]}  intensity={80}  color="#ffffff" distance={16} />
      <pointLight position={[0, 0, -7]}  intensity={100} color="#3366ff" distance={18} />
      <group position={[0, offsetY, 0]}>
        <Clone object={scene} scale={scale} />
        {/* Screen image */}
        <Suspense fallback={null}><ScreenImage /></Suspense>
        {/* Title centered on screen — same group = same origin */}
        <Suspense fallback={null}><ScreenTitle titleRef={titleRef} scrollProgress={scrollProgress} /></Suspense>
      </group>
    </group>
  )
}

// --- MAIN LOGO COMPONENT ---
const ComingSoonLogo = () => {
  const titleRef = useRef()
  const groupRef = useRef()
  const phoneGroupRef = useRef()
  const scrollProgress = useRef(0)
  const lerpedRotation = useRef(0)

  useEffect(() => {
    const spacer = document.querySelector('.scroll-spacer')
    const trigger = ScrollTrigger.create({
      trigger: spacer || document.documentElement,
      start: 'top top',
      onUpdate: (self) => { scrollProgress.current = self.progress },
    })
    
    return () => trigger.kill()
  }, [])

  useFrame(() => {
    let p = 0
    if (window._wtsExitProgress > 0) {
      // Scale and rotate back (p: 1 -> 0) during exit
      p = 1 - window._wtsExitProgress
    } else {
      // Scale and rotate away (p: 0 -> 1) during initial dive
      p = Math.min(1, scrollProgress.current / 0.05)
    }

    if (titleRef.current) {
      const s = 1 - p * 0.4
      titleRef.current.scale.set(s, s, s)
    }
    if (groupRef.current) {
      const rotationProgress = THREE.MathUtils.smoothstep(p, 0.7, 1.0)
      const targetRotation = rotationProgress * Math.PI * 2
      lerpedRotation.current = THREE.MathUtils.lerp(lerpedRotation.current, targetRotation, 0.05)
      groupRef.current.rotation.y = lerpedRotation.current
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <group ref={phoneGroupRef}>
        <Suspense fallback={null}><IPhoneMockup titleRef={titleRef} scrollProgress={scrollProgress} /></Suspense>
      </group>
    </group>
  )
}

export default ComingSoonLogo

useGLTF.preload('/models/iphone_17_pro.glb')
