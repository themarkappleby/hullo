/** @jsxImportSource @emotion/react */
import { useRef, useState, useEffect } from 'react';
import styles from './styles'
import Button from '../../components/Button';

const urlParams = new URLSearchParams(window.location.search);
const meetingCodeParam = urlParams.get('meeting-code');

const Landing = ({onStart, onJoin, onStream}) => {
    const [enteringCode, setEnteringCode] = useState(!!meetingCodeParam);
    const [meetingCode, setMeetingCode] = useState(meetingCodeParam || '');
    const videoRef = useRef();
    const codeInputRef = useRef();

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({video: { width: 1920, height: 1080 }, audio: true})
            .then((stream) => {
                onStream(stream);
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch((err) => {
                console.error(err)
            });
    }, [])

    const startMeeting = () => {
        onStart();
    }

    const joinMeeting = (e) => {
        e.preventDefault();
        onJoin(meetingCode);
    }

    return (
        <div css={styles.landing}>
            <div css={styles.preview}>
                <div css={styles.videoWrapper}>
                    <video css={styles.video} ref={videoRef} />
                    <p>Please allow camera and microphone access</p>
                </div>
                <div css={styles.notice}>
                    👋 Heads up! Once you're in a meeting, you will no longer be able to see your camera
                </div>
            </div>
            <main css={styles.main}>
                <img css={styles.logo} src="/images/logo.svg" alt="Hullo logo" />
                <h1>Spacial video conferencing</h1>
                <h2>In-office style collaboration for distributed teams</h2>
                <div css={styles.buttonGroup}>
                    {enteringCode ? (
                        <>
                            <form css={styles.inputGroup} onSubmit={joinMeeting}>
                                <input value={meetingCode} onChange={(e) => {
                                    if (e.target.value.length <= 4) {
                                        setMeetingCode(e.target.value);
                                    }
                                }} maxLength={4} ref={codeInputRef} type="text" placeholder="3628" />
                                <Button type="submit" disabled={meetingCode.length !== 4}>
                                    Join Meeting
                                </Button>
                            </form>
                            <Button plain onClick={() => {
                                setEnteringCode(false)
                            }}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={startMeeting}>
                                Start meeting
                            </Button>
                            <Button plain onClick={() => {
                                setEnteringCode(true)
                                setTimeout(() => {
                                    codeInputRef.current.focus();
                                }, 0)
                            }}>
                                Enter meeting code
                            </Button>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Landing;