import * as THREE from 'three'

const points = []
const RADIUS = 1.8    // intimate orbit around the iPhone
const HEIGHT = 6.5    // increased height to add space between swirls
const TURNS = 3.5       // more loops for the denser frame count
const COUNT = 100

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
