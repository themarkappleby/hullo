/** @jsxImportSource @emotion/react */
import styles from './styles';

const HUD = ({ participants }) => {
    return (
        <div css={styles.hud}>
            {participants} participant{participants === 1 ? '' : 's'}
        </div>
    )
}

export default HUD;