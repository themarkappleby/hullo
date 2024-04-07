/** @jsxImportSource @emotion/react */
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import useOctree from './useOctree'
import Stage from './Stage'
import ActiveParticipant from './ActiveParticipant'
import HUD from './HUD';
import Videos from './Videos';

const Meeting = ({ participants, streams  }) => {
    const gltf = useGLTF('/models/scene-transformed.glb')
    const octree = useOctree(gltf.scene)
    return (
      <>
        {/* <Canvas shadows dpr={[2, 2]}>
          <Stage {...gltf} />
          <ActiveParticipant onMove={(coordinates) => console.log(coordinates)} octree={octree} />
        </Canvas> */}
        <Videos streams={streams} />
        <HUD participants={participants} />
      </>
    )
}

export default Meeting;