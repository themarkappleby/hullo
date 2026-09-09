/** @jsxImportSource @emotion/react */
import styles from './styles';

const Button = ({disabled, children, onClick, type, plain}) => {
    if (type === 'submit') {
        return (
            <input css={styles.button} className={plain ? 'plain' : ''} type="submit" onClick={onClick} disabled={disabled ? 'disabled' : ''} value={children} />
        )
    }
    return (
        <button className={plain ? 'plain' : ''} onClick={onClick} disabled={disabled ? 'disabled' : ''} css={styles.button}>
            {children}
        </button>
    )
}

export default Button;