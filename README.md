# KRISTERS DZENIS - Edgy Black & White Portfolio

A custom-built portfolio website with an edgy, minimalist black & white aesthetic featuring interactive elements and unique UI effects.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen)

## ✨ Features

- **Custom Cursor**: Magnetic cursor with hover effects using custom implementation
- **Glitch Effects**: Edgy RGB split animations on hero text
- **Particle Background**: Interactive particle system with tsparticles
- **Interactive Timeline**: Hover-to-reveal artwork preview on timeline nodes
- **Smooth Animations**: GSAP-powered scroll animations with ScrollTrigger
- **Full-Screen Navigation**: Sleek overlay menu with smooth transitions
- **100% Black & White**: Pure monochrome aesthetic with maximum contrast
- **Responsive Design**: Mobile-friendly layout

## 🎨 Design Philosophy

- **No Templates**: Custom-built from scratch, zero generic designs
- **Edgy Aesthetic**: Rebellious, attention-grabbing design language
- **Maximum Contrast**: Pure black (#000) and white (#FFF) only
- **Minimalist**: Focus on content with strategic use of negative space
- **Interactive**: Engaging hover effects and transitions

## 🛠 Tech Stack

- **Framework**: Vite + React
- **Animations**: GSAP + ScrollTrigger
- **Particles**: @tsparticles/react
- **Typography**: Inter (display) + IBM Plex Mono (accents)
- **Styling**: Custom CSS with CSS Variables

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Aeron-bot/kristersdzenis-portfolio.git
cd kristersdzenis-portfolio

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Development

The project runs on **Vite** for fast HMR and optimal build performance.

- Dev server: `http://localhost:5173`
- Production build outputs to `dist/`

## 📁 Project Structure

```
kristersdzenis-portfolio/
├── src/
│   ├── components/
│   │   ├── CustomCursor.jsx    # Magnetic cursor effect
│   │   ├── Hero.jsx             # Hero section with glitch
│   │   ├── Particles.jsx        # Particle background
│   │   ├── Timeline.jsx         # Interactive timeline
│   │   ├── Timeline.css         # Timeline styles
│   │   ├── About.jsx            # About section
│   │   ├── Contact.jsx          # Contact section
│   │   ├── Navigation.jsx       # Full-screen nav
│   │   └── Navigation.css       # Nav styles
│   ├── App.jsx                  # Main app component
│   ├── index.css                # Global styles
│   └── main.jsx                 # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## 🎯 Key Components

### CustomCursor
Magnetic cursor that follows mouse movement and enlarges on hover over interactive elements.

### Hero
Hero section with animated glitch effect on the title using pure CSS animations.

### Particles
Interactive particle background using tsparticles with hover repulse and click push effects, softened with a subtle blur to echo the reference’s texture.

### Timeline
Interactive timeline with hover-to-reveal artwork functionality. Displays project chronologically with smooth animations.

### Navigation
Full-screen overlay navigation with smooth slide-in animation and hover effects.

## 🎨 Customization

### Colors
Edit CSS variables in `src/index.css`:

```css
:root {
  --black: #000000;
  --white: #ffffff;
  --gray-dark: #1a1a1a;
  --gray-light: #e5e5e5;
}
```

### Timeline Data
Update timeline content in `src/components/Timeline.jsx`:

```javascript
const timelineData = [
  {
    id: 1,
    year: '2024',
    title: 'Your Project',
    description: 'Description',
    image: 'image-url'
  },
  // Add more items...
];
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 👤 Author

Built with 🖤 by Aeron for Kristers Dzenis

## 🙏 Credits

- Animations: GSAP
- Particles: tsparticles
- Fonts: Google Fonts (Inter, IBM Plex Mono)
- Images: Unsplash

---

**Note**: This portfolio is designed to be edgy and unique. Customize it to match your personal style while maintaining the minimalist black & white aesthetic.
