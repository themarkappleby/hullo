import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import useOctree from './views/Meeting/useOctree'
import Peer from 'peerjs';
import Player from './views/Meeting/Player'
import Stage from './views/Meeting/Stage'
import Landing from './views/Landing';
import playVideo from './helpers/playVideo'

const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// const RATIO = 0.5625; // 16:9
const RATIO = 0.75; // 4:3
const PEER_UID = 'hullo';
const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const urlParams = new URLSearchParams(window.location.search);
const hostParam = urlParams.get('host');

let peer;
let conn;

export default function App() {
  const gltf = useGLTF('/models/scene-transformed.glb')
  const octree = useOctree(gltf.scene)
  const [otherCoordinates, setOtherCoordinates] = useState({
    position: {x: 0, y: 0.75, z: 0},
    rotation: {x: 0, y: 0, z: 0}
  });
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(!!hostParam);
  const [localId, setLocalId] = useState(getRandom(1000, 9999));
  const [showToast, setShowToast] = useState(false);
  const [copied, setCopied] = useState(false);
  const hostAddress = `${window.location.href}?host=${localId}`

  const updateVideo = stream => {
    const video = videoRef.current;
    video.srcObject = stream;
    playVideo(video);
  }

  useEffect(() => {
    getUserMedia({video: { width: 1920, height: 1080 }, audio: true}, newStream => {
      videoRef.current.srcObject = newStream;
      playVideo(videoRef.current);
    });

    if (!peer) {
      peer = new Peer(`${PEER_UID}-${localId}`);
      peer.on('open', id => {
        if (hostParam) {
          call(hostParam);
        } else {
          // urlParams.append('host', localId);
          // history.replaceState(null, null, '?'+urlParams.toString());
        }
      });
      peer.on('call', call => {
        getUserMedia({video: { width: 1920, height: 1080 }, audio: true}, stream => {
          call.answer(stream);
          call.on('stream', updateVideo);
          setConnected(true);
        }, function(err) {
          console.log('Failed to get local stream', err);
        });
      });
      peer.on('connection', c => {
        conn = c;
        conn.on('data', getCoordinates);
      });
    }
  }, []);

  const call = (destId) => {
    conn = peer.connect(`${PEER_UID}-${destId}`);
    conn.on('open', () => {
      conn.on('data', getCoordinates);
    });
    getUserMedia({video: true, audio: true}, stream => {
      const call = peer.call(`${PEER_UID}-${destId}`, stream);
      call.on('stream', updateVideo);
      setConnected(true);
    }, function(err) {
      console.log('Failed to get local stream', err);
    });
  }

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false)
      setCopied(true)
    }, 2000);
  }

  const getCoordinates = (coordinates) => {
    setOtherCoordinates(coordinates);
  }

  const sendCoordinates = (coordinates) => {
    if (conn?.send) {
      conn.send(coordinates);
    }
  }

  return (
    <>
      {connected ? (
        <Canvas shadows dpr={[2, 2]}>
          <Stage {...gltf} />
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
          <Player onMove={sendCoordinates} octree={octree} />
        </Canvas>
      ) : (
        <Landing />
      )}
    </>
  )
}
