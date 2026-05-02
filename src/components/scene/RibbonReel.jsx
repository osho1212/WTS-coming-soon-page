import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { ribbonCurve } from '../../lib/ribbonCurve'

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768

// ─── Layout ───────────────────────────────────────────────────────────────────
const RIBBON_HW       = 0.22   // ribbon half-width (total = 0.44)
const FRAME_COUNT     = 60     // photo frames along strip
const FRAME_W         = 0.25   // image width
const FRAME_H         = FRAME_W * 1.35  // image height

// Sprocket holes — square perforations
const SPROCKET_COUNT  = 240    // holes per edge
const SPROCKET_SIZE   = 0.055
const SPROCKET_OFFSET = RIBBON_HW - 0.055
const SPROCKET_LIFT   = 0.014

// ─── Performance optimized quality tiers ──────────────────────────────────────
const EDGE_FRAMES     = isMobile ? 40 : 80
const PLACE_FRAMES    = isMobile ? 120 : 250
const SPK_FRAMES      = isMobile ? 180 : 350
const TUBE_SEGS       = isMobile ? 40 : 65
const TUBE_RADIAL     = isMobile ? 3 : 4 // Reduced radial segments for performance

// ─── Precompute: edge curves ──────────────────────────────────────────────────
const _fe = ribbonCurve.computeFrenetFrames(EDGE_FRAMES, false)
const _lPts = []
const _rPts = []
for (let i = 0; i <= EDGE_FRAMES; i++) {
  const pt = ribbonCurve.getPoint(i / EDGE_FRAMES)
  const bi = _fe.binormals[i]
  _lPts.push(new THREE.Vector3(pt.x + bi.x * RIBBON_HW, pt.y + bi.y * RIBBON_HW, pt.z + bi.z * RIBBON_HW))
  _rPts.push(new THREE.Vector3(pt.x - bi.x * RIBBON_HW, pt.y - bi.y * RIBBON_HW, pt.z - bi.z * RIBBON_HW))
}
const edgeCurveLeft  = new THREE.CatmullRomCurve3(_lPts)
const edgeCurveRight = new THREE.CatmullRomCurve3(_rPts)

const _makeQ = (idx, fr) => new THREE.Quaternion().setFromRotationMatrix(
  new THREE.Matrix4().makeBasis(fr.binormals[idx], fr.tangents[idx], fr.normals[idx]),
)

// ─── Precompute: image frame placements ──────────────────────────────────────
const _fp = ribbonCurve.computeFrenetFrames(PLACE_FRAMES, false)
const SEGMENT_T = Array.from({ length: FRAME_COUNT }, (_, i) => (i + 1) / (FRAME_COUNT + 1))
const framePlacements = SEGMENT_T.map((t) => {
  const idx = Math.round(t * PLACE_FRAMES)
  return { position: ribbonCurve.getPointAt(t), quaternion: _makeQ(idx, _fp) }
})

// ─── Precompute: sprocket hole instance matrices ──────────────────────────────
const _sp = ribbonCurve.computeFrenetFrames(SPK_FRAMES, false)
const _scaleOne = new THREE.Vector3(1, 1, 1)

const sprocketMatrices = Array.from({ length: SPROCKET_COUNT }, (_, i) => {
  const t = i / (SPROCKET_COUNT - 1)
  const idx = Math.round(t * SPK_FRAMES)
  const pt = ribbonCurve.getPointAt(t)
  const bi = _sp.binormals[idx]
  const nm = _sp.normals[idx]
  const q = _makeQ(idx, _sp)

  const lx = pt.x + bi.x * SPROCKET_OFFSET - nm.x * SPROCKET_LIFT
  const ly = pt.y + bi.y * SPROCKET_OFFSET - nm.y * SPROCKET_LIFT
  const lz = pt.z + bi.z * SPROCKET_OFFSET - nm.z * SPROCKET_LIFT

  const rx = pt.x - bi.x * SPROCKET_OFFSET - nm.x * SPROCKET_LIFT
  const ry = pt.y - bi.y * SPROCKET_OFFSET - nm.y * SPROCKET_LIFT
  const rz = pt.z - bi.z * SPROCKET_OFFSET - nm.z * SPROCKET_LIFT

  return [
    new THREE.Matrix4().compose(new THREE.Vector3(lx, ly, lz), q, _scaleOne),
    new THREE.Matrix4().compose(new THREE.Vector3(rx, ry, rz), q, _scaleOne),
  ]
}).flat()

const TEXTURE_PATHS = Array.from({ length: 18 }, (_, i) =>
  `/frames/photos/frame_${String(i + 1).padStart(2, '0')}.webp`
)

const SprocketHoles = () => {
  const ref = useRef()
  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    sprocketMatrices.forEach((m, i) => mesh.setMatrixAt(i, m))
    mesh.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[null, null, sprocketMatrices.length]} renderOrder={3}>
      <planeGeometry args={[SPROCKET_SIZE, SPROCKET_SIZE]} />
      <meshStandardMaterial
        color="#e8f0ff"
        emissive="#5599ff"
        emissiveIntensity={0.6}
        side={THREE.DoubleSide}
        polygonOffset
        polygonOffsetFactor={-2}
        polygonOffsetUnits={-2}
      />
    </instancedMesh>
  )
}

// ─── Optimized: Instanced Photo Frames ──────────────────────────────────────
const InstancedPhotoFrames = ({ textures }) => {
  const meshRefs = useRef([])

  // Group placements by texture index
  const groups = useMemo(() => {
    const map = new Map()
    framePlacements.forEach((p, i) => {
      const texIdx = i % textures.length
      if (!map.has(texIdx)) map.set(texIdx, [])
      map.get(texIdx).push(p)
    })
    return Array.from(map.entries())
  }, [textures.length])

  useEffect(() => {
    groups.forEach(([texIdx, placements], groupIdx) => {
      const mesh = meshRefs.current[groupIdx]
      if (!mesh) return
      placements.forEach((p, i) => {
        const m = new THREE.Matrix4().compose(p.position, p.quaternion, _scaleOne)
        mesh.setMatrixAt(i, m)
      })
      mesh.instanceMatrix.needsUpdate = true
    })
  }, [groups])

  return (
    <>
      {groups.map(([texIdx, placements], i) => (
        <instancedMesh 
          key={texIdx} 
          ref={el => meshRefs.current[i] = el} 
          args={[null, null, placements.length]} 
          renderOrder={2}
        >
          <planeGeometry args={[FRAME_W, FRAME_H]} />
          <meshBasicMaterial 
            map={textures[texIdx]} 
            side={THREE.DoubleSide} 
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </instancedMesh>
      ))}
    </>
  )
}

const RibbonReel = () => {
  const groupRef = useRef()
  const textures = useTexture(TEXTURE_PATHS)

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.15
  })

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {/* Neon edge accent lines - reduced geometry */}
      <mesh renderOrder={1}>
        <tubeGeometry args={[edgeCurveLeft, TUBE_SEGS, 0.006, TUBE_RADIAL, false]} />
        <meshStandardMaterial color="#0044ee" emissive="#0044ee" emissiveIntensity={14} toneMapped={false} />
      </mesh>
      <mesh renderOrder={1}>
        <tubeGeometry args={[edgeCurveRight, TUBE_SEGS, 0.006, TUBE_RADIAL, false]} />
        <meshStandardMaterial color="#0044ee" emissive="#0044ee" emissiveIntensity={14} toneMapped={false} />
      </mesh>

      <SprocketHoles />
      <InstancedPhotoFrames textures={textures} />
    </group>
  )
}

export default RibbonReel
