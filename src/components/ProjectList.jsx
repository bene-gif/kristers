import { useState } from 'react';

const years = ['2026', '2025', '2024'];

const galleryItems = [
  { title: 'untitled-01.jpg', meta: 'replace with artwork', accent: 'gallery-card--warm' },
  { title: 'untitled-02.jpg', meta: 'replace with artwork', accent: 'gallery-card--forest' },
  { title: 'untitled-03.jpg', meta: 'replace with artwork', accent: 'gallery-card--ember' },
  { title: 'untitled-04.jpg', meta: 'replace with artwork', accent: 'gallery-card--mist' },
  { title: 'untitled-05.jpg', meta: 'replace with artwork', accent: 'gallery-card--shadow' },
  { title: 'untitled-06.jpg', meta: 'replace with artwork', accent: 'gallery-card--warm' },
  { title: 'untitled-07.jpg', meta: 'replace with artwork', accent: 'gallery-card--forest' },
  { title: 'untitled-08.jpg', meta: 'replace with artwork', accent: 'gallery-card--ember' },
  { title: 'untitled-09.jpg', meta: 'replace with artwork', accent: 'gallery-card--mist' },
  { title: 'untitled-10.jpg', meta: 'replace with artwork', accent: 'gallery-card--shadow' },
  { title: 'untitled-11.jpg', meta: 'replace with artwork', accent: 'gallery-card--warm' },
  { title: 'untitled-12.jpg', meta: 'replace with artwork', accent: 'gallery-card--forest' },
  { title: 'untitled-13.jpg', meta: 'replace with artwork', accent: 'gallery-card--ember' },
  { title: 'untitled-14.jpg', meta: 'replace with artwork', accent: 'gallery-card--mist' },
  { title: 'untitled-15.jpg', meta: 'replace with artwork', accent: 'gallery-card--shadow' },
];

const videoItems = [
  { title: 'untitled-01.mov', meta: 'replace with video', accent: 'gallery-card--mist' },
  { title: 'untitled-02.mp4', meta: 'replace with video', accent: 'gallery-card--shadow' },
  { title: 'untitled-03.mov', meta: 'replace with video', accent: 'gallery-card--forest' },
  { title: 'untitled-04.mp4', meta: 'replace with video', accent: 'gallery-card--ember' },
  { title: 'untitled-05.mov', meta: 'replace with video', accent: 'gallery-card--warm' },
];

function ProjectList() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [activeVideoIndex, setActiveVideoIndex] = useState(2);
  const [activePage, setActivePage] = useState('home');
  const [activeWindow, setActiveWindow] = useState(null);
  const [showCopyPrompt, setShowCopyPrompt] = useState(false);
  const [copyState, setCopyState] = useState('idle');

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
    const distance = Math.min(Math.abs(offset), 2.5);
    const focus = Math.max(0, 1 - (distance / 2.5));
    const easedFocus = focus * focus * (3 - (2 * focus));
    const direction = Math.sign(offset);
    const spread = 220 + ((1 - easedFocus) * 34);

    return {
      '--dock-scale-x': (0.42 + (easedFocus * 1.02)).toFixed(3),
      '--dock-scale-y': (0.62 + (easedFocus * 0.68)).toFixed(3),
      '--dock-rotate-y': `${(-direction * (distance * 42)).toFixed(3)}deg`,
      '--dock-lift': `${(easedFocus * 44).toFixed(3)}px`,
      '--dock-blur': `${((1 - easedFocus) * 3.4).toFixed(3)}px`,
      '--dock-opacity': (0.2 + (easedFocus * 0.8)).toFixed(3),
      '--dock-shift-x': `${(offset * spread).toFixed(3)}px`,
      '--dock-depth': `${(-distance * 220).toFixed(3)}px`,
      '--dock-reflection': (0.02 + (easedFocus * 0.15)).toFixed(3),
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

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('kristers.dzenis@icloud.com');
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  const renderFinderWindow = (items, activeItem, setActiveItem, label, windowId) => (
    <section className="finder-gallery" aria-label={label}>
      <div
        className={`finder-window ${activeWindow === windowId ? 'is-selected' : 'is-unselected'}`}
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
          className="finder-window__coverflow"
          tabIndex={0}
          aria-label="Use left and right arrow keys to browse gallery"
          onFocus={() => setActiveWindow(windowId)}
          onBlur={() => setActiveWindow(null)}
          onKeyDown={(event) => handleKeyDown(event, items, setActiveItem)}
        >
          <div className="coverflow-strip">
            {items.map((item, index) => {
              const offset = getOffset(index, activeItem, items);

              return (
                <article
                  className={`gallery-card ${item.accent} ${index === activeItem ? 'is-active' : ''}`}
                  key={item.title}
                  style={getCardStyle(offset)}
                >
                  <div className="gallery-card__image">
                    {item.image ? <img src={item.image} alt={item.title} /> : null}
                    <span className="gallery-card__label mono">
                      {index === activeItem ? item.title : item.meta}
                    </span>
                  </div>
                  <div className="gallery-card__reflection" aria-hidden="true">
                    {item.image ? <img src={item.image} alt="" /> : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="finder-window__status mono">{label}</div>
      </div>
    </section>
  );

  return (
    <main className="editorial-page">
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
            <p className="contact-blank__email mono">about me</p>
            <img
              className="contact-blank__image"
              src="/IMG_4964%202.jpeg"
              alt="White cat sitting on a bathroom floor"
            />
          </div>
        </section>
      ) : (
        <>
          {renderFinderWindow(galleryItems, activeIndex, setActiveIndex, 'image material', 'image')}
          {renderFinderWindow(videoItems, activeVideoIndex, setActiveVideoIndex, 'video material', 'video')}

          <section className="intro-copy">
            <p>
              Kristers Dzenis is a Latvian interdisciplinary artist whose practice explores the
              intersection of conceptual inquiry and material contingency. His work investigates
              the traces of presence and the narratives they might hold, guided by intuitive
              responses to environment, texture, sound, performance, and sculpture.
            </p>
            <p>
              Through shifting forms and sparse gestures, the work constructs meaning from layered
              encounters between objects, spaces, and histories. Currently part of a practice that
              moves between installations, moving image, and printed matter.
            </p>
          </section>

          <section className="work-groups">
            <div className="work-group work-group--archive">
              <h2>years</h2>
              <ul>
                {years.map((year) => (
                  <li key={year}>
                    <a href="#">{year}</a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default ProjectList;
