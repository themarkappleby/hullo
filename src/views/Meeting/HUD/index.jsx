/** @jsxImportSource @emotion/react */
import { memo, useState } from 'react';
import styles from './styles';

const HUD = memo(function HUD({ participants }) {
    const [focused, setFocused] = useState(false);

    return (
        <div css={styles.hud} className={focused ? 'focused' : ''} onClick={() => {
            setFocused(true)
        }}>
            <div css={styles.esc}>
                <div css={styles.key}>esc</div>
                <div>to exit</div>
            </div>
            <div css={styles.invite}>
                Share URL to invite others
            </div>
            <div css={styles.prompt}>
                Click to focus
            </div>
            <div css={styles.participants}>
                {participants} participant{participants === 1 ? '' : 's'}
            </div>
            <div css={styles.controls}>
                <div>
                    <div css={styles.key}>w</div>
                    <div>forward</div>
                </div>
                <div>
                    <div css={styles.key}>s</div>
                    <div>backward</div>
                </div>
            </div>
        </div>
    )
});

export default HUD;