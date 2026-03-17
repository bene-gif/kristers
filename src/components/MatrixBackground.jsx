import { useEffect, useRef } from 'react';

const glyphs = '0123456789$€£¥₣₩₹₽₺₴₫₦₱₲₡₵₪฿₸₭₮₼₾ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const randomGlyph = () => glyphs[Math.floor(Math.random() * glyphs.length)];

export default function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!(canvas instanceof HTMLCanvasElement)) {
      return undefined;
    }

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) {
      return undefined;
    }

    let frameId = 0;
    let width = 0;
    let height = 0;
    let columns = [];
    const pointer = { x: -1000, y: -1000, active: false };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const columnWidth = 18;
      const count = Math.ceil(width / columnWidth);
      columns = Array.from({ length: count }, (_, index) => ({
        x: index * columnWidth,
        y: Math.random() * height,
        speed: 1.1 + (Math.random() * 2.2),
        length: 10 + Math.floor(Math.random() * 18),
      }));
    };

    const handlePointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const render = () => {
      context.fillStyle = 'rgba(243, 240, 235, 0.12)';
      context.fillRect(0, 0, width, height);
      context.font = '14px "IBM Plex Mono", monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      for (const column of columns) {
        for (let index = 0; index < column.length; index += 1) {
          const y = column.y - (index * 16);

          if (y < -24 || y > height + 24) {
            continue;
          }

          const dx = pointer.x - column.x;
          const dy = pointer.y - y;
          const distance = Math.hypot(dx, dy);
          const hoverGlow = pointer.active ? Math.max(0, 1 - (distance / 120)) : 0;
          const alpha = Math.max(0.06, 0.52 - (index * 0.028));

          context.fillStyle = `rgba(${hoverGlow > 0.1 ? '98, 194, 118' : '58, 143, 76'}, ${(alpha * 0.42) + (hoverGlow * 0.22)})`;
          context.shadowBlur = hoverGlow > 0 ? 6 + (hoverGlow * 18) : 0;
          context.shadowColor = hoverGlow > 0 ? 'rgba(132, 214, 149, 0.62)' : 'transparent';
          context.fillText(randomGlyph(), column.x, y);
        }

        column.y += column.speed;
        if ((column.y - (column.length * 16)) > height + 24) {
          column.y = -40 - (Math.random() * height * 0.25);
          column.speed = 1.1 + (Math.random() * 2.2);
          column.length = 10 + Math.floor(Math.random() * 18);
        }
      }

      frameId = window.requestAnimationFrame(render);
    };

    resize();
    context.clearRect(0, 0, width, height);
    frameId = window.requestAnimationFrame(render);

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  return <canvas className="matrix-background" ref={canvasRef} aria-hidden="true" />;
}
