import { useState } from 'react';
import './Timeline.css';

const timelineData = [
  {
    id: 1,
    year: '2026',
    title: 'VOID UI - Dark Web Interface',
    description: 'Website Design • Minimalist Dashboard',
    medium: 'Web Design',
    image: 'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=800&q=80&auto=format&fit=crop&cs=tinysrgb'
  },
  {
    id: 2,
    year: '2025',
    title: 'CHAOS THEORY - Abstract Series',
    description: 'Digital Art • Geometric Abstraction',
    medium: 'Digital Illustration',
    image: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&q=80&auto=format&fit=crop&cs=tinysrgb'
  },
  {
    id: 3,
    year: '2024',
    title: 'EDGE STUDIOS - Brand Identity',
    description: 'Branding • Logo & Visual System',
    medium: 'Graphic Design',
    image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&q=80&auto=format&fit=crop&cs=tinysrgb'
  },
  {
    id: 4,
    year: '2024',
    title: 'NOIR COLLECTION - Editorial',
    description: 'Photography • High Contrast Portraits',
    medium: 'Photography',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80&auto=format&fit=crop&cs=tinysrgb'
  },
  {
    id: 5,
    year: '2023',
    title: 'GLITCH MANIFESTO - Exhibition',
    description: 'Installation Art • Interactive Experience',
    medium: 'Installation',
    image: 'https://images.unsplash.com/photo-1551732998-34d971d29a5e?w=800&q=80&auto=format&fit=crop&cs=tinysrgb'
  },
  {
    id: 6,
    year: '2023',
    title: 'DYSTOPIA - Mobile App UI',
    description: 'App Design • Dark Mode Interface',
    medium: 'UI/UX Design',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80&auto=format&fit=crop&cs=tinysrgb'
  },
  {
    id: 7,
    year: '2022',
    title: 'MONOLITH - Typography Series',
    description: 'Type Design • Experimental Fonts',
    medium: 'Typography',
    image: 'https://images.unsplash.com/photo-1598550487956-4480d9bdc325?w=800&q=80&auto=format&fit=crop&cs=tinysrgb'
  },
  {
    id: 8,
    year: '2021',
    title: 'SHADOW WORK - Photo Manipulation',
    description: 'Digital Collage • Surreal Compositions',
    medium: 'Photo Art',
    image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80&auto=format&fit=crop&cs=tinysrgb'
  }
];

export default function Timeline() {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <section className="section timeline-section" id="timeline">
      <div className="container">
        <h2 className="text-center mb-4">WORK</h2>
        <p className="text-center mono" style={{ fontSize: '0.875rem', marginBottom: '4rem', opacity: 0.6 }}>
          HOVER TO REVEAL
        </p>

        <div className="timeline-container">
          <div className="timeline-line"></div>

          {timelineData.map((item, index) => (
            <div
              key={item.id}
              className="timeline-item"
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="timeline-node hoverable">
                <span className="timeline-year mono">{item.year}</span>
              </div>

              <div className="timeline-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="timeline-medium mono" style={{
                  fontSize: '0.75rem',
                  opacity: 0.5,
                  display: 'block',
                  marginTop: '0.5rem'
                }}>
                  {item.medium}
                </span>
              </div>

              {hoveredItem && hoveredItem.id === item.id && (
                <div className="artwork-preview">
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ filter: 'grayscale(100%) contrast(1.2)' }}
                  />
                  <div className="artwork-overlay">
                    <span className="mono">{item.medium}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
