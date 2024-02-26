import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import useOctree from './useOctree'
import Stage from './Stage'
import ActiveParticipant from './ActiveParticipant'
import HUD from './HUD';

const Meeting = () => {
    const gltf = useGLTF('/models/scene-transformed.glb')
    const octree = useOctree(gltf.scene)
    const sendCoordinates = (e) => {console.log(e)}
    return (
      <>
        <Canvas shadows dpr={[2, 2]}>
          <Stage {...gltf} />
          <ActiveParticipant onMove={sendCoordinates} octree={octree} />
        </Canvas>
        <HUD />
      </>
    )
}

export default Meeting;