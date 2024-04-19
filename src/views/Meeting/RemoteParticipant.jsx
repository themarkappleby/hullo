import * as THREE from 'three'
import RoundedRect from './RoundedRect';

const SIZE = 1;
const RATIO = 3 / 4;
const SHADOW_HEIGHT = 1.15;

const RemoteParticipant = ({position, rotation, video}) => {
  return (
    <>
      <mesh position={position} rotation={rotation} >
        <boxGeometry args={[SIZE * RATIO, SIZE, 0.15]} />
        <meshStandardMaterial attach="material-0" color="black" />
        <meshStandardMaterial attach="material-1" color="black" />
        <meshStandardMaterial attach="material-2" color="black" />
        <meshStandardMaterial attach="material-3" color="black" />
        <meshStandardMaterial attach="material-4" color="black" />
        {video ? (
            <meshBasicMaterial attach="material-5">
                <videoTexture attach="map" args={[video]} generateMipmaps={false} encoding={THREE.sRGBEncoding} magFilter={THREE.LinearFilter} />
            </meshBasicMaterial>
        ) : (
            <meshStandardMaterial attach="material-5" color="black" />
        )}
      </mesh>
      {/* <RoundedRect position={position} rotation={rotation} width={SIZE * RATIO} height={SIZE} depth={0.15} radius={0.05} video={video} /> */}
      <mesh rotation={[Math.PI / -2, 0, 0]} position={[
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