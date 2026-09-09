import { css } from '@emotion/react'

const primary = '#3262d6';
const primaryActive = '#193d93';

const styles = {
    button: css`
        appearance: none;
        background: ${primary};
        border: 0;
        font-size: 1rem;
        color: white;
        border-radius: 25px;
        padding: 16px 25px;
        cursor: pointer;
        transition: all 0.1s ease-in-out;
        &:hover {
            background: ${primaryActive}
        }
        &.plain {
            color: ${primary};
            background: transparent;
            &:hover {
                color: ${primaryActive};
                background: #f5f5f5;
            }
        }
        &:disabled {
            background: #929292;
        }
    `,
}

export default styles;