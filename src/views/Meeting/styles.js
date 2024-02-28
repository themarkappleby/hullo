import { css } from '@emotion/react'

const styles = {
    videos: css`
        position: absolute;
        top: 0;
        right: 0;
        z-index: 5;
        video {
            width: 400px;
            aspect-ratio: 16 / 9;
            background: black;
        }
    `
}

export default styles;