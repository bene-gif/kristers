import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return undefined;
    }

    let frameId = 0;
    let lastX = 0;
    let lastY = 0;

    const renderPosition = () => {
      frameId = 0;

      if (!cursorRef.current) {
        return;
      }

      cursorRef.current.style.setProperty('--cursor-x', `${lastX}px`);
      cursorRef.current.style.setProperty('--cursor-y', `${lastY}px`);
    };

    const updatePosition = (event) => {
      lastX = event.clientX;
      lastY = event.clientY;

      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(renderPosition);
    };

    const handlePointerState = (event) => {
      const target = event.target instanceof Element
        ? event.target.closest('a, button, .hoverable')
        : null;

      if (!target || target.hasAttribute('data-cursor-static')) {
        setIsHovering(false);
        return;
      }

      setIsHovering(true);
    };

    const handlePointerLeave = (event) => {
      const target = event.target instanceof Element
        ? event.target.closest('a, button, .hoverable')
        : null;

      if (!target || target.hasAttribute('data-cursor-static')) {
        return;
      }

      const relatedTarget = event.relatedTarget instanceof Element ? event.relatedTarget : null;
      if (relatedTarget?.closest('a, button, .hoverable') === target) {
        return;
      }

      setIsHovering(false);
    };

    window.addEventListener('pointermove', updatePosition, { passive: true });
    document.addEventListener('pointerover', handlePointerState);
    document.addEventListener('pointerout', handlePointerLeave);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('pointermove', updatePosition);
      document.removeEventListener('pointerover', handlePointerState);
      document.removeEventListener('pointerout', handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isHovering ? 'hover' : ''}`}
    >
      <span className="custom-cursor__lens" />
      <span className="custom-cursor__gloss" />
    </div>
  );
}
