import { css } from '@emotion/react'

const styles = {
    video: css`
        position: absolute;
        top: 0;
        right: 0;
        width: 992px;
        height: 558px;
        display: none;
        z-index: 1;
    `,
    landing: css`
        height: 100vh;
        background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
        position: relative;
        overflow: hidden;
        input {
            font-size: 4rem;
            text-align: center;
            width: 170px;
            border-radius: 4px;
            border: 1px solid #000;
            appearance: none;
        }
    `,
    inner: css`
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        flex-direction: column;
        background: #1A1A1A;
        height: calc(100vh - 20px);
        overflow: hidden;
        border-radius: 8px;
        margin: 10px;
    `,
    invite: css`
        display: inline-block;
        outline: 0;
        border: 0;
        cursor: pointer;
        background: #996cf2;
        color: white;
        border-radius: 8px;
        margin-top: 50px;
        padding: 14px 24px 16px;
        font-size: 1.5rem;
        font-weight: 700;
        user-select: none;
        line-height: 1;
        transition: all 0.4s cubic-bezier(.47,1.64,.41,.8);
        :hover{
            transform: scale(1.05);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
        }
        :active{
            transform: scale(1);
            box-shadow: none;
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
    logo: css`
        width: 300px;
        user-select: none;
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