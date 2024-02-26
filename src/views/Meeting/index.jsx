import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import useOctree from './useOctree'
import Stage from './Stage'
import ActiveParticipant from './ActiveParticipant'
import HUD from './HUD';

const Meeting = ({ onMove, participants }) => {
    const gltf = useGLTF('/models/scene-transformed.glb')
    const octree = useOctree(gltf.scene)
    return (
      <>
        <Canvas shadows dpr={[2, 2]}>
          <Stage {...gltf} />
          {/* handle particpants here */}
          <ActiveParticipant onMove={onMove} octree={octree} />
        </Canvas>
        <HUD {...participants} />
      </>
    )
}

export default Meeting;