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

  // const geometry = new ExtrudeGeometry(roundedRectShape, {
  //   steps: 1,
  //   depth: depth,
  //   bevelEnabled: false,
  // });

  const geometry = RectangleRounded(1.5, 2, 0.15, 6);

  // ref: https://discourse.threejs.org/t/extudebuffergeometry-back-material/6213/3
  // geometry.clearGroups();
  // var group_count = [0,0,0];
  // var group_start = [null, null, null];
  // for (var i = 1; i <= geometry.attributes.normal.count; i++) {
  //     var index = 2 + ((3*i) - 3);
  //     var v_index = i - 1;
  //     var z = geometry.attributes.normal.array[index];

  //     switch(z) {
  //         case 1: group_count[0]++;
  //                 group_start[0] = group_start[0] == null ? v_index: group_start[0];
  //                 break; //Front
  //         case 0: group_count[1]++;
  //                 group_start[1] = group_start[1] == null ? v_index: group_start[1];
  //                 break; //Side
  //         case -1: group_count[2]++;
  //                 group_start[2] = group_start[2] == null ? v_index: group_start[2];
  //                 break; //Back
      
  //     }
  // }
  // geometry.addGroup(group_start[0], group_count[0], 2);
  // geometry.addGroup(group_start[1], group_count[1], 1);
  // geometry.addGroup(group_start[2], group_count[2], 0);

  return (
    <mesh position={position} geometry={geometry}>
        {/* <bufferGeometry attach="geometry" {...geometry} /> */}
        <meshBasicMaterial attach="material" color="red" />
        {/* {video ? (
            <meshBasicMaterial attach="material-0">
                <videoTexture attach="map" args={[video]} generateMipmaps={false} encoding={THREE.sRGBEncoding} magFilter={THREE.LinearFilter} />
            </meshBasicMaterial>
        ) : (
            <meshBasicMaterial attach="material-0" color="blue" />
        )}
        <meshStandardMaterial attach="material-1" color="black" />
        <meshStandardMaterial attach="material-2" color="black" /> */}
    </mesh>
  );
};

export default RoundedRect;










// Ref: https://discourse.threejs.org/t/roundedrectangle-squircle/28645
function RectangleRounded( w, h, r, s, e = 2 ) { // width, height, radiusCorner, smoothness
	const wi = w / 2 - r;
	const hi = h / 2 - r;
	const w2 = w / 2;
	const h2 = h / 2;
	const ul = r / w;
	const ur = ( w - r ) / w;
	const vl = r / h;
	const vh = ( h - r ) / h;

	let positions = [
		-wi, -h2, 0,  wi, -h2, 0,  wi, h2, 0,
		-wi, -h2, 0,  wi,  h2, 0, -wi, h2, 0,	
		-w2, -hi, 0, -wi, -hi, 0, -wi, hi, 0,
		-w2, -hi, 0, -wi,  hi, 0, -w2, hi, 0,	
		wi, -hi, 0,  w2, -hi, 0,  w2, hi, 0,
		wi, -hi, 0,  w2,  hi, 0,  wi, hi, 0
	];

	let uvs = [
		ul,  0, ur,  0, ur,  1,
		ul,  0, ur,  1, ul,  1,
		0, vl, ul, vl, ul, vh,
		0, vl, ul, vh,  0, vh,
		ur, vl,  1, vl,  1, vh,
		ur, vl,  1, vh,	ur, vh 
	];

	let phia = 0; 
	let phib, xc, yc, uc, vc;

	for ( let i = 0; i < s * 4; i ++ ) {
		phib = Math.PI * 2 * ( i + 1 ) / ( 4 * s );
		xc = i < s || i >= 3 * s ? wi : - wi;
		yc = i < 2 * s ? hi : -hi;
		positions.push( xc, yc, 0, xc + r * Math.cos( phia ), yc + r * Math.sin( phia ), 0,  xc + r * Math.cos( phib ), yc + r * Math.sin( phib ), 0 );
		uc = xc = i < s || i >= 3 * s ? ur : ul;
		vc = i < 2 * s ? vh : vl;
		uvs.push( uc, vc, uc + ul * Math.cos( phia ), vc + vl * Math.sin( phia ), uc + ul * Math.cos( phib ), vc + vl * Math.sin( phib ) );
		phia = phib;
	}

	const geometry = new THREE.BufferGeometry( );

  // const geometry = new THREE.ExtrudeGeometry(
  //   new THREE.BufferGeometry(),
  //   { depth: e, bevelEnabled: false }
  // )

	geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ), 3 ) );
	geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );

	return geometry;
}