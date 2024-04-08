function playVideo (video) {
    const isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
    if (!isPlaying) {
      video.play().catch(e => console.log(e));
      video.muted = true; // TODO remove this later, this is to prevent audio feedback during dev
    }
}

export default playVideo;