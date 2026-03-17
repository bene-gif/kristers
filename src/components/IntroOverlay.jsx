import { useEffect } from 'react';

const INTRO_DURATION_MS = 2200;

export default function IntroOverlay({ onComplete }) {
  useEffect(() => {
    const timerId = window.setTimeout(() => {
      onComplete();
    }, INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [onComplete]);

  return (
    <div className="intro-overlay" aria-hidden="true">
      <div className="intro-overlay__grain" />
      <p className="intro-overlay__hello">Hello!</p>
    </div>
  );
}
