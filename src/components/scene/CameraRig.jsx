
import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

// Camera starts on the phone screen then dives into it as user scrolls
const cameraPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(1.5, 0.3, 5),   // opening: phone visible, slight right offset
  new THREE.Vector3(-1, 0.4, 4.5), // gentle arc left — ribbon in periphery
  new THREE.Vector3(0, 0.3, 3.5), // settling front-on
  new THREE.Vector3(0, 0.3, 3),   // phone fills the frame
  new THREE.Vector3(0, 0.3, 1.5), // tight approach — screen nearly fills viewport
  new THREE.Vector3(0, 0.3, 0.05),// diving through the glass
])

// Where the camera looks at each stage
const lookAtPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.3, 0),   // phone centre
  new THREE.Vector3(0, 0.3, 0),   // phone centre
  new THREE.Vector3(0, 0.3, 0),   // phone centre
  new THREE.Vector3(0, 0.3, 0),   // phone centre
  new THREE.Vector3(0, 0.3, -0.3), // screen face
  new THREE.Vector3(0, 0.3, -0.3), // screen face (hold)
])

// How quickly the camera catches up to its target — lower = more "weightless"
const LERP = 0.09

const CameraRig = () => {
  const { camera } = useThree()
  const scrollProgress = useRef(0)

  // Separate lerped state so we don't create garbage every frame
  const lerpedPos = useRef(new THREE.Vector3(1.5, 0.3, 5))
  const lerpedLookAt = useRef(new THREE.Vector3(0, 0.3, 0))
  const targetPos = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())

  useEffect(() => {
    const spacer = document.querySelector('.scroll-spacer')
    const trigger = ScrollTrigger.create({
      trigger: spacer || document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: ({ progress }) => {
        scrollProgress.current = progress
      },
    })

    return () => trigger.kill()
  }, [])

  useFrame(() => {
    let t = 0
    if (window._wtsExitProgress > 0) {
      // Smoothly zoom out (t: 1 -> 0) over the entire exit progress
      t = 1 - window._wtsExitProgress
    } else {
      // Smoothly zoom in (t: 0 -> 1) over the first 5% of scroll
      t = Math.min(1, scrollProgress.current / 0.05)
    }

    cameraPath.getPointAt(t, targetPos.current)
    lookAtPath.getPointAt(t, targetLookAt.current)

    lerpedPos.current.lerp(targetPos.current, LERP)
    lerpedLookAt.current.lerp(targetLookAt.current, LERP)

    camera.position.copy(lerpedPos.current)
    camera.lookAt(lerpedLookAt.current)
  })

  return null
}

export default CameraRig
