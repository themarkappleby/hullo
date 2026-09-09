/** @jsxImportSource @emotion/react */
import { useRef, useState, useEffect } from 'react';
import styles from './styles'
import Button from '../../components/Button';
import playVideo from '../../helpers/playVideo';

const urlParams = new URLSearchParams(window.location.search);
const meetingCodeParam = urlParams.get('id');

const Landing = ({onStart, onJoin, onStream}) => {
    const [enteringCode, setEnteringCode] = useState(!!meetingCodeParam);
    const [meetingCode, setMeetingCode] = useState(meetingCodeParam || '');
    const videoRef = useRef();
    const codeInputRef = useRef();
    const pointerRef = useRef();

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: { 
                    width: 480,
                    height: 640,
                    aspectRatio: 9/16,
                    frameRate: 30,
                },
            })
            .then((stream) => {
                onStream(stream);
                videoRef.current.srcObject = stream;
                playVideo(videoRef.current);
            })
            .catch((err) => {
                console.error(err)
            });
    }, [])

    const startMeeting = () => {
        pointerRef.current.requestPointerLock();
        setTimeout(() => {
            onStart();
        }, 100);
    }

    const joinMeeting = (e) => {
        e.preventDefault();
        pointerRef.current.requestPointerLock();
        setTimeout(() => {
            onJoin(meetingCode);
        }, 100);
    }

    return (
        <div css={styles.landing}>
            <div css={styles.preview}>
                <div css={styles.videoWrapper}>
                    <video css={styles.video} ref={videoRef} muted />
                    <p>Please allow camera and microphone access</p>
                </div>
            </div>
            <main css={styles.main}>
                <div ref={pointerRef} />
                <a href="/">
                    <img css={styles.logo} src="/images/logo.svg" alt="Hullo logo" />
                </a>
                <h1>Spacial video conferencing</h1>
                <h2>In-office style collaboration for distributed teams</h2>
                <div css={styles.buttonGroup}>
                    {enteringCode ? (
                        <>
                            <form css={styles.inputGroup} onSubmit={joinMeeting}>
                                <input value={meetingCode} onChange={(e) => {
                                    if (/^\d{0,6}$/.test(e.target.value)) {
                                        setMeetingCode(e.target.value);
                                    }
                                }} maxLength={6} ref={codeInputRef} type="text" placeholder="362801" />
                                <Button type="submit" disabled={meetingCode.length !== 6}>
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