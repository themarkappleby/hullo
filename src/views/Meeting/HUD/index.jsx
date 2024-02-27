/** @jsxImportSource @emotion/react */
import Button from '../../../components/Button';
import styles from './styles';

const HUD = ({ participants = [] }) => {
    const meetingCode = '1234'
    return (
        <div css={styles.hud}>
            {participants.length} participant{participants.length === 1 ? '' : 's'}
        </div>
    )
}

export default HUD;