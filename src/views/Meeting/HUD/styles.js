import { css } from '@emotion/react'

const styles = {
    hud: css`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        &.focused {
            background: transparent;
        }
    `,
    prompt: css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 18px;
        color: white;
        pointer-events: none;
        .focused & {
            display: none;
        }
    `,
    participants: css`
        background: white;
        position: absolute;
        bottom: 16px;
        left: 16px;
        padding: 16px;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        font-size: 1rem;
        gap: 16px;
    `,
    key: css`
        color: white;
        padding: 10px;
        border: 1px solid white;
        border-radius: 8px;
        font-family: monospace;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
        box-shadow: 0 0 3px rgba(0,0,0,0.2);
    `,
    esc: css`
        position: absolute;
        top: 16px;
        left: 16px;
        gap: 8px;
        align-items: center;
        color: white;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
        display: none;
        .focused & {
            display: flex;
        }
    `,
    controls: css`
        position: absolute;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        flex-direction: row;
        color: white;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
        gap: 20px;
        display: none;
        .focused & {
            display: flex;
        }
        & > div {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    `
}

export default styles;