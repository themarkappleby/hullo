import * as THREE from 'three'

const SIZE = 1;
const RATIO = 3 / 4;

const RemoteParticipant = ({position, rotation, video}) => {
  return (
    <>
      <mesh position={position} rotation={rotation} >
        <boxGeometry args={[SIZE * RATIO, SIZE, 0.15]} />
        <meshStandardMaterial attach="material-0" color="black" />{/* right */}
        <meshStandardMaterial attach="material-1" color="black" />{/* left */}
        <meshStandardMaterial attach="material-2" color="black" />{/* top */}
        <meshStandardMaterial attach="material-3" color="black" />{/* bottom */}
        <meshStandardMaterial attach="material-4" color="black" />{/* back */}
        {video ? (
            <meshBasicMaterial attach="material-5">{/* front */}
                <videoTexture attach="map" args={[video]} generateMipmaps={false} encoding={THREE.sRGBEncoding} magFilter={THREE.LinearFilter} />
            </meshBasicMaterial>
        ) : (
            <meshStandardMaterial attach="material-5" color="black" />
        )}
      </mesh>
      <mesh rotation={[Math.PI / -2, 0, 0]} position={[
          position[0],
          position[1] - 1.35,
          position[2]
        ]}>
        <circleGeometry args={[0.3, 16]} />
        <meshPhongMaterial color="black" opacity={0.1} transparent />
      </mesh>
    </>
  )
}

export default RemoteParticipant;