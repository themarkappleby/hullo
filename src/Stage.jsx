import { Environment } from '@react-three/drei'

export default gltf => {
  const ref = gltf.nodes.Suzanne007
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
      <Environment files="/img/rustig_koppie_puresky_1k.hdr" background />
      <group dispose={null}>
        <mesh castShadow receiveShadow geometry={ref.geometry} material={ref.material} position={[1.74, 1.04, 24.97]} />
      </group>
    </>
  );
}
