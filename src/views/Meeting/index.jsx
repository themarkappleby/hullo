/** @jsxImportSource @emotion/react */
import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import useOctree from './useOctree'
import Stage from './Stage'
import LocalParticipant from './LocalParticipant'
import RemoteParticipant from './RemoteParticipant';
import calculateDistances from '../../helpers/calculateDistances';
import HUD from './HUD';
import Videos from './Videos';

const VOLUME_DISTANCE_CUTOFF = 15;
const MIN_VOLUME = 0.05;

const Meeting = ({ participants, setParticipants  }) => {
    const gltf = useGLTF('/models/scene.glb')
    const octree = useOctree(gltf.scene)
    const videos = useRef(null);
    const [cursorLocked, setCursorLocked] = useState(true);
    const localParticipant = participants.filter(p => p.isLocal)[0]
    const remoteParticipants = participants.filter(p => !p.isLocal)

    const getParticipantVideo = id => {
      return videos?.current?.querySelector(`#${id} video`)
    }

    useEffect(() => {
      const distances = calculateDistances(localParticipant, remoteParticipants)
      distances.forEach(d => {
        const video = getParticipantVideo(d.id);
        video.volume = Math.min(Math.max((VOLUME_DISTANCE_CUTOFF - d.distance) / 10, MIN_VOLUME), 1);
      })
    }, [localParticipant, remoteParticipants])

    const handleMove = (coordinates) => {
      const message = `m${localParticipant?.id},${coordinates.position.join(',')},${coordinates.rotation.join(',')}`
      setParticipants(prevParticipants => {
        return prevParticipants?.map(p => {
          if (p.id ===localParticipant.id) {
            p.position = coordinates.position;
            p.rotation = coordinates.rotation;
          }
          return p;
        })
      })
      localParticipant.broadcast(message);
    }

    return (
      <>
        <Canvas shadows dpr={[2, 2]}>
          <Stage {...gltf} />
          {remoteParticipants.map(p => {
            const video = getParticipantVideo(p.id);
            return <RemoteParticipant video={video} key={p.id} position={p.position} rotation={p.rotation} />
          })}
          <LocalParticipant cursorLocked={cursorLocked} onMove={handleMove} onLock={() => setCursorLocked(true)} onUnlock={() => setCursorLocked(false)} octree={octree} />
        </Canvas>
        <div ref={videos}>
          <Videos streams={remoteParticipants} />
        </div>
        <HUD participants={remoteParticipants.length + 1} cursorLocked={cursorLocked} />
      </>
    )
}

export default Meeting;