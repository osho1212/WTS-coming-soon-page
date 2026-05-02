import * as THREE from 'three'

const points = []
const RADIUS = 2.4    // wider orbit for more spatial presence
const HEIGHT = 9.0    // more vertical space between twists
const TURNS = 2.8       // fewer, wider loops for a cleaner look
const COUNT = 200

for (let i = 0; i <= COUNT; i++) {
  const t = i / COUNT
  const angle = t * Math.PI * 2 * TURNS
  points.push(new THREE.Vector3(
    Math.cos(angle) * RADIUS,
    (t - 0.5) * HEIGHT,
    Math.sin(angle) * RADIUS,
  ))
}

export const ribbonCurve = new THREE.CatmullRomCurve3(points)
