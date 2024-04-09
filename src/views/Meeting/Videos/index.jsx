/** @jsxImportSource @emotion/react */
import { useEffect, useRef, memo } from 'react';
import styles from './styles';
import playVideo from '../../../helpers/playVideo';

const Videos = memo(function ({streams = []}) {
    const videosRef = useRef();

    useEffect(() => {
        const videos = videosRef.current;
        streams.forEach(s => {
            const video = videos.querySelector(`#${s.id} video`)
            video.srcObject = s.stream;
            playVideo(video);
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
}, function (prevProps, nextProps) {
  const prevStreamIds = prevProps?.streams?.map(s => s.id)?.toString();
  const nextStreamIds = nextProps?.streams?.map(s => s.id)?.toString();
  return prevStreamIds === nextStreamIds;
});

export default Videos;