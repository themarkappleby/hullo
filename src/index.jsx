import { StrictMode, Suspense, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Landing from './views/Landing';
import Meeting from './views/Meeting';
import Spinner from './components/Spinner';

let peer;
let conn;

const App = () => {
  const [inMeeting, setInMeeting] = useState(false);

  const startMeeting = () => {
    setInMeeting(true);
  }

  const joinMeeting = (meetingId) => {
    setInMeeting(true);
  }

  if (inMeeting) {
    return <Meeting />
  } else {
    return <Landing onStart={startMeeting} onJoin={joinMeeting} />
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<Spinner />}>
      <App />
    </Suspense>
  </StrictMode>
)
