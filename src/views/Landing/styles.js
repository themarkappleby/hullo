import { css } from '@emotion/react'

const primary = '#3262d6';
const primaryActive = '#193d93';

const styles = {
    landing: css`
        height: 100vh;
        position: relative;
        display: flex;
        flex-direction: row;
        font-family: helvetica, sans-serif;
        align-items: center;
        justify-content: center;
        gap: 150px;
        max-width: 1400px;
        padding: 0 50px;
        margin: 0 auto;
        @media screen and (max-width: 1080px) {
            flex-direction: column-reverse;
            gap: 50px;
            height: auto;
            max-width: 600px;
            padding: 40px 50px;
        }
        @media screen and (max-width: 500px) {
            padding: 40px 20px;
        }
    `,
    preview: css`
        max-width: 600px;
        min-width: 300px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
    `,
    main: css`
        flex-direction: column;
        flex: 1;
        h1 {
            font-size: 4rem;
            margin: 0;
            max-width: 800px;
            @media screen and (max-width: 500px) {
                font-size: 2.5rem;
            }
        }
        h2 {
            font-size: 1.5rem;
            font-weight: 200;
            margin-bottom: 40px;
            color: #5f6368;
            @media screen and (max-width: 500px) {
                font-size: 1.2rem;
            }
        }
    `,
    videoWrapper: css`
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        background: black;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 0 100px rgba(0, 0, 0, 0.2);
        p {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            width: 100%;
            text-align: center;
            color: white;
            font-size: 14px;
            opacity: 0.4;
            z-index: 1;
        }
    `,
    video: css`
        width: 100%;
        aspect-ratio: 16 / 9;
        position: relative;
        z-index: 2;
    `,
    notice: css`
        border: 1px solid #90e0e0;
        background-color: rgba(144,224,224,0.1);
        border-radius: 14px;
        font-size: 14px;
        padding: 5px 10px;
        text-align: center;
        line-height: 1.3;
    `,
    logo: css`
        margin-bottom: 20px;
        max-width: 120px;
    `,
    buttonGroup: css`
        display: flex;
        flex-direction: row;
        gap: 12px;
    `,
    inputGroup: css`
        position: relative;
        input[type="text"] {
            font-size: 2rem;
            font-weight: 400;
            height: 100%;
            padding-left: 20px;
            width: 230px;
            margin: 0;
            border-radius: 25px;
            appearance: none;
            border: 1px solid #c7c7c7;
        }
        input[type="submit"] {
            position: absolute;
            right: 3px;
            top: 3px;
            padding-top: 15px;
            padding-bottom: 15px;
        }
    `
}

export default styles;