/** @jsxImportSource @emotion/react */
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import useOctree from './useOctree'
import Stage from './Stage'
import LocalParticipant from './LocalParticipant'
import HUD from './HUD';
import Videos from './Videos';
const RATIO = 0.75; // 4:3

const RemoteParticipant = ({position, rotation}) => {
  return (
    <>
      <mesh position={position} rotation={rotation} >
        <boxGeometry args={[1.2, 1.2 * RATIO, 0.05]} />
        <meshStandardMaterial attach="material-0" color="black" /> {/* right */}
        <meshStandardMaterial attach="material-1" color="black" /> {/* left */}
        <meshStandardMaterial attach="material-2" color="black" /> {/* top */}
        <meshStandardMaterial attach="material-3" color="black" /> {/* bottom */}
        <meshStandardMaterial attach="material-4" color="black" /> {/* back */}
        <meshBasicMaterial attach="material-5"> {/* front */}
          {/* <videoTexture attach="map" args={[videoRef?.current]} generateMipmaps={false} encoding={THREE.sRGBEncoding} magFilter={THREE.LinearFilter} /> */}
        </meshBasicMaterial>
      </mesh>
      <mesh
        position={[
          position[0],
          position[1] - 1.03,
          position[2]
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
  1. DONE Refactor parent component (../index.jsx) to store participants (and put the streams on the relevant participant).
  1. DONE Pass participants into Meeting rather than streams. Revise Video and HUD accordingly.
  1. DONE Broadcast onMove coordinates from LocalParticipant
  1. DONE For each participant that is not the LocalParticipant, render the RemoteParticipant component.
  1. Wire up video texture for remote participants.
*/

const Meeting = ({ participants  }) => {
    const gltf = useGLTF('/models/scene-transformed.glb')
    const octree = useOctree(gltf.scene)
    const localParticipant = participants.filter(p => p.isLocal)[0]
    const remoteParticipants = participants.filter(p => !p.isLocal)

    const handleMove = (coordinates) => {
      const message = `m${localParticipant?.id},${coordinates.position.join(',')},${coordinates.rotation.join(',')}`
      localParticipant.broadcast(message);
    }

    return (
      <>
        <Canvas shadows dpr={[2, 2]}>
          <Stage {...gltf} />
          {remoteParticipants.map(p => <RemoteParticipant key={p.id} position={p.position} rotation={p.rotation} />)}
          <LocalParticipant onMove={handleMove} octree={octree} />
        </Canvas>
        <Videos streams={remoteParticipants} />
        <HUD participants={remoteParticipants.length + 1} />
      </>
    )
}

export default Meeting;