import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "#fdfbf7",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
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
        color: {
          value: "#111111",
        },
        links: {
          enable: false,
        },
        move: {
          direction: "top",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: { min: 0.04, max: 0.18 },
          straight: false,
          drift: 0.2,
        },
        number: {
          density: {
            enable: true,
            area: 1400,
          },
          value: 5040,
        },
        opacity: {
          value: { min: 0.03, max: 0.135 },
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 0.4, max: 2.2 },
          animation: {
            enable: true,
            speed: 1.2,
            sync: false,
          },
        },
      },
      detectRetina: false,
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
          filter: "blur(10px) contrast(0.9)",
          opacity: 0.78,
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        }}
      />
    );
  }

  return null;
}
