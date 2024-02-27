/** @jsxImportSource @emotion/react */
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import useOctree from './useOctree'
import Stage from './Stage'
import ActiveParticipant from './ActiveParticipant'
import HUD from './HUD';
import styles from './styles';

const Meeting = ({ onMove, participants }) => {
    const videoRef = useRef();
    const gltf = useGLTF('/models/scene-transformed.glb')
    const octree = useOctree(gltf.scene)
    return (
      <>
        <Canvas shadows dpr={[2, 2]}>
          <Stage {...gltf} />
          {/* handle particpants here */}
          <ActiveParticipant onMove={onMove} octree={octree} />
        </Canvas>
        <video css={styles.video} ref={videoRef} />
        <HUD participants={participants} />
      </>
    )
}

export default Meeting;