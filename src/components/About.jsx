import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.from(sectionRef.current.querySelectorAll('h2, p'), {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }, []);

  return (
    <section className="section" id="about" ref={sectionRef}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="text-center mb-4">ABOUT</h2>
          <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Creative artist pushing the boundaries of black & white aesthetics. 
            Specializing in minimalist compositions with maximum impact.
          </p>
          <p style={{ textAlign: 'center', color: 'var(--gray-light)' }}>
            Based in the intersection of chaos and order, creating work that 
            challenges conventional design principles while maintaining a 
            rebellious edge.
          </p>
        </div>
      </div>
    </section>
  );
}
