import { useEffect, useRef, useState } from 'react';
import ViewCounter from './ViewCounter';

const imageModules = import.meta.glob('../assets/media/images/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
});

const imagePreviewModules = import.meta.glob('../assets/media/images-preview/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
});

const videoModules = import.meta.glob('../assets/media/videos-web/*.{mp4,webm,m4v}', {
  eager: true,
  import: 'default',
});

const videoPreviewModules = import.meta.glob('../assets/media/videos-preview/*.{mp4,webm,m4v}', {
  eager: true,
  import: 'default',
});

const videoSources = Object.entries(videoModules)
  .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
  .map(([, source]) => source);

const videoPreviewSources = Object.entries(videoPreviewModules)
  .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
  .map(([, source]) => source);

const videoAccents = ['gallery-card--mist', 'gallery-card--shadow', 'gallery-card--forest', 'gallery-card--ember', 'gallery-card--warm'];
const imageAccents = ['gallery-card--warm', 'gallery-card--mist', 'gallery-card--forest', 'gallery-card--shadow', 'gallery-card--ember'];

const getMediaFileName = (path) => path.split('/').pop() ?? path;
const getMediaStem = (path) => getMediaFileName(path).replace(/\.[^.]+$/, '');
const formatMediaTitle = (prefix, index) => `${prefix}-${String(index + 1).padStart(2, '0')}`;

const imagePreviewMap = new Map(
  Object.entries(imagePreviewModules).map(([path, source]) => [getMediaStem(path), source]),
);

const imageItems = Object.entries(imageModules)
  .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
  .filter(([path]) => getMediaStem(path).toLowerCase() !== 'aboutme')
  .map(([path, image], index) => {
    const stem = getMediaStem(path);

    return {
      title: formatMediaTitle('photo', index),
      meta: 'photo material',
      description: 'Image preview in the pop-up viewer.',
      accent: imageAccents[index % imageAccents.length],
      image,
      previewImage: imagePreviewMap.get(stem) ?? image,
    };
  });

const getVideoMimeType = (source) => {
  if (source.endsWith('.mp4') || source.endsWith('.m4v')) {
    return 'video/mp4';
  }

  if (source.endsWith('.webm')) {
    return 'video/webm';
  }

  return undefined;
};

const videoItems = videoSources.map((video, index) => ({
  title: `video-${String(index + 1).padStart(2, '0')}`,
  meta: 'video material',
  description: 'Video preview with sound enabled in the pop-up viewer.',
  accent: videoAccents[index % videoAccents.length],
  video,
  previewVideo: videoPreviewSources[index] ?? video,
  mimeType: getVideoMimeType(video),
}));

const mediaItems = [...videoItems, ...imageItems];

