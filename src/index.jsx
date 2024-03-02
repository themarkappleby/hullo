import { StrictMode, Suspense, useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Landing from './views/Landing';
import Meeting from './views/Meeting';
import Spinner from './components/Spinner';
import getRandom from './helpers/getRandom';
import setQueryParam from './helpers/setQueryParam';
import * as p2p from './p2p';
import Participant from './participant';

const PERMISSIONS_MSG = 'To participate in a meeting, please allow camera and microphone access.'

const App = () => {
  const [inMeeting, setInMeeting] = useState(false);
  const [stream, setStream] = useState(null);
  const [participants, setParticpants] = useState([]);
  const videosRef = useRef();

  const handleMove = coordinates => {
    // TODO
    // console.log(coordinates)
  }

  const addStream = stream => {
    const videos = videosRef.current;
    const video = document.createElement('video');
    video.srcObject = stream;
    videos.appendChild(video);
    const isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
    if (!isPlaying) {
      video.play().catch(e => console.log(e));
    }
  }

  const startMeeting = () => {
    if (stream) {
      const participant = new Participant(stream);
      participant.initPeer().then(() => {
        console.log(participant.id.replace('hullo-', ''))
        // setQueryParam({'meeting-code': participant.id.replace('hullo-', '')})
      })
      participant.on('stream', addStream);
      // setInMeeting(true);
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  const joinMeeting = (meetingCode) => {
    if (stream) {
      const participant = new Participant(stream);
      participant.initPeer().then(() => {
        participant.connect(`hullo-${meetingCode}`)
      });
      participant.on('stream', addStream);
      // setInMeeting(true);
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  if (inMeeting) {
    return <Meeting onMove={handleMove} participants={participants} />
  } else {
    return (
      <>
        <Landing onStart={startMeeting} onJoin={joinMeeting} onStream={stream => setStream(stream)} />
        <div ref={videosRef} className="videos" />
      </>
    )
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<Spinner />}>
      <App />
    </Suspense>
  </StrictMode>
)
