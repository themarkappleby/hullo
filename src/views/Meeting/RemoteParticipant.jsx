import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

const SHADOW_HEIGHT = 1.09;

const RemoteParticipant = ({position, rotation, video}) => {
  const gltf = useGLTF('/models/participant.glb')
  return (
    <>
      <mesh
        geometry={gltf.nodes.Cube.geometry}
        scale={[0.5, 0.5, 0.5]}
        position={position}
        rotation={rotation}
      >
        {video ? (
          <meshBasicMaterial>
              <videoTexture flipY={false} attach="map" args={[video]} generateMipmaps={false} encoding={THREE.sRGBEncoding} magFilter={THREE.LinearFilter} />
          </meshBasicMaterial>
        ) : (
          <meshStandardMaterial attach="material" color="black" />
        )}
      </mesh>

      {/* Shadow */}
      <mesh
        rotation={[Math.PI * -0.5, 0, 0]}
        position={[
          position[0],
          position[1] - SHADOW_HEIGHT,
          position[2]
        ]}>
        <circleGeometry args={[0.3, 16]} />
        <meshPhongMaterial color="black" opacity={0.1} transparent />
      </mesh>
    </>
  )
}

export default RemoteParticipant;