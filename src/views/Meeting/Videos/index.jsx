/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from 'react';
import styles from './styles';

const Videos = ({streams = []}) => {
    const videosRef = useRef();

    useEffect(() => {
        const videos = videosRef.current;
        streams.forEach(s => {
            const video = videos.querySelector(`#${s.id} video`)
            video.srcObject = s.stream;
            const isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
            if (!isPlaying) {
                video.play().catch(e => console.log(e));
            }
        })
    }, [streams])

    return (
        <div css={styles.videos} ref={videosRef}>
          {streams.map(s => {
            return (
              <div id={s.id} key={s.id}>
                <video />
                <div css={styles.videoId}>{s.id}</div>
              </div>
            )
          })}
        </div>
    )
}

export default Videos;