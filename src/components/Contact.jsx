export default function Contact() {
  return (
    <section className="section" id="contact" style={{ minHeight: '60vh' }}>
      <div className="container text-center">
        <h2 className="mb-4">GET IN TOUCH</h2>
        <p className="mono" style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>
          LET'S CREATE SOMETHING EDGY
        </p>
        
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="mailto:hello@krster.com" 
            className="hoverable"
            style={{ 
              fontSize: '1.25rem',
              borderBottom: '2px solid var(--white)',
              paddingBottom: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            EMAIL
          </a>
          <a 
            href="https://instagram.com/krster" 
            className="hoverable"
            style={{ 
              fontSize: '1.25rem',
              borderBottom: '2px solid var(--white)',
              paddingBottom: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            INSTAGRAM
          </a>
          <a 
            href="https://twitter.com/krster" 
            className="hoverable"
            style={{ 
              fontSize: '1.25rem',
              borderBottom: '2px solid var(--white)',
              paddingBottom: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            TWITTER
          </a>
        </div>

        <p className="mono" style={{ marginTop: '4rem', fontSize: '0.875rem', opacity: 0.6 }}>
          © 2026 KRSTER. ALL RIGHTS RESERVED.
        </p>
      </div>
    </section>
  );
}
