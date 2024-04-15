import { css } from '@emotion/react'

const styles = {
    hud: css`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        overflow: hidden;
        &.paused {
            background: rgba(0,0,0,0.4);
            &:before {
                display: block;
                content: "Click to resume";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 22px;
                color: white;
                text-shadow: 1px 1px 3px rgba(0,0,0,0.4);
                pointer-events: none;
            }
        }
        .cursorLockTarget {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    `,
    toast: css`
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 22px;
        background: white;
        box-shadow: 5px 5px 20px rgba(0,0,0,0.5);
        height: 64px;
        padding: 0 25px;
        border-radius: 25px;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: all 0.2s ease-in-out;
        bottom: -100px;
        &.show {
            bottom: 50px;
        }
    `,
    key: css`
        padding: 10px;
        border: 1px solid black;
        border-radius: 8px;
        font-family: monospace;
    `,
}

export default styles;