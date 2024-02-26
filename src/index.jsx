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

const App = () => {
  const [inMeeting, setInMeeting] = useState(false);
  const [stream, setStream] = useState(null);

  const startMeeting = () => {
    if (stream) {
      const meetingCode = getRandom(1000, 9999);
      setQueryParam({'meeting-code': meetingCode})
      p2p.create(meetingCode, stream);
      setInMeeting(true);
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  const joinMeeting = (meetingCode) => {
    if (stream) {
      p2p.join(meetingCode, stream)
      setInMeeting(true);
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  const handleMove = (coordinates) => {
    // TODO
    // console.log(coordinates)
  }

  if (inMeeting) {
    return <Meeting onMove={handleMove} participants={[]} />
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
