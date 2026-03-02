import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    gsap.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
      delay: 0.3
    });

    gsap.from(subtitleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.8
    });
  }, []);

  return (
    <section className="section" id="home">
      <div className="container text-center">
        <h1 
          ref={titleRef}
          className="glitch" 
          data-text="KRSTER"
        >
          KRSTER
        </h1>
        <p ref={subtitleRef} className="mono" style={{ marginTop: '2rem', fontSize: '1.5rem' }}>
          CREATIVE / ARTIST / DESIGNER
        </p>
      </div>
    </section>
  );
}
