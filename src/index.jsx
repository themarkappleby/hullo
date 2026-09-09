import { StrictMode, Suspense, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Landing from './views/Landing';
import Meeting from './views/Meeting';
import Spinner from './components/Spinner';
import HulloParticipant from './HulloParticipant';

const PERMISSIONS_MSG = 'To participate in a meeting, please allow camera and microphone access.'
const DEFAULT_POSITION = [-0.06727645665744926, 1.4985016584396327, -0.06728071925570354]

const App = () => {
  const [inMeeting, setInMeeting] = useState(false);
  const [stream, setStream] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  const addParticipant = s => {
    setParticipants(prevParticipants => {
      let newParticipants = [...prevParticipants, {...s, position: DEFAULT_POSITION, rotation: [0,0,0]}];
      const uniqueIds = Array.from(new Set(newParticipants.map(obj => obj.id)));
      newParticipants = uniqueIds.map(id => newParticipants.find(obj => obj.id === id));
      return newParticipants;
    })
  }

  const removeParticipant = id => {
    setParticipants(prevParticipants => {
      return prevParticipants.filter(participant => participant.id !== id);
    });
  };

  const initLocalParticipant = (participant, mediaStream) => {
    participant.isLocal = true;
    participant.stream = mediaStream;
    participant.position = [0,0,0];
    participant.rotation = [0,0,0];
  }

  const handleIncomingLocationData = data => {
    const parts = data.split(',')
    const remoteId = parts[0];
    const position = [parts[1], parts[2], parts[3]];
    const rotation = [parts[4], parts[5], parts[6]];
    setParticipants(prevParticipants => {
      return prevParticipants.map(participant => {
        if (participant.id === remoteId) {
          participant.position = position;
          participant.rotation = rotation;
        }
        return participant;
      });
    });
  }

  const registerParticipantEvents = (participant) => {
    participant.on('stream', addParticipant);
    participant.on('stream_inactive', removeParticipant);
    participant.on('recieve_location_data', handleIncomingLocationData);
  }

  const startMeeting = () => {
    if (stream) {
      setLoading(true);
      const participant = new HulloParticipant(stream);
      initLocalParticipant(participant, stream);
      setParticipants([participant]);
      registerParticipantEvents(participant);
      participant.initPeer().then(() => {
        setInMeeting(true);
        setLoading(false);
      })
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  const joinMeeting = (meetingCode) => {
    if (stream) {
      setLoading(true);
      const participant = new HulloParticipant(stream, meetingCode);
      initLocalParticipant(participant, stream);
      setParticipants([participant]);
      registerParticipantEvents(participant);
      participant.initPeer().then(() => {
        setInMeeting(true);
        setLoading(false);
      })
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  if (loading) {
    return <Spinner />
  } else if (inMeeting) {
    return <Meeting participants={participants} setParticipants={setParticipants} />
  } else {
    return <Landing onStart={startMeeting} onJoin={joinMeeting} onStream={mediaStream => setStream(mediaStream)} />
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<Spinner />}>
      <App />
    </Suspense>
  </StrictMode>
)
