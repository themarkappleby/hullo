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
  const [streams, setStreams] = useState([]);
  const [participants, setParticpants] = useState([]);
  const videosRef = useRef();
  window.s = streams;

  const handleMove = coordinates => {
    // TODO
    // console.log(coordinates)
  }

  // TODO move stream and video stuff into Meeting
  const addStream = s => {
    setStreams(prevStreams => {
      let newStreams = [...prevStreams, s];
      const uniqueIds = Array.from(new Set(newStreams.map(obj => obj.id)));
      newStreams = uniqueIds.map(id => newStreams.find(obj => obj.id === id));
      return newStreams;
    });
  }

  useEffect(() => {
      const videos = videosRef.current;
      streams.forEach(s => {
        const video = videos.querySelector(`#${s.id} video`)
        video.srcObject = s.stream;
        const isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
        if (!isPlaying) {
          video.play().catch(e => console.log(e));
        }
      })
  }, [streams])

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
    return (
      <>
        <Meeting onMove={handleMove} participants={participants} streams={streams} />
        <div ref={videosRef} className="videos">
          {streams.map(s => {
            return (
              <div id={s.id} key={s.id}>
                <video />
                <div className="videoId">{s.id}</div>
              </div>
            )
          })}
        </div>
      </>
    )
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
