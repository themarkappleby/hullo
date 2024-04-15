/** @jsxImportSource @emotion/react */
import { memo, useState, useEffect } from 'react';
import styles from './styles';

const HUD = memo(function HUD({ participants, cursorLocked }) {
    const [showCursorLockTarget, setShowCursorLockTarget] = useState(false);
    const [showWToast, setShowWToast] = useState(false);
    const [showEscToast, setShowEscToast] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);

    useEffect(() => {
        let wPressed = false;
        window.addEventListener('keydown', ev => {
            if (ev.key === 'w') {
                if (!wPressed) {
                    setTimeout(() => {
                        setShowEscToast(true);
                    }, 1000);
                    setTimeout(() => {
                        setShowEscToast(false);
                    }, 5000);
                }
                setShowWToast(false);
                wPressed = true;
            }
        })
        setTimeout(() => {
            if (!wPressed) {
                setShowWToast(true);
            }
        }, 1500);
    }, [])

    useEffect(() => {
        if (cursorLocked) {
            setShowCursorLockTarget(false);
            setShowShareToast(false);
        } else {
            if (showEscToast) {
                setShowEscToast(false);
                setTimeout(() => {
                    setShowShareToast(true);
                }, 500)
            } else {
                setShowShareToast(true);
            }
            setTimeout(() => {
                setShowCursorLockTarget(true);
            }, 1200);
        }
    }, [cursorLocked])

    return (
        <div css={styles.hud} className={!cursorLocked ? 'paused' : ''}>
            <div className="cursorLockTarget" style={{display: showCursorLockTarget ? 'block' : 'none'}} />
            <div css={styles.toast} className={showWToast ? 'show' : 'hide'}>
                <div>Press</div>
                <div css={styles.key}>w</div>
                <div>to walk forward</div>
            </div>
            <div css={styles.toast} className={showEscToast ? 'show' : 'hide'}>
                <div>Press</div>
                <div css={styles.key}>esc</div>
                <div>to show your cursor</div>
            </div>
            <div css={styles.toast} className={showShareToast ? 'show' : 'hide'}>
                <div>Share URL to invite participants</div>
            </div>
        </div>
    )
});

export default HUD;