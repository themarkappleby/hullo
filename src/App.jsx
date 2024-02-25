/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import useOctree from './useOctree'
import Peer from 'peerjs';
import Player from './Player'
import Stage from './Stage'
import styles from './styles'


// const RATIO = 0.5625; // 16:9
const RATIO = 0.75; // 4:3
const PEER_UID = 'hullo';
const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const urlParams = new URLSearchParams(window.location.search);
const hostParam = urlParams.get('host');

const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

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
  const videoRef = useRef();
  const hostAddress = `${window.location.href}?host=${localId}`

  const updateVideo = stream => {
    const video = videoRef.current;
    video.srcObject = stream;
    const isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
    if (!isPlaying) {
      video.play().catch(e => console.log(e));
    }
  }

  useEffect(() => {
    getUserMedia({video: { width: 1920, height: 1080 }, audio: true}, newStream => {
      videoRef.current.srcObject = newStream;
      videoRef.current.play();
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
      <div css={styles.preview}>
        <div css={styles.videoWrapper}>
          <video css={styles.video} ref={videoRef} />
          <p>Please allow camera and microphone access</p>
        </div>
        <div css={styles.notice}>
          👋 Heads up! Once you're in a meeting, you will no longer be able to see your camera
        </div>
      </div>
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
        <div css={styles.landing}>
          {connecting ? (
            <h1 style={{padding: '50px'}}>Connecting...</h1>
          ) : (
            <>
              <main css={styles.main}>
                <img css={styles.logo} src="/images/logo.svg" alt="Hullo logo" />
                <h1>Spacial video conferencing</h1>
                <h2>In-office style collaboration for distributed teams</h2>
                <div css={styles.buttonGroup}>
                  <button css={styles.button} onClick={() => copy(hostAddress)}>Start meeting</button>
                  <button css={styles.button} className="plain">Enter meeting code</button>
                </div>
              </main>
              <div css={styles.message} className={copied ? 'show' : ''}>
                The invite link has been copied to your clipboard. Share it with a friend to start a call.
              </div>
              <div css={styles.toast} className={showToast ? 'show' : ''}>
                Copied!
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
