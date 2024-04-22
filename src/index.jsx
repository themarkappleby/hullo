import { StrictMode, Suspense, useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Landing from './views/Landing';
import Meeting from './views/Meeting';
import Spinner from './components/Spinner';
import setQueryParam from './helpers/setQueryParam';
import Participant from './participant';

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

  const initLocalParticipant = (participant, stream) => {
    participant.isLocal = true;
    participant.stream = stream;
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

  const startMeeting = () => {
    if (stream) {
      setLoading(true);
      const participant = new Participant(stream);
      initLocalParticipant(participant, stream);
      setParticipants([...participants, participant]);
      participant.initPeer().then(() => {
        setQueryParam({'id': participant.id.replace('hullo-', '')})
        setInMeeting(true);
        setLoading(false);
      })
      participant.on('stream', addParticipant);
      participant.on('stream_inactive', removeParticipant);
      participant.on('recieve_location_data', handleIncomingLocationData);
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  const joinMeeting = (meetingCode) => {
    if (stream) {
      const participant = new Participant(stream);
      initLocalParticipant(participant, stream);
      setParticipants([...participants, participant]);
      participant.initPeer().then(() => {
        participant.connect(`hullo-${meetingCode}`)
        setQueryParam({'id': participant.id.replace('hullo-', '')})
      });
      participant.on('stream', addParticipant);
      participant.on('stream_inactive', removeParticipant);
      participant.on('recieve_location_data', handleIncomingLocationData);
      setInMeeting(true);
    } else {
      alert(PERMISSIONS_MSG);
    }
  }

  if (loading) {
    return <Spinner />
  } else if (inMeeting) {
    return <Meeting participants={participants} setParticipants={setParticipants} />
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
