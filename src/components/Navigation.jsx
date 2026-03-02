import { useState } from 'react';
import './Navigation.css';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-logo mono">KRSTER</div>
        <button 
          className={`nav-toggle hoverable ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
        <a href="#home" onClick={() => scrollToSection('home')} className="hoverable">
          HOME
        </a>
        <a href="#about" onClick={() => scrollToSection('about')} className="hoverable">
          ABOUT
        </a>
        <a href="#timeline" onClick={() => scrollToSection('timeline')} className="hoverable">
          TIMELINE
        </a>
        <a href="#contact" onClick={() => scrollToSection('contact')} className="hoverable">
          CONTACT
        </a>
      </div>
    </>
  );
}
