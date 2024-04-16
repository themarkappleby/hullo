import * as THREE from 'three'

const SIZE = 1;
const RATIO = 4 / 3;

const RemoteParticipant = ({position, rotation, video}) => {
  return (
    <>
      <mesh position={position} rotation={rotation} >
        <boxGeometry args={[SIZE * RATIO, SIZE, 0.05]} />
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
    </>
  )
}

export default RemoteParticipant;