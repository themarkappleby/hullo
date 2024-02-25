import { css } from '@emotion/react'

const primary = '#3262d6';
const primaryActive = '#193d93';

const styles = {
    preview: css`
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 250px;
        z-index: 1;
        width: 600px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
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
    landing: css`
        height: 100vh;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        font-family: helvetica, sans-serif;
    `,
    main: css`
        padding-left: 300px;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        h1 {
            font-size: 4rem;
            margin: 0;
            max-width: 800px;
        }
        h2 {
            font-size: 1.5rem;
            font-weight: 200;
            margin-bottom: 40px;
            color: #5f6368;
        }
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
    button: css`
        appearance: none;
        background: ${primary};
        border: 0;
        font-size: 1rem;
        color: white;
        border-radius: 50px;
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
    `,
    message: css`
        font-size: 0.85rem;
        color: white;
        background: black;
        padding: 14px 24px;
        border-radius: 8px;
        max-width: 190px;
        line-height: 1.5;
        position: absolute;
        bottom: 30px;
        right: 30px;
        opacity: 0;
        transition: all 0.5s ease-in-out;
        &.show {
            opacity: 1;
        }
    `,
    toast: css`
        background: black;
        user-select: none;
        color: white;
        border-radius: 8px;
        padding: 14px 24px;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        transition: all 0.4s cubic-bezier(.47,1.64,.41,.8);
        bottom: -100px;
        &.show {
            bottom: 30px;
        }
    `
}

export default styles;