import { useRef, useMemo } from 'react'
import { Capsule } from 'three/examples/jsm/math/Capsule.js'
import { Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import useKeyboard from './useKeyboard'
import { PointerLockControls } from '@react-three/drei'

const GRAVITY = 30;
const FRAME_STEPS = 5;

export default function ActiveParticipant({ octree, onMove }) {
  const playerOnFloor = useRef(true)
  const playerVelocity = useMemo(() => new Vector3(), [])
  const playerDirection = useMemo(() => new Vector3(), [])
  const capsule = useMemo(() => new Capsule(new Vector3(0, 0, 0), new Vector3(0, 1, 0), 0.5), [])

  const keyboard = useKeyboard()

  function getForwardVector(camera, playerDirection) {
    camera.getWorldDirection(playerDirection)
    playerDirection.y = 0
    playerDirection.normalize()
    return playerDirection
  }

  function getSideVector(camera, playerDirection) {
    camera.getWorldDirection(playerDirection)
    playerDirection.y = 0
    playerDirection.normalize()
    playerDirection.cross(camera.up)
    return playerDirection
  }

  function controls(camera, delta, playerVelocity, playerOnFloor, playerDirection) {
    const speedDelta = delta * (playerOnFloor ? 25 : 8)
    keyboard['KeyA'] && playerVelocity.add(getSideVector(camera, playerDirection).multiplyScalar(-speedDelta))
    keyboard['KeyD'] && playerVelocity.add(getSideVector(camera, playerDirection).multiplyScalar(speedDelta))
    keyboard['KeyW'] && playerVelocity.add(getForwardVector(camera, playerDirection).multiplyScalar(speedDelta))
    keyboard['KeyS'] && playerVelocity.add(getForwardVector(camera, playerDirection).multiplyScalar(-speedDelta))
  }

  function updatePlayer(camera, delta, octree, capsule, playerVelocity, playerOnFloor) {
    let damping = Math.exp(-10 * delta) - 1
    if (!playerOnFloor) {
      playerVelocity.y -= GRAVITY * delta
      damping *= 0.1 // small air resistance
    }
    playerVelocity.addScaledVector(playerVelocity, damping)
    const deltaPosition = playerVelocity.clone().multiplyScalar(delta)
    capsule.translate(deltaPosition)
    playerOnFloor = playerCollisions(capsule, octree, playerVelocity)
    camera.position.copy(capsule.end)
    onMove({
      position: [camera.position.x, camera.position.y, camera.position.z],
      rotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z],
    });
    return playerOnFloor
  }

  function playerCollisions(capsule, octree, playerVelocity) {
    const result = octree.capsuleIntersect(capsule)
    let playerOnFloor = false
    if (result) {
      playerOnFloor = result.normal.y > 0
      if (!playerOnFloor) {
        playerVelocity.addScaledVector(result.normal, -result.normal.dot(playerVelocity))
      }
      capsule.translate(result.normal.multiplyScalar(result.depth))
    }
    return playerOnFloor
  }

  function teleportPlayerIfOob(camera, capsule, playerVelocity) {
    if (camera.position.y <= -100) {
      playerVelocity.set(0, 0, 0)
      capsule.start.set(0, 0, 0)
      capsule.end.set(0, 1, 0)
      camera.position.copy(capsule.end)
      camera.rotation.set(0, 0, 0)
    }
  }

  useFrame(({ camera }, delta) => {
    controls(camera, delta, playerVelocity, playerOnFloor.current, playerDirection)
    const deltaSteps = Math.min(0.05, delta) / FRAME_STEPS
    for (let i = 0; i < FRAME_STEPS; i++) {
      playerOnFloor.current = updatePlayer(camera, deltaSteps, octree, capsule, playerVelocity, playerOnFloor.current)
    }
    teleportPlayerIfOob(camera, capsule, playerVelocity)
  })

  return (
    <PointerLockControls />
  )
}
