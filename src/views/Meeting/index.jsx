/** @jsxImportSource @emotion/react */
import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import useOctree from './useOctree'
import Stage from './Stage'
import LocalParticipant from './LocalParticipant'
import RemoteParticipant from './RemoteParticipant';
import calculateDistances from '../../helpers/calculateDistances';
import HUD from './HUD';
import Videos from './Videos';

const Meeting = ({ participants, setParticipants  }) => {
    const gltf = useGLTF('/models/scene-transformed.glb')
    const octree = useOctree(gltf.scene)
    const videos = useRef(null);
    const localParticipant = participants.filter(p => p.isLocal)[0]
    const remoteParticipants = participants.filter(p => !p.isLocal)

    const getParticipantVideo = id => {
      return videos?.current?.querySelector(`#${id} video`)
    }

    useEffect(() => {
      const distances = calculateDistances(localParticipant, remoteParticipants)
      // TODO adjust remote video volumes based on calculated distances
      // distances = [{ id: 'hullo-3857', distance: 0.352222521 }, { id: 'hullo-1232', distance: 2.35848298 }, ...]
    }, [participants])

    const handleMove = (coordinates) => {
      const message = `m${localParticipant?.id},${coordinates.position.join(',')},${coordinates.rotation.join(',')}`
      setParticipants(participants.map(p => {
        if (p.id ===localParticipant.id) {
          p.position = coordinates.position;
          p.rotation = coordinates.rotation;
        }
        return p;
      }))
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
          <LocalParticipant onMove={handleMove} octree={octree} />
        </Canvas>
        <div ref={videos}>
          <Videos streams={remoteParticipants} />
        </div>
        <HUD participants={remoteParticipants.length + 1} />
      </>
    )
}

export default Meeting;