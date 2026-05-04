import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { ribbonCurve } from '../../lib/ribbonCurve'

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768

// ─── Layout ───────────────────────────────────────────────────────────────────
const RIBBON_HW       = 0.30
const FRAME_COUNT     = 60
const FRAME_W         = 0.34
const FRAME_H         = FRAME_W * 1.22
const FRAME_BORDER    = 0.018  // dark border width around each photo frame

// Sprocket holes — rectangular perforations on both faces
const SPROCKET_COUNT  = 300
const SPROCKET_W      = 0.044
const SPROCKET_H      = 0.056
const SPROCKET_OFFSET = RIBBON_HW - 0.062

// ─── Performance tiers ───────────────────────────────────────────────────────
const EDGE_FRAMES  = isMobile ? 80  : 150
const PLACE_FRAMES = isMobile ? 200 : 400
const SPK_FRAMES   = isMobile ? 300 : 600
const RIBBON_SEGS  = isMobile ? 130 : 280
const TUBE_SEGS    = isMobile ? 80  : 140
const TUBE_RADIAL  = isMobile ? 4   : 6

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
  new THREE.Matrix4().makeBasis(fr.binormals[idx], fr.tangents[idx], fr.normals[idx])
)

// ─── Precompute: frame placements ─────────────────────────────────────────────
const _fp = ribbonCurve.computeFrenetFrames(PLACE_FRAMES, false)
const SEGMENT_T = Array.from({ length: FRAME_COUNT }, (_, i) => (i + 1) / (FRAME_COUNT + 1))
const framePlacements = SEGMENT_T.map((t) => {
  const idx = Math.round(t * PLACE_FRAMES)
  return { position: ribbonCurve.getPointAt(t), quaternion: _makeQ(idx, _fp) }
})

// ─── Precompute: sprocket matrices — front AND back faces ─────────────────────
// Each sprocket is duplicated: once lifted toward the ribbon's front normal,
// once toward the back, so both sides of the strip look identical.
const _sp = ribbonCurve.computeFrenetFrames(SPK_FRAMES, false)
const _scaleOne = new THREE.Vector3(1, 1, 1)

const sprocketMatrices = Array.from({ length: SPROCKET_COUNT }, (_, i) => {
  const t   = i / (SPROCKET_COUNT - 1)
  const idx = Math.round(t * SPK_FRAMES)
  const pt  = ribbonCurve.getPointAt(t)
  const bi  = _sp.binormals[idx]
  const q   = _makeQ(idx, _sp)

  // One pair per position (left + right rail), centred on the ribbon surface.
  // DoubleSide material makes them visible from both faces — no duplication needed.
  return [
    new THREE.Matrix4().compose(
      new THREE.Vector3(pt.x + bi.x * SPROCKET_OFFSET, pt.y + bi.y * SPROCKET_OFFSET, pt.z + bi.z * SPROCKET_OFFSET),
      q, _scaleOne
    ),
    new THREE.Matrix4().compose(
      new THREE.Vector3(pt.x - bi.x * SPROCKET_OFFSET, pt.y - bi.y * SPROCKET_OFFSET, pt.z - bi.z * SPROCKET_OFFSET),
      q, _scaleOne
    ),
  ]
}).flat()  // total: SPROCKET_COUNT × 2 instances

// ─── Flat ribbon geometry ─────────────────────────────────────────────────────
const makeRibbonGeo = (segments) => {
  const frames    = ribbonCurve.computeFrenetFrames(segments, false)
  const positions = []
  const norms     = []
  const uvs       = []
  const indices   = []

  for (let i = 0; i <= segments; i++) {
    const t  = i / segments
    const pt = ribbonCurve.getPointAt(t)
    const bi = frames.binormals[i]
    const nm = frames.normals[i]

    positions.push(
      pt.x + bi.x * RIBBON_HW, pt.y + bi.y * RIBBON_HW, pt.z + bi.z * RIBBON_HW,
      pt.x - bi.x * RIBBON_HW, pt.y - bi.y * RIBBON_HW, pt.z - bi.z * RIBBON_HW,
    )
    norms.push(nm.x, nm.y, nm.z, nm.x, nm.y, nm.z)
    uvs.push(0, t, 1, t)
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1
    indices.push(a, c, b, b, c, d)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('normal',   new THREE.Float32BufferAttribute(norms, 3))
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  return geo
}

const TEXTURE_PATHS = Array.from({ length: 18 }, (_, i) =>
  `/frames/photos/frame_${String(i + 1).padStart(2, '0')}.webp`
)

// ─── Film base ribbon ─────────────────────────────────────────────────────────
const RibbonBase = () => {
  const geo = useMemo(() => makeRibbonGeo(RIBBON_SEGS), [])
  return (
    <mesh geometry={geo} renderOrder={1}>
      <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
    </mesh>
  )
}

// ─── Frame borders (dark matte around each photo) ─────────────────────────────
const FrameBorders = () => {
  const ref = useRef()
  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    framePlacements.forEach((p, i) => {
      mesh.setMatrixAt(i, new THREE.Matrix4().compose(p.position, p.quaternion, _scaleOne))
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[null, null, framePlacements.length]} renderOrder={2}>
      <planeGeometry args={[FRAME_W + FRAME_BORDER * 2, FRAME_H + FRAME_BORDER * 2]} />
      <meshBasicMaterial
        color="#000000"
        side={THREE.DoubleSide}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </instancedMesh>
  )
}

// ─── Sprocket holes ───────────────────────────────────────────────────────────
const SprocketHoles = () => {
  const ref = useRef()
  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    sprocketMatrices.forEach((m, i) => mesh.setMatrixAt(i, m))
    mesh.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[null, null, sprocketMatrices.length]} renderOrder={4}>
      <planeGeometry args={[SPROCKET_W, SPROCKET_H]} />
      <meshStandardMaterial
        color="#d8d8d8"
        metalness={0.0}
        roughness={0.9}
        side={THREE.DoubleSide}
        polygonOffset
        polygonOffsetFactor={-5}
        polygonOffsetUnits={-5}
      />
    </instancedMesh>
  )
}

// ─── Instanced photo frames ───────────────────────────────────────────────────
const InstancedPhotoFrames = ({ textures }) => {
  const meshRefs = useRef([])

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
    groups.forEach(([, placements], groupIdx) => {
      const mesh = meshRefs.current[groupIdx]
      if (!mesh) return
      placements.forEach((p, i) => {
        mesh.setMatrixAt(i, new THREE.Matrix4().compose(p.position, p.quaternion, _scaleOne))
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
          renderOrder={3}
        >
          <planeGeometry args={[FRAME_W, FRAME_H]} />
          <meshStandardMaterial
            map={textures[texIdx]}
            emissive="#ffffff"
            emissiveMap={textures[texIdx]}
            emissiveIntensity={0.45}
            side={THREE.DoubleSide}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
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
      {/* Film base — solid dark ribbon body (double-sided) */}
      <RibbonBase />

      {/* Outer edge rails along each film edge */}
      <mesh renderOrder={1}>
        <tubeGeometry args={[edgeCurveLeft,  TUBE_SEGS, 0.007, TUBE_RADIAL, false]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh renderOrder={1}>
        <tubeGeometry args={[edgeCurveRight, TUBE_SEGS, 0.007, TUBE_RADIAL, false]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Dark border matte behind each photo — visible on both sides */}
      <FrameBorders />

      {/* Photo images (front only — back shows the dark border) */}
      <InstancedPhotoFrames textures={textures} />

      {/* Sprocket holes — front AND back of strip */}
      <SprocketHoles />
    </group>
  )
}

export default RibbonReel
