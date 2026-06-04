document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('lang-toggle');
  // All English and Arabic elements
  const enElements = document.querySelectorAll('#h1-en, #h2-en, #p-en, .btn-en, #footer-text-en-main, #footer-text-en-copy, .home-en, #progress-en, #letter-en, .gallery-title-en, .caption-en, .intro-en, .learn-en, .disclaimer-en, .video-title-en, .replay-en, .h3-en, .p-en, .coming-soon-en, .h2-en, .warning-en, .card-name-en');
  const arElements = document.querySelectorAll('#h1-ar, #h2-ar, #p-ar, .btn-ar, #footer-text-ar-main, #footer-text-ar-copy, .home-ar, #progress-ar, #letter-ar, .gallery-title-ar, .caption-ar, .intro-ar, .learn-ar, .disclaimer-ar, .video-title-ar, .replay-ar, .h3-ar, .p-ar, .coming-soon-ar, .h2-ar, .warning-ar, .card-name-ar');
  let isArabic = false;

  const updateOverlayText = () => {
    const overlayElements = document.querySelectorAll('[data-overlay-en][data-overlay-ar]');
    overlayElements.forEach(el => {
      const newText = isArabic ? el.getAttribute('data-overlay-ar') : el.getAttribute('data-overlay-en');
      if (newText) {
        el.setAttribute('data-overlay', newText);
      }
    });
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isArabic = !isArabic;
      document.documentElement.lang = isArabic ? 'ar' : 'en';
      document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
      enElements.forEach(el => el.classList.toggle('hidden', isArabic));
      arElements.forEach(el => el.classList.toggle('hidden', !isArabic));
      toggleBtn.textContent = isArabic ? 'العربية | English' : 'English | العربية';
      updateOverlayText();
    });
  }

  updateOverlayText();

  // YouTube video overlay control
  const overlay = document.getElementById('video-overlay');
  const replayBtn = document.getElementById('replay-btn');
  const videoIframe = document.getElementById('edu-video');
  
  if (overlay && replayBtn && videoIframe) {
    // Show overlay after 3 minutes (video duration approximation)
    let videoTimeout;
    
    const showOverlay = () => {
      overlay.classList.remove('hidden');
    };
    
    const hideOverlay = () => {
      overlay.classList.add('hidden');
    };
    
    // Show overlay after approximately video duration (adjust time as needed)
    videoIframe.addEventListener('load', () => {
      videoTimeout = setTimeout(showOverlay, 133000); // 2 minutes 13 seconds
    });
    
    replayBtn.addEventListener('click', () => {
      hideOverlay();
      // Reload iframe to restart video
      const src = videoIframe.src;
      videoIframe.src = '';
      videoIframe.src = src;
      clearTimeout(videoTimeout);
      videoTimeout = setTimeout(showOverlay, 133000);
    });
  }

  // Main video replay overlay control
  const mainVideo = document.getElementById('main-video');
  const replayOverlay = document.getElementById('video-replay-overlay');
  const videoReplayBtn = document.getElementById('video-replay-btn');
  
  if (mainVideo && replayOverlay && videoReplayBtn) {
    mainVideo.addEventListener('ended', () => {
      replayOverlay.classList.remove('hidden');
    });
    
    videoReplayBtn.addEventListener('click', () => {
      replayOverlay.classList.add('hidden');
      mainVideo.currentTime = 0;
      mainVideo.play();
    });
  }

  // Video gallery overlay controls (for speak.html)
  const videoContainers = document.querySelectorAll('.video-container');
  
  videoContainers.forEach(container => {
    const video = container.querySelector('video');
    const overlay = container.querySelector('.video-overlay');
    const initialPlayBtn = container.querySelector('.initial-play-btn');
    const warningOverlay = container.querySelector('.warning-overlay');
    
    // Handle warning overlay (viewer discretion)
    if (warningOverlay) {
      warningOverlay.addEventListener('click', () => {
        warningOverlay.classList.add('hidden');
        if (initialPlayBtn) {
          initialPlayBtn.classList.add('hidden');
        }
        if (video) {
          video.play().catch(() => {});
        }
      });
    }
    
    if (video) {
      // Set up initial play button if it exists
      if (initialPlayBtn) {
        // Hide initial play button and play video when clicked
        initialPlayBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          initialPlayBtn.classList.add('hidden');
          video.play().catch(() => {});
        });
        
        // Hide initial play button when video starts playing
        video.addEventListener('play', () => {
          initialPlayBtn.classList.add('hidden');
        });
      }

      // Allow clicking on the video itself to start playback
      video.addEventListener('click', () => {
        if (video.paused) {
          video.play().catch(() => {});
        }
      });
      
      // Show overlay with replay button when video ends
      if (overlay) {
        video.addEventListener('ended', () => {
          overlay.classList.remove('hidden');
        });
        
        // When overlay is clicked, hide it and replay video
        overlay.addEventListener('click', () => {
          overlay.classList.add('hidden');
          video.currentTime = 0;
          video.play().catch(() => {});
        });
      }
    }
  });
});
