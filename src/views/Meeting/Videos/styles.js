import { css } from '@emotion/react'

const styles = {
    videos: css`
        position: absolute;
        top: 0;
        right: 0;
        width: 200px;
        background: grey;
        display: none;
        & > div {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 9;
            video {
                background: black;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
            }
        }
    `,
    videoId: css`
        position: absolute;
        bottom: 0;
        left: 0;
        background: #3262d6;
        color: white;
        font-size: 10px;
        padding: 2px;
        z-index: 2;
    `
}

export default styles;
