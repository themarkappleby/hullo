import { css, keyframes } from '@emotion/react'

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`

const styles = {
    spinner: css`
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 7px solid #3262d6;
        border-right-color: transparent;
        border-bottom-color: #203a78;
        border-top-color: #a9c0f6;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -25px;
        margin-top: -25px;
        animation: ${spin} 0.7s ease-in-out infinite;
    `
}

export default styles;