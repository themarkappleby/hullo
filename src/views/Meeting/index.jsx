/** @jsxImportSource @emotion/react */
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import useOctree from './useOctree'
import Stage from './Stage'
import LocalParticipant from './LocalParticipant'
import HUD from './HUD';
import Videos from './Videos';

const RemoteParticipant = () => {
  return (
    <>
      <mesh position={otherCoordinates.position} rotation={otherCoordinates.rotation} >
        <boxGeometry args={[1.2, 1.2 * RATIO, 0.05]} />
        <meshStandardMaterial attach="material-0" color="black" /> {/* right */}
        <meshStandardMaterial attach="material-1" color="black" /> {/* left */}
        <meshStandardMaterial attach="material-2" color="black" /> {/* top */}
        <meshStandardMaterial attach="material-3" color="black" /> {/* bottom */}
        <meshStandardMaterial attach="material-4" color="black" /> {/* back */}
        <meshBasicMaterial attach="material-5"> {/* front */}
          <videoTexture attach="map" args={[videoRef?.current]} generateMipmaps={false} encoding={THREE.sRGBEncoding} magFilter={THREE.LinearFilter} />
        </meshBasicMaterial>
      </mesh>
      <mesh
        position={[
          otherCoordinates.position[0],
          otherCoordinates.position[1] - 1.03,
          otherCoordinates.position[2]
        ]}
      >
        <capsuleGeometry args={[0.3, 0.5, 10, 16]} />
        <meshStandardMaterial color='black' />
      </mesh>
    </>
  )
}

/*
  TODO
  1. Refactor parent component (../index.jsx) to store participants (and put the streams on the relevant participant).
  1. Pass participants into Meeting rather than streams. Revise Video and HUD accordingly.
  1. Broadcast onMove coordinates from LocalParticipant
  1. For each participant that is not the LocalParticipant, render the RemoteParticipant component.
*/

const Meeting = ({ participants, streams  }) => {
    const gltf = useGLTF('/models/scene-transformed.glb')
    const octree = useOctree(gltf.scene)
    console.log({participants})
    return (
      <>
        {/* <Canvas shadows dpr={[2, 2]}>
          <Stage {...gltf} />
          <RemoteParticipant />
          <LocalParticipant onMove={(coordinates) => console.log(coordinates)} octree={octree} />
        </Canvas> */}
        <Videos streams={streams} />
        <HUD participants={streams.length + 1} />
      </>
    )
}

export default Meeting;