function playVideo (video) {
    const isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
    if (!isPlaying) {
      video.play().catch(e => console.log(e));
    }
}

export default playVideo;