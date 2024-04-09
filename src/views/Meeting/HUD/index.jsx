/** @jsxImportSource @emotion/react */
import { memo } from 'react';
import styles from './styles';

const HUD = memo(function HUD({ participants }) {
    return (
        <div css={styles.hud}>
            {participants} participant{participants === 1 ? '' : 's'}
        </div>
    )
});

export default HUD;