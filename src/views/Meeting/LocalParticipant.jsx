import { useRef, useMemo, useEffect } from 'react'
import { Capsule } from 'three/examples/jsm/math/Capsule.js'
import { Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import useKeyboard from './useKeyboard'
import { PointerLockControls } from '@react-three/drei'

const HEIGHT = 0.6;
const GRAVITY = 30;
const FRAME_STEPS = 5;

export default function LocalParticipant({ octree, cursorLocked, onMove, onLock, onUnlock }) {
  const playerOnFloor = useRef(true)
  const controlsEl = useRef(null)
  const playerVelocity = useMemo(() => new Vector3(), [])
  const playerDirection = useMemo(() => new Vector3(), [])
  const capsule = useMemo(() => new Capsule(new Vector3(0, 0, 0), new Vector3(0, HEIGHT, 0), 0.5), [])

  const keyboard = useKeyboard()

  useEffect(() => {
    controlsEl.current.lock();
  }, [])

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
    if (cursorLocked) {
      if (keyboard['KeyW'] || keyboard['ArrowUp']) {
        playerVelocity.add(getForwardVector(camera, playerDirection).multiplyScalar(speedDelta));
      } 
      if (keyboard['KeyA'] || keyboard['ArrowLeft']) {
        playerVelocity.add(getSideVector(camera, playerDirection).multiplyScalar(-speedDelta));
      }
      if (keyboard['KeyS'] || keyboard['ArrowDown']) {
        playerVelocity.add(getForwardVector(camera, playerDirection).multiplyScalar(-speedDelta));
      }
      if (keyboard['KeyD'] || keyboard['ArrowRight']) {
        playerVelocity.add(getSideVector(camera, playerDirection).multiplyScalar(speedDelta));
      } 
    }
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
    <PointerLockControls ref={controlsEl} onLock={onLock} onUnlock={onUnlock} selector=".cursorLockTarget" />
  )
}
