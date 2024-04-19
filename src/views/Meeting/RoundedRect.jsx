import { ExtrudeGeometry, MeshBasicMaterial, Shape, Vector2, Mesh } from 'three';
import * as THREE from 'three';

const RoundedRectShape = (width, height, radius) => {
  // Create a rounded rectangle shape using the Shape constructor
  const shape = new Shape();

  // Starting point
  shape.moveTo(-width / 2 + radius, -height / 2);

  // Top side
  shape.lineTo(width / 2 - radius, -height / 2);
  shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);

  // Right side
  shape.lineTo(width / 2, height / 2 - radius);
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);

  // Bottom side
  shape.lineTo(-width / 2 + radius, height / 2);
  shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);

  // Left side
  shape.lineTo(-width / 2, -height / 2 + radius);
  shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

  return shape;
};

const RoundedRect = ({ width, height, position = [0,0,0], rotation = [0,0,0], video, depth, radius }) => {
  const roundedRectShape = RoundedRectShape(width, height, radius);

  const geometry = new ExtrudeGeometry(roundedRectShape, {
    steps: 1,
    depth: depth,
    bevelEnabled: false,
  });

  // ref: https://discourse.threejs.org/t/extudebuffergeometry-back-material/6213/3
  geometry.clearGroups();
  var group_count = [0,0,0];
  var group_start = [null, null, null];
  for (var i = 1; i <= geometry.attributes.normal.count; i++) {
      var index = 2 + ((3*i) - 3);
      var v_index = i - 1;
      var z = geometry.attributes.normal.array[index];

      switch(z) {
          case 1: group_count[0]++;
                  group_start[0] = group_start[0] == null ? v_index: group_start[0];
                  break; //Front
          case 0: group_count[1]++;
                  group_start[1] = group_start[1] == null ? v_index: group_start[1];
                  break; //Side
          case -1: group_count[2]++;
                  group_start[2] = group_start[2] == null ? v_index: group_start[2];
                  break; //Back
      
      }
  }

  geometry.addGroup(group_start[0], group_count[0], 2);
  geometry.addGroup(group_start[1], group_count[1], 1);
  geometry.addGroup(group_start[2], group_count[2], 0);

  return (
    <mesh position={position} rotation={rotation}>
        <bufferGeometry attach="geometry" {...geometry} />
        {video ? (
            <meshBasicMaterial attach="material-0">
                <videoTexture attach="map" args={[video]} generateMipmaps={false} encoding={THREE.sRGBEncoding} magFilter={THREE.LinearFilter} />
            </meshBasicMaterial>
        ) : (
            <meshStandardMaterial attach="material-0" color="black" />
        )}
        <meshStandardMaterial attach="material-1" color="black" />
        <meshStandardMaterial attach="material-2" color="black" />
    </mesh>
  );
};

export default RoundedRect;
