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
  const [participants, setParticipants] = useState([]);

  const addParticipant = s => {
    setParticipants(prevParticipants => {
      let newParticipants = [...prevParticipants, s];
      const uniqueIds = Array.from(new Set(newParticipants.map(obj => obj.id)));
      newParticipants = uniqueIds.map(id => newParticipants.find(obj => obj.id === id));
      return newParticipants;
    })
  }

  const startMeeting = () => {
    if (stream) {
      const participant = new Participant(stream);
      participant.isLocal = true;
      participant.stream = stream;
      setParticipants([...participants, participant]);
      participant.initPeer().then(() => {
        setQueryParam({'id': participant.id.replace('hullo-', '')})
      })
      participant.on('stream', addParticipant);
      setInMeeting(true);
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  const joinMeeting = (meetingCode) => {
    if (stream) {
      const participant = new Participant(stream);
      participant.isLocal = true;
      participant.stream = stream;
      setParticipants([...participants, participant]);
      participant.initPeer().then(() => {
        participant.connect(`hullo-${meetingCode}`)
        setQueryParam({'id': participant.id.replace('hullo-', '')})
      });
      participant.on('stream', addParticipant);
      setInMeeting(true);
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  if (inMeeting) {
    return <Meeting participants={participants} />
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
