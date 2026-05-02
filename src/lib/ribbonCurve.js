import * as THREE from 'three'

const points = []
const RADIUS = 2
const HEIGHT = 10
const TURNS = 3
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
