import { StrictMode, Suspense, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Landing from './views/Landing';
import Meeting from './views/Meeting';
import Spinner from './components/Spinner';
import getRandom from './helpers/getRandom';
import setQueryParam from './helpers/setQueryParam';
import * as p2p from './p2p';

const PERMISSIONS_MSG = 'To participate in a meeting, please allow camera and microphone access.'
let broadcast = () => {};

const App = () => {
  const [inMeeting, setInMeeting] = useState(false);
  const [stream, setStream] = useState(null);
  const [participants, setParticpants] = useState([]);

  const recieveUpdate = update => {
    setParticpants(update)
  }

  const sendUpdate = coordinates => {
    broadcast(coordinates);
    // TODO
    // console.log(coordinates)
  }

  const startMeeting = () => {
    if (stream) {
      const meetingCode = getRandom(1000, 9999);
      setQueryParam({'meeting-code': meetingCode})
      broadcast = p2p.create(meetingCode, stream, recieveUpdate);
      setInMeeting(true);
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  const joinMeeting = (meetingCode) => {
    if (stream) {
      broadcast = p2p.join(meetingCode, stream, recieveUpdate);
      setInMeeting(true);
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  if (inMeeting) {
    return <Meeting onMove={sendUpdate} participants={participants} />
  } else {
    return <Landing onStart={startMeeting} onJoin={joinMeeting} onStream={stream => setStream(stream)} />
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<Spinner />}>
      <App />
    </Suspense>
  </StrictMode>
)
