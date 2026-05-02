import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ribbonCurve } from '../lib/ribbonCurve'

gsap.registerPlugin(ScrollTrigger)

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768

const SEGMENT_T = Array.from({ length: 25 }, (_, i) => (i + 1) / 26)
const FRAME_W = 0.44
const FRAME_H = FRAME_W * (16 / 9)

const EDGE_FRAMES = isMobile ? 50 : 100
const PLACE_FRAMES = isMobile ? 100 : 200
const EXTRUDE_STEPS = isMobile ? 60 : 100
const TUBE_SEGS = isMobile ? 50 : 80
const TUBE_RADIAL = isMobile ? 4 : 6

// ─── geometry + frenet frame placements ──────────────────────────────────────
const _fe = ribbonCurve.computeFrenetFrames(EDGE_FRAMES, false)
const _hw = 0.23
const _lPts = [], _rPts = []
for (let i = 0; i <= EDGE_FRAMES; i++) {
  const pt = ribbonCurve.getPoint(i / EDGE_FRAMES)
  const bi = _fe.binormals[i]
  _lPts.push(new THREE.Vector3(pt.x + bi.x * _hw, pt.y + bi.y * _hw, pt.z + bi.z * _hw))
  _rPts.push(new THREE.Vector3(pt.x - bi.x * _hw, pt.y - bi.y * _hw, pt.z - bi.z * _hw))
}
const edgeCurveLeft = new THREE.CatmullRomCurve3(_lPts)
const edgeCurveRight = new THREE.CatmullRomCurve3(_rPts)

const _fp = ribbonCurve.computeFrenetFrames(PLACE_FRAMES, false)
const framePlacements = SEGMENT_T.map((t) => {
  const idx = Math.round(t * PLACE_FRAMES)
  const mat = new THREE.Matrix4().makeBasis(
    _fp.binormals[idx], _fp.tangents[idx], _fp.normals[idx],
  )
  return {
    position: ribbonCurve.getPointAt(t),
    quaternion: new THREE.Quaternion().setFromRotationMatrix(mat),
  }
})

const shape = (() => {
  const s = new THREE.Shape()
  const w = 0.5, th = 0.02
  s.moveTo(-w / 2, -th / 2)
  s.lineTo(w / 2, -th / 2)
  s.lineTo(w / 2, th / 2)
  s.lineTo(-w / 2, th / 2)
  s.lineTo(-w / 2, -th / 2)
  return s
})()
const extrudeSettings = { steps: EXTRUDE_STEPS, extrudePath: ribbonCurve, bevelEnabled: false }

const TEXTURE_PATHS = Array.from({ length: 18 }, (_, i) =>
  `/frames/photos/frame_${String(i + 1).padStart(2, '0')}.webp`
)

// ─── individual frame mesh ────────────────────────────────────────────────────
const FilmFrame = ({ position, quaternion, texture }) => {
  return (
    <mesh position={position} quaternion={quaternion} renderOrder={1}>
      <planeGeometry args={[FRAME_W, FRAME_H]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

const RibbonReel = () => {
  const groupRef = useRef()
  const tube1Ref = useRef()
  const tube2Ref = useRef()
  const glassRef = useRef()
  const framesGroupRef = useRef()
  const scrollProgress = useRef(0)
  const textures = useTexture(TEXTURE_PATHS)

  useEffect(() => {
    const spacer = document.querySelector('.scroll-spacer')
    const trigger = ScrollTrigger.create({
      trigger: spacer || document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { scrollProgress.current = self.progress },
    })
    return () => trigger.kill()
  }, [])

  useFrame(({ clock }) => {
    const p = scrollProgress.current
    const t = clock.getElapsedTime()
    
    // Vertical expansion factor: 1.0 (none) -> 2.5 (expanded)
    // Only expand in the final position (starting from 0.85 scroll)
    const expansion = 1 + THREE.MathUtils.smoothstep(p, 0.85, 1.0) * 1.5

    if (groupRef.current) groupRef.current.rotation.y = t * 0.2
    
    if (tube1Ref.current) tube1Ref.current.scale.y = expansion
    if (tube2Ref.current) tube2Ref.current.scale.y = expansion
    if (glassRef.current) glassRef.current.scale.y = expansion
    
    if (framesGroupRef.current) {
      framesGroupRef.current.children.forEach((child, i) => {
        const orig = framePlacements[i]
        if (orig) {
          child.position.y = orig.position.y * expansion
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Neon edge tubes */}
      <mesh ref={tube1Ref} renderOrder={0}>
        <tubeGeometry args={[edgeCurveLeft, TUBE_SEGS, 0.012, TUBE_RADIAL, false]} />
        <meshStandardMaterial color="#0055ff" emissive="#0055ff" emissiveIntensity={18} toneMapped={false} />
      </mesh>
      <mesh ref={tube2Ref} renderOrder={0}>
        <tubeGeometry args={[edgeCurveRight, TUBE_SEGS, 0.012, TUBE_RADIAL, false]} />
        <meshStandardMaterial color="#0055ff" emissive="#0055ff" emissiveIntensity={18} toneMapped={false} />
      </mesh>

      {/* Film frames */}
      <group ref={framesGroupRef}>
        {framePlacements.map(({ position, quaternion }, i) => (
          <FilmFrame
            key={i}
            position={position}
            quaternion={quaternion}
            texture={textures[i % textures.length]}
          />
        ))}
      </group>

      {/* Glass ribbon overlay */}
      <mesh ref={glassRef} renderOrder={2}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshBasicMaterial
          color="#aabbff"
          transparent
          opacity={0.10}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export default RibbonReel