function ProjectList() {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [windowAudioVideoIndex, setWindowAudioVideoIndex] = useState(null);
  const [motionWindow, setMotionWindow] = useState(null);
  const [coverflowHoverZones, setCoverflowHoverZones] = useState({});
  const [activePage, setActivePage] = useState('home');
  const [activeWindow, setActiveWindow] = useState(null);
  const [showCopyPrompt, setShowCopyPrompt] = useState(false);
  const [copyState, setCopyState] = useState('idle');
  const [previewItem, setPreviewItem] = useState(null);
  const [previewControlsVisible, setPreviewControlsVisible] = useState(false);
  const touchStateRef = useRef(null);
  const closeTimerRef = useRef(null);
  const previewOpenedAtRef = useRef(0);
  const windowRefs = useRef({});

  const getOffset = (index, activeItem, items) => {
    const itemCount = items.length;
    let offset = index - activeItem;

    if (offset > itemCount / 2) {
      offset -= itemCount;
    } else if (offset < -(itemCount / 2)) {
      offset += itemCount;
    }

    return offset;
  };

  const getCardStyle = (offset) => {
    const distance = Math.min(Math.abs(offset), 3.2);
    const focus = Math.max(0, 1 - (distance / 3.2));
    const easedFocus = focus * focus * (3 - (2 * focus));
    const direction = Math.sign(offset);
    const cylinderAngle = Math.min(distance, 2.35) * 0.6;
    const cylindricalArc = Math.sin(cylinderAngle);
    const spread = 172 + (cylindricalArc * 188);
    const depth = -20 - ((1 - Math.cos(cylinderAngle)) * 420);

    return {
      '--dock-scale-x': (0.68 + (easedFocus * 0.74)).toFixed(3),
      '--dock-scale-y': (0.76 + (easedFocus * 0.48)).toFixed(3),
      '--dock-rotate-y': `${(-direction * (12 + (cylindricalArc * 44))).toFixed(3)}deg`,
      '--dock-lift': `${(10 + (easedFocus * 34)).toFixed(3)}px`,
      '--dock-blur': `${((1 - easedFocus) * 1.6).toFixed(3)}px`,
      '--dock-opacity': (0.34 + (easedFocus * 0.66)).toFixed(3),
      '--dock-shift-x': `${(offset * spread).toFixed(3)}px`,
      '--dock-depth': `${depth.toFixed(3)}px`,
      '--dock-reflection': (0.04 + (easedFocus * 0.12)).toFixed(3),
      zIndex: Math.round(100 - (distance * 10)),
    };
  };

  const handleKeyDown = (event, items, setActiveItem) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    setActiveItem((current) => (current + direction + items.length) % items.length);
  };

  const handleEmailClick = () => {
    setShowCopyPrompt(true);
    setCopyState('idle');
  };

  const isMobileViewport = () => window.matchMedia('(max-width: 768px)').matches;

  const activateMobileWindowAudio = (index) => {
    const videoWindow = windowRefs.current.media;
    const visibleVideos = videoWindow?.querySelectorAll?.('.gallery-card video');

    visibleVideos?.forEach((video) => {
      if (!(video instanceof HTMLVideoElement)) {
        return;
      }

      const itemIndex = Number(video.dataset.index);
      const shouldEnableAudio = itemIndex === index;

      video.muted = !shouldEnableAudio;
      video.volume = shouldEnableAudio ? 1 : 0;

      if (!shouldEnableAudio) {
        return;
      }

      video.pause();
      const playAttempt = video.play();
      if (playAttempt?.catch) {
        playAttempt.catch(() => {});
      }
    });
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('kristers.dzenis@icloud.com');
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  const handleCoverflowTouchStart = (event, windowId) => {
    const touch = event.touches?.[0];
    if (!touch) {
      return;
    }

    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
    };
    setActiveWindow(windowId);
  };

  const handleCoverflowTouchEnd = (event, items, setActiveItem) => {
    if (!touchStateRef.current) {
      return;
    }

    const touch = event.changedTouches?.[0];
    if (!touch) {
      touchStateRef.current = null;
      return;
    }

    const deltaX = touch.clientX - touchStateRef.current.startX;
    const deltaY = touch.clientY - touchStateRef.current.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    touchStateRef.current = null;

    if (absX < 36 || absX <= absY) {
      return;
    }

    const direction = deltaX < 0 ? 1 : -1;
    setActiveItem((current) => (current + direction + items.length) % items.length);
  };

  const getCoverflowZone = (relativeX, width) => {
    const centerBand = width * 0.2;
    const centerStart = (width / 2) - (centerBand / 2);
    const centerEnd = centerStart + centerBand;

    if (relativeX >= centerStart && relativeX <= centerEnd) {
      return 'center';
    }

    return relativeX > width / 2 ? 'right' : 'left';
  };

  const handleCoverflowClick = (event, items, activeItem, setActiveItem, windowId) => {
    if (event.target instanceof Element && event.target.closest('.gallery-card')) {
      return;
    }

    const coverflow = event.currentTarget;
    const rect = coverflow.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const zone = getCoverflowZone(relativeX, rect.width);

    setActiveWindow(windowId);

    if (zone === 'center') {
      openPreview(items, activeItem, windowId);
      return;
    }

    setWindowAudioVideoIndex(null);

    const direction = zone === 'right' ? 1 : -1;
    setActiveItem((current) => (current + direction + items.length) % items.length);
  };

  const handleCoverflowPointerMove = (event, windowId) => {
    if (isMobileViewport()) {
      return;
    }

    const coverflow = event.currentTarget;
    const rect = coverflow.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const zone = getCoverflowZone(relativeX, rect.width);

    setCoverflowHoverZones((current) => (
      current[windowId] === zone ? current : { ...current, [windowId]: zone }
    ));
  };

  const clearCoverflowPointerZone = (windowId) => {
    setCoverflowHoverZones((current) => {
      if (!current[windowId]) {
        return current;
      }

      const next = { ...current };
      delete next[windowId];
      return next;
    });
  };

  const getPreviewMotionVars = (windowId) => {
    const originElement = windowRefs.current[windowId];
    const elementRect = originElement?.getBoundingClientRect?.();

    if (!elementRect) {
      return {
        startX: 0,
        startY: Math.round(window.innerHeight * 0.36),
      };
    }

    const originX = elementRect.left + (elementRect.width / 2);
    const originY = elementRect.top + (elementRect.height / 2);

    return {
      startX: Math.round(originX - (window.innerWidth / 2)),
      startY: Math.round(originY - (window.innerHeight / 2)),
    };
  };

  const openPreview = (items, activeItem, windowId) => {
    const item = items[activeItem];
    if (!item) {
      return;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    const motionVars = getPreviewMotionVars(windowId);
    const isVideo = Boolean(item.video);
    previewOpenedAtRef.current = window.performance.now();

    setPreviewItem({
      title: item.title,
      description: item.description ?? item.meta,
      mediaSrc: isVideo ? item.video : item.image,
      mimeType: isVideo ? item.mimeType : undefined,
      isVideo,
      startX: motionVars.startX,
      startY: motionVars.startY,
      isClosing: false,
    });
  };

  const requestClosePreview = () => {
    if (!previewItem || previewItem.isClosing) {
      return;
    }

    setPreviewItem((current) => (current ? { ...current, isClosing: true } : current));
    closeTimerRef.current = window.setTimeout(() => {
      setPreviewItem(null);
      closeTimerRef.current = null;
    }, 560);
  };

  useEffect(() => {
    const isTypingTarget = (target) => (
      target instanceof HTMLInputElement
      || target instanceof HTMLTextAreaElement
      || target instanceof HTMLSelectElement
      || (target instanceof HTMLElement && target.isContentEditable)
    );

    const handleGlobalSpace = (event) => {
      if (event.code !== 'Space' || previewItem || isTypingTarget(event.target)) {
        return;
      }

      if (activeWindow === 'media') {
        event.preventDefault();
        openPreview(mediaItems, activeMediaIndex, 'media');
      }
    };

    window.addEventListener('keydown', handleGlobalSpace, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleGlobalSpace, { capture: true });
    };
  }, [activeMediaIndex, activeWindow, previewItem]);

  useEffect(() => {
    const preloadTargets = mediaItems
      .map((item) => item.previewVideo)
      .filter(Boolean);

    const links = preloadTargets.map((href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = href;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach((link) => link.remove());
    };
  }, []);

  useEffect(() => {
    if (previewItem) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      const videoWindow = windowRefs.current.media;
      const visibleVideos = videoWindow?.querySelectorAll?.('.gallery-card video');

      visibleVideos?.forEach((video) => {
        if (!(video instanceof HTMLVideoElement)) {
          return;
        }
        const itemIndex = Number(video.dataset.index);
        const isVisibleCard = Number.isFinite(itemIndex)
          && Math.abs(getOffset(itemIndex, activeMediaIndex, mediaItems)) <= 1;
        const hasWindowAudio = itemIndex === windowAudioVideoIndex;

        video.muted = !hasWindowAudio;
        video.volume = hasWindowAudio ? 1 : 0;

        if (isVisibleCard) {
          video.play().catch(() => {});
          return;
        }

        video.muted = true;
        video.pause();
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [activeMediaIndex, previewItem, windowAudioVideoIndex]);

  useEffect(() => {
    setWindowAudioVideoIndex(null);
  }, [activeMediaIndex, activePage, previewItem]);

  useEffect(() => {
    setMotionWindow('media');
    const timerId = window.setTimeout(() => {
      setMotionWindow((current) => (current === 'media' ? null : current));
    }, 180);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [activeMediaIndex]);

  useEffect(() => {
    if (!previewItem?.isVideo) {
      setPreviewControlsVisible(false);
      return;
    }

    setPreviewControlsVisible(isMobileViewport());
  }, [previewItem]);

  useEffect(() => {
    if (!previewItem) {
      return undefined;
    }

    const handlePreviewKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClosePreview();
      }
    };

    const handlePreviewKeyUp = (event) => {
      const previewAge = window.performance.now() - previewOpenedAtRef.current;

      if (event.code === 'Space' && previewAge > 240) {
        event.preventDefault();
        requestClosePreview();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handlePreviewKeyDown);
    window.addEventListener('keyup', handlePreviewKeyUp);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handlePreviewKeyDown);
      window.removeEventListener('keyup', handlePreviewKeyUp);
    };
  }, [previewItem]);

  useEffect(() => {
    document.body.classList.toggle('preview-open', Boolean(previewItem));

    return () => {
      document.body.classList.remove('preview-open');
    };
  }, [previewItem]);

  useEffect(() => () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
  }, []);

  const renderFinderWindow = (items, activeItem, setActiveItem, label, windowId) => (
    <section className="finder-gallery" aria-label={label}>
      {(() => {
        const visibleItems = items
          .map((item, index) => ({
            item,
            index,
            offset: getOffset(index, activeItem, items),
          }))
          .filter(({ offset }) => Math.abs(offset) <= 2);

        return (
      <div
        className={`finder-window ${activeWindow === windowId ? 'is-selected' : 'is-unselected'}`}
        ref={(element) => {
          windowRefs.current[windowId] = element;
        }}
      >
        <div className="finder-window__toolbar">
          <div className="finder-window__traffic-lights" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="finder-window__title mono" aria-hidden="true" />
          <div className="finder-window__search" aria-hidden="true" />
        </div>

        <div
          className={`finder-window__coverflow ${motionWindow === windowId ? 'is-scrolling' : ''}`}
          data-click-zone={coverflowHoverZones[windowId] || 'center'}
          tabIndex={0}
          aria-label="Use left and right arrow keys or swipe to browse gallery"
          onFocus={() => setActiveWindow(windowId)}
          onBlur={() => setActiveWindow(null)}
          onKeyDown={(event) => handleKeyDown(event, items, setActiveItem)}
          onClick={(event) => handleCoverflowClick(event, items, activeItem, setActiveItem, windowId)}
          onMouseMove={(event) => handleCoverflowPointerMove(event, windowId)}
          onMouseLeave={() => clearCoverflowPointerZone(windowId)}
          onTouchStart={(event) => handleCoverflowTouchStart(event, windowId)}
          onTouchEnd={(event) => handleCoverflowTouchEnd(event, items, setActiveItem)}
          onTouchCancel={() => {
            touchStateRef.current = null;
          }}
        >
          <div className="coverflow-strip">
            {visibleItems.map(({ item, index, offset }) => {
              const isVideoCard = Boolean(item.previewVideo);

              return (
                <article
                  className={`gallery-card ${item.accent} ${isVideoCard ? 'gallery-card--video' : ''} ${index === activeItem ? 'is-active' : ''}`}
                  key={item.title}
                  style={getCardStyle(offset)}
                  onClick={() => {
                    setActiveWindow(windowId);
                    if (index === activeItem) {
                      if (isVideoCard && isMobileViewport()) {
                        setWindowAudioVideoIndex(index);
                        activateMobileWindowAudio(index);
                        return;
                      }
                      openPreview(items, index, windowId);
                      return;
                    }
                    setWindowAudioVideoIndex(null);
                    setActiveItem(index);
                  }}
                >
                  <div className="gallery-card__image">
                    {isVideoCard ? (
                      <video
                        data-index={index}
                        autoPlay
                        muted={windowAudioVideoIndex !== index}
                        loop
                        playsInline
                        preload="auto"
                        onLoadedData={(event) => {
                          event.currentTarget.play().catch(() => {});
                        }}
                        onCanPlay={(event) => {
                          event.currentTarget.play().catch(() => {});
                        }}
                      >
                        <source
                          src={item.previewVideo}
                          {...(item.mimeType ? { type: item.mimeType } : {})}
                        />
                      </video>
                    ) : null}
                    {!isVideoCard && item.previewImage ? <img src={item.previewImage} alt={item.title} /> : null}
                  </div>
                  <div className="gallery-card__reflection" aria-hidden="true">
                    {!isVideoCard && item.previewImage ? <img src={item.previewImage} alt="" /> : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
        );
      })()}
    </section>
  );

  return (
    <main className="editorial-page">
      {previewItem ? (
        <div
          className="media-preview"
          data-closing={previewItem.isClosing ? 'true' : 'false'}
          role="dialog"
          aria-modal="true"
          aria-label={`${previewItem.title} preview`}
          onClick={requestClosePreview}
        >
          <div
            className="media-preview__window"
            style={{
              '--preview-start-x': `${previewItem.startX}px`,
              '--preview-start-y': `${previewItem.startY}px`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="media-preview__toolbar">
              <button
                type="button"
                className="media-preview__close mono"
                onClick={requestClosePreview}
              >
                close
              </button>
              <p className="media-preview__title mono">{previewItem.title}</p>
              <span className="media-preview__toolbar-spacer" aria-hidden="true" />
            </div>
            <div
              className="media-preview__media"
              onMouseEnter={() => {
                if (previewItem.isVideo && !isMobileViewport()) {
                  setPreviewControlsVisible(true);
                }
              }}
              onMouseLeave={() => {
                if (previewItem.isVideo && !isMobileViewport()) {
                  setPreviewControlsVisible(false);
                }
              }}
            >
              {previewItem.isVideo && previewItem.mediaSrc ? (
                <video
                  key={previewItem.mediaSrc}
                  controls={previewControlsVisible}
                  playsInline
                  preload="auto"
                  muted={false}
                  defaultMuted={false}
                  onLoadedMetadata={(event) => {
                    event.currentTarget.muted = false;
                    event.currentTarget.defaultMuted = false;
                    event.currentTarget.volume = 1;
                  }}
                  onPlay={(event) => {
                    event.currentTarget.muted = false;
                    event.currentTarget.defaultMuted = false;
                    event.currentTarget.volume = 1;
                  }}
                >
                  <source
                    src={previewItem.mediaSrc}
                    {...(previewItem.mimeType ? { type: previewItem.mimeType } : {})}
                  />
                </video>
              ) : null}
              {!previewItem.isVideo && previewItem.mediaSrc ? (
                <img src={previewItem.mediaSrc} alt={previewItem.title} />
              ) : null}
            </div>
            <p className="media-preview__description mono">{previewItem.description}</p>
          </div>
        </div>
      ) : null}

      <header className="page-mark">
        <button
          className="page-mark__name page-mark__button mono"
          data-cursor-static
          type="button"
          onClick={() => setActivePage('home')}
        >
          kristers dzenis
        </button>
        <button
          className="page-mark__name page-mark__button mono"
          data-cursor-static
          type="button"
          onClick={() => setActivePage('about')}
        >
          about me
        </button>
        <button
          className="page-mark__name page-mark__button mono"
          data-cursor-static
          type="button"
          onClick={() => setActivePage('contact')}
        >
          contact
        </button>
      </header>

      {activePage === 'contact' ? (
        <section className="contact-blank" aria-label="contact page">
          <div className="contact-blank__panel">
            <button
              className="contact-blank__email mono"
              type="button"
              onClick={handleEmailClick}
            >
              kristers.dzenis@icloud.com
            </button>
            {showCopyPrompt ? (
              <div className="contact-blank__prompt mono" role="status" aria-live="polite">
                <button
                  className="contact-blank__copy-button mono"
                  type="button"
                  onClick={handleCopyEmail}
                >
                  {copyState === 'copied'
                    ? 'address copied'
                    : copyState === 'failed'
                      ? 'copy failed'
                      : 'copy address'}
                </button>
              </div>
            ) : null}
          </div>
        </section>
      ) : activePage === 'about' ? (
        <section className="contact-blank" aria-label="about page">
          <div className="contact-blank__panel">
            <p className="contact-blank__about-text">
              Audiovisual artist based in Latvia.
              <br />
              Currently studying at the Art Academy of Latvia.
              <br />
              Working with moving image and sound
            </p>
          </div>
        </section>
      ) : (
        <section className="home-layout" aria-label="home page">
          {renderFinderWindow(mediaItems, activeMediaIndex, setActiveMediaIndex, 'media material', 'media')}

          <div className="work-groups">
            <div className="work-group work-group--counter">
              <ViewCounter />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default ProjectList;
