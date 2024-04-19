import { Environment } from '@react-three/drei'
import RoundedRect from './RoundedRect'

const SIZE = 1;
const RATIO = 3 / 4;

export default gltf => {
  const ref = gltf.nodes.Plane
  return (
    <>
      <directionalLight
        intensity={1}
        castShadow={true}
        shadow-bias={-0.00015}
        shadow-radius={4}
        shadow-blur={10}
        shadow-mapSize={[2048, 2048]}
        position={[85.0, 80.0, 70.0]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <Environment files="/images/rustig_koppie_puresky_1k.hdr" background />
      <RoundedRect
        position={[0, 1.15, -2]}
        rotation={[0, 180 * (Math.PI / 180), 0]}
        width={SIZE * RATIO}
        height={SIZE}
        depth={0.15}
        radius={0.05}
      />
      <group dispose={null}>
        <mesh castShadow receiveShadow geometry={ref.geometry} material={ref.material} position={[0, 0, 0]} />
      </group>
    </>
  );
}
