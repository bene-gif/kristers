import { useEffect } from 'react';

const INTRO_DURATION_MS = 2200;
const INTRO_SOUND_PATH = '/mac-startup-chime.mp3';

export default function IntroOverlay({ onComplete }) {
  useEffect(() => {
    const timerId = window.setTimeout(() => {
      onComplete();
    }, INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [onComplete]);

  useEffect(() => {
    const audio = new Audio(INTRO_SOUND_PATH);
    let resolved = false;

    audio.preload = 'auto';
    audio.volume = 1;

    const cleanupUnlockListeners = () => {
      window.removeEventListener('pointerdown', retryPlayback, true);
      window.removeEventListener('keydown', retryPlayback, true);
    };

    const retryPlayback = () => {
      if (resolved) {
        return;
      }

      const playAttempt = audio.play();
      if (playAttempt?.then) {
        playAttempt.then(() => {
          resolved = true;
          cleanupUnlockListeners();
        }).catch(() => {});
      }
    };

    const playAttempt = audio.play();
    if (playAttempt?.catch) {
      playAttempt.catch(() => {
        window.addEventListener('pointerdown', retryPlayback, true);
        window.addEventListener('keydown', retryPlayback, true);
      });
    } else {
      resolved = true;
    }

    return () => {
      cleanupUnlockListeners();
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="intro-overlay" aria-hidden="true">
      <div className="intro-overlay__grain" />
      <p className="intro-overlay__hello">Hello!</p>
    </div>
  );
}
