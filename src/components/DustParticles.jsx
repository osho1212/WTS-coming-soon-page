import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768
const COUNT = isMobile ? 100 : 180

const DustParticles = () => {
  const ref      = useRef()
  const skipRef  = useRef(false) // alternates each frame — halves GPU uploads

  const [geometry, velocities] = useMemo(() => {
    const positions  = new Float32Array(COUNT * 3)
    const velocities = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9

      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.0018
      velocities[i * 3 + 1] =  Math.random()        * 0.0022 + 0.0004
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0010
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return [geo, velocities]
  }, [])

  useFrame(() => {
    // Drift moves so slowly that skipping every other GPU upload is imperceptible
    skipRef.current = !skipRef.current
    if (skipRef.current) return

    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 0] += velocities[i * 3 + 0] * 2 // ×2 because we tick at half-rate
      pos[i * 3 + 1] += velocities[i * 3 + 1] * 2
      pos[i * 3 + 2] += velocities[i * 3 + 2] * 2

      if (pos[i * 3 + 1] >  7.1) pos[i * 3 + 1] = -7.0
      if (pos[i * 3 + 0] >  7.1) pos[i * 3 + 0] = -7.0
      if (pos[i * 3 + 0] < -7.1) pos[i * 3 + 0] =  7.0
    }

    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.016}
        color="#7090cc"
        transparent
        opacity={0.14}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export default DustParticles
