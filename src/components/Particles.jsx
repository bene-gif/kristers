import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadImageShape } from "@tsparticles/shape-image";

const createCurrencySprite = (symbol, fill, background, border) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" shape-rendering="crispEdges">
      <rect x="4" y="4" width="16" height="16" fill="${background}" />
      <rect x="3" y="3" width="18" height="2" fill="${border}" />
      <rect x="3" y="19" width="18" height="2" fill="${border}" />
      <rect x="3" y="5" width="2" height="14" fill="${border}" />
      <rect x="19" y="5" width="2" height="14" fill="${border}" />
      <text
        x="12"
        y="13.5"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="'Coral Pixels', 'IBM Plex Mono', monospace"
        font-size="9"
        letter-spacing="0"
        fill="${fill}"
      >${symbol}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const currencySprites = [
  { name: "usd", src: createCurrencySprite("$", "#d7ffd8", "#1f6b3d", "#0f321f"), width: 24, height: 24 },
  { name: "eur", src: createCurrencySprite("€", "#d8ebff", "#275eaf", "#16315b"), width: 24, height: 24 },
  { name: "gbp", src: createCurrencySprite("£", "#ffe3ea", "#8c3658", "#3f1828"), width: 24, height: 24 },
  { name: "jpy", src: createCurrencySprite("¥", "#fff1c9", "#b24f1d", "#56250d"), width: 24, height: 24 },
  { name: "chf", src: createCurrencySprite("₣", "#ffdfe2", "#c83d4a", "#611d24"), width: 24, height: 24 },
  { name: "krw", src: createCurrencySprite("₩", "#e2d8ff", "#5b3db6", "#2a1d55"), width: 24, height: 24 },
  { name: "inr", src: createCurrencySprite("₹", "#ffe0b8", "#cf6a16", "#64330a"), width: 24, height: 24 },
  { name: "rub", src: createCurrencySprite("₽", "#d4fff1", "#1f8c72", "#104437"), width: 24, height: 24 },
  { name: "try", src: createCurrencySprite("₺", "#ffe0e0", "#b53737", "#551919"), width: 24, height: 24 },
  { name: "uah", src: createCurrencySprite("₴", "#d9f0ff", "#2a78ba", "#153c5c"), width: 24, height: 24 },
  { name: "vnd", src: createCurrencySprite("₫", "#fff3d3", "#af7f18", "#56400c"), width: 24, height: 24 },
  { name: "ngn", src: createCurrencySprite("₦", "#dafce4", "#218547", "#113f24"), width: 24, height: 24 },
  { name: "php", src: createCurrencySprite("₱", "#ffe9c9", "#ad6127", "#543011"), width: 24, height: 24 },
  { name: "ils", src: createCurrencySprite("₪", "#dfe7ff", "#4b5eb7", "#232c57"), width: 24, height: 24 },
  { name: "btc", src: createCurrencySprite("฿", "#ffe2bf", "#d47a12", "#643907"), width: 24, height: 24 },
  { name: "gel", src: createCurrencySprite("₾", "#f4dcff", "#9446b8", "#452055"), width: 24, height: 24 },
];

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    const start = () => {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
        await loadImageShape(engine, false);
      }).then(() => {
        setInit(true);
      });
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(start, 250);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "#fdfbf7",
        },
      },
      fpsLimit: 30,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: "push",
          },
          onHover: {
            enable: false,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 12,
          },
          repulse: {
            distance: 135,
            duration: 2.2,
            speed: 0.5,
            factor: 60,
          },
        },
      },
      particles: {
        links: {
          enable: false,
        },
        move: {
          direction: "top",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: { min: 0.04, max: 0.18 },
          straight: true,
          drift: 0,
        },
        number: {
          density: {
            enable: true,
            area: 2200,
          },
          value: 140,
        },
        opacity: {
          value: { min: 0.025, max: 0.09 },
          animation: {
            enable: true,
            speed: 0.28,
            sync: false,
          },
        },
        shadow: {
          enable: true,
          color: "#f3f0eb",
          blur: 14,
          offset: {
            x: 0,
            y: 0,
          },
        },
        shape: {
          type: "image",
          options: {
            image: currencySprites,
          },
        },
        size: {
          value: { min: 6, max: 14 },
          animation: {
            enable: false,
            speed: 1,
            sync: false,
          },
        },
      },
      detectRetina: false,
      preload: currencySprites,
    }),
    [],
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={options}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          filter: "blur(72px) contrast(0.96) saturate(1.12) brightness(1.04)",
          opacity: 0.09,
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        }}
      />
    );
  }

  return null;
}
