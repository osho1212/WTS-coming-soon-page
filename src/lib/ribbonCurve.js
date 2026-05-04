import * as THREE from 'three'

const points = []
const RADIUS = 2.5    // slightly wider for more spatial presence
const HEIGHT = 8.5    // vertical span
const TURNS = 2.4     // fewer turns → more open, flowing arc between loops
const COUNT = 250     // more points for a smoother curve

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
