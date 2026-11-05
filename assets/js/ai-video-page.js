
(() => {
  const grid = document.getElementById('aiVideoGrid');
  if (!grid) return;

  const items = window.AI_VIDEO_PORTFOLIO || [];

  // Extract YouTube video ID from different URL formats.
  const getYouTubeId = (raw) => {
    try {
      const url = new URL(raw);
      const host = url.hostname.replace(/^www\./, '');

      if (host === 'youtu.be') {
        return url.pathname.split('/').filter(Boolean)[0] || null;
      }

      if (host.endsWith('youtube.com')) {
        const parts = url.pathname.split('/').filter(Boolean);

        if (url.pathname === '/watch') {
          return url.searchParams.get('v');
        }

        if (['shorts', 'embed', 'live'].includes(parts[0])) {
          return parts[1] || null;
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  // Add popup and gallery styling.
  if (!document.getElementById('ai-video-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'ai-video-modal-styles';

    style.textContent = `
      .ai-video-modal {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 30px;
        background: rgba(0, 0, 0, .90);
        backdrop-filter: blur(7px);
      }

      .ai-video-modal.is-open {
        display: flex;
      }

      .ai-video-modal-dialog {
        position: relative;
        width: min(1100px, 92vw);
        margin: auto;
      }

      .ai-video-modal-stage {
        width: 100%;
        aspect-ratio: 16 / 9;
        background: #000;
        border: 1px solid rgba(255,255,255,.16);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 25px 90px rgba(0,0,0,.65);
      }

      .ai-video-modal-stage iframe {
        display: block;
        width: 100%;
        height: 100%;
        border: 0;
      }

      .ai-video-modal-close {
        position: absolute;
        top: -48px;
        right: 0;
        width: 40px;
        height: 40px;
        border: 1px solid rgba(255,255,255,.35);
        border-radius: 50%;
        background: rgba(15,20,28,.9);
        color: #fff;
        font-size: 28px;
        line-height: 1;
        cursor: pointer;
        display: grid;
        place-items: center;
      }

      .ai-video-modal-close:hover {
        background: #fff;
        color: #111;
      }

      body.ai-video-modal-open {
        overflow: hidden;
      }

      .video-gallery-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }

      .ai-gallery-card {
        display: block;
        width: 100%;
        padding: 0;
        border: 1px solid rgba(86,165,210,.24);
        border-radius: 15px;
        overflow: hidden;
        background: #080e18;
        cursor: pointer;
        transition: transform .2s, border-color .2s, box-shadow .2s;
      }

      .ai-gallery-card:hover {
        transform: translateY(-4px);
        border-color: rgba(43,185,245,.65);
        box-shadow: 0 14px 36px rgba(0,120,190,.16);
      }

      .ai-gallery-thumb {
        display: block;
        position: relative;
        aspect-ratio: 16 / 9;
        background: #080e18;
      }

      .ai-gallery-thumb img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .ai-gallery-play-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        padding-left: 4px;
        border: 1px solid rgba(255,255,255,.75);
        border-radius: 50%;
        background: rgba(0,0,0,.65);
        color: white;
        font-size: 20px;
      }

      .ai-gallery-card:focus-visible,
      .ai-video-modal-close:focus-visible {
        outline: 3px solid #36baf2;
        outline-offset: 3px;
      }

      .ai-gallery-empty {
        aspect-ratio: 16 / 9;
        display: grid;
        place-content: center;
        gap: 5px;
        text-align: center;
        border: 1px dashed rgba(86,165,210,.25);
        border-radius: 15px;
        color: #8ca8bd;
        background: rgba(13,28,44,.35);
      }

      .ai-gallery-empty span {
        font-size: 28px;
      }

      .ai-gallery-empty small {
        font-size: 10px;
        letter-spacing: .15em;
      }

      @media(max-width: 850px) {
        .video-gallery-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media(max-width: 560px) {
        .video-gallery-grid {
          grid-template-columns: 1fr;
          gap: 13px;
        }

        .ai-video-modal {
          padding: 14px;
        }

        .ai-video-modal-dialog {
          width: 100%;
        }

        .ai-video-modal-close {
          top: -48px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Create one popup player.
  const modal = document.createElement('div');
  modal.className = 'ai-video-modal';
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML = `
    <div class="ai-video-modal-dialog"
         role="dialog"
         aria-modal="true"
         aria-label="Video player">

      <button class="ai-video-modal-close"
              type="button"
              aria-label="Close video">×</button>

      <div class="ai-video-modal-stage"></div>
    </div>
  `;

  document.body.appendChild(modal);

  const stage = modal.querySelector('.ai-video-modal-stage');
  const closeButton = modal.querySelector('.ai-video-modal-close');

  let previouslyFocused = null;

  // Stop video and close popup.
  const stopAndClose = () => {
    // Removing iframe immediately stops video and audio.
    stage.replaceChildren();

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    document.body.classList.remove('ai-video-modal-open');

    if (
      previouslyFocused &&
      document.contains(previouslyFocused)
    ) {
      previouslyFocused.focus();
    }
  };

  // Play selected video in the large popup.
  const playInModal = (videoId, trigger) => {

    // Stop previous video before starting another.
    stage.replaceChildren();

    const iframe = document.createElement('iframe');

    iframe.src =
      `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&modestbranding=1`;

    iframe.title = 'AI video portfolio player';

    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

    iframe.allowFullscreen = true;

    iframe.referrerPolicy =
      'strict-origin-when-cross-origin';

    stage.appendChild(iframe);

    previouslyFocused = trigger || document.activeElement;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    document.body.classList.add('ai-video-modal-open');

    closeButton.focus();
  };

  // Generate video gallery.
  grid.innerHTML = items.map((item, index) => {

    const videoId = getYouTubeId(item.url || '');

    if (!videoId) {
      return `
        <div class="ai-gallery-empty">
          <span>＋</span>
          <small>VIDEO SLOT ${String(index + 1).padStart(2, '0')}</small>
        </div>
      `;
    }

    const safeId = encodeURIComponent(videoId);

    return `
      <button
        class="ai-gallery-card"
        type="button"
        data-video-id="${safeId}"
        aria-label="Play AI video ${index + 1}">

        <span class="ai-gallery-thumb">

          <img
            src="https://i.ytimg.com/vi/${safeId}/hqdefault.jpg"
            alt=""
            loading="lazy">

          <span class="ai-gallery-play-icon" aria-hidden="true">
            ▶
          </span>

        </span>
      </button>
    `;

  }).join('');

  // Handle gallery clicks.
  grid.addEventListener('click', (event) => {

    const button = event.target.closest('[data-video-id]');

    if (!button) return;

    playInModal(button.dataset.videoId, button);
  });

  // Close button.
  closeButton.addEventListener('click', stopAndClose);

  // Close when clicking outside the player.
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      stopAndClose();
    }
  });

  // Close with Escape key.
  document.addEventListener('keydown', (event) => {

    if (
      event.key === 'Escape' &&
      modal.classList.contains('is-open')
    ) {
      stopAndClose();
    }

  });

})();
