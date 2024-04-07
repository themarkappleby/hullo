import { StrictMode, Suspense, useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Landing from './views/Landing';
import Meeting from './views/Meeting';
import Spinner from './components/Spinner';
import setQueryParam from './helpers/setQueryParam';
import Participant from './participant';

const PERMISSIONS_MSG = 'To participate in a meeting, please allow camera and microphone access.'

const App = () => {
  const [inMeeting, setInMeeting] = useState(false);
  const [stream, setStream] = useState(null);
  const [streams, setStreams] = useState([]);
  const [participants, setParticpants] = useState([]);
  window.s = streams;

  const addStream = s => {
    setStreams(prevStreams => {
      let newStreams = [...prevStreams, s];
      const uniqueIds = Array.from(new Set(newStreams.map(obj => obj.id)));
      newStreams = uniqueIds.map(id => newStreams.find(obj => obj.id === id));
      return newStreams;
    });
  }

  const startMeeting = () => {
    if (stream) {
      const participant = new Participant(stream);
      participant.initPeer().then(() => {
        setQueryParam({'id': participant.id.replace('hullo-', '')})
      })
      participant.on('stream', addStream);
      setInMeeting(true);
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  const joinMeeting = (meetingCode) => {
    if (stream) {
      const participant = new Participant(stream);
      participant.initPeer().then(() => {
        participant.connect(`hullo-${meetingCode}`)
        setQueryParam({'id': participant.id.replace('hullo-', '')})
      });
      participant.on('stream', addStream);
      setInMeeting(true);
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  if (inMeeting) {
    return <Meeting participants={participants} streams={streams} />
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
