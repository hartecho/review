<template>
  <div class="video-container">
    <video
      ref="backgroundVideo"
      autoplay
      muted
      loop
      class="background-video"
      playbackRate="1"
    >
      <source src="/BGVid.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div class="overlay"></div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
  
  <style scoped>
.video-container {
  position: relative;
  width: 100%;
  height: 100%; /* Adjust as needed */
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -1;
  transform: translate(-50%, -50%);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Adjust the color and opacity as needed */
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  color: white; /* Adjust text color as needed */
  height: 100%;
}
</style>
  