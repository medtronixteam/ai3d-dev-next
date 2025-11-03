
import React, { useEffect, useRef } from 'react';
import './Starfield.css';

const DEFAULT_STAR_COLORS = [
  '#fff', // white
  '#ffe6f3', // pink
  '#e0e7ffc0', // blue
  '#fffbe6', // yellowish
  '#fbe5f7', // soft pink
  '#eaf1ff', // soft blue
];

const lighten = (hex, amount) => {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
    const b = Math.min(255, (num & 0x0000ff) + amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  } catch {
    return hex;
  }
};

const Starfield = ({ baseColor, colors, numStars = 5 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    const palette = (colors && colors.length ? colors : null) ||
      (baseColor
        ? [lighten(baseColor, 0), lighten(baseColor, 20), lighten(baseColor, 40), '#ffffff']
        : DEFAULT_STAR_COLORS);

    const stars = [];
    for (let i = 0; i < numStars; i++) {
      const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const size = 8 + Math.random() * 10;
      const color = palette[Math.floor(Math.random() * palette.length)];
      star.setAttribute('width', size);
      star.setAttribute('height', size);
      star.setAttribute('viewBox', '0 0 24 24');
      star.style.position = 'absolute';
      const baseX = ((i + 1) / (numStars + 1)) * 100;
      const jitterX = (Math.random() * 10 - 5);
      star.style.left = `${Math.min(98, Math.max(2, baseX + jitterX))}%`;
      // Keep stars low near the search input (approx 55%–75% of hero)
      star.style.top = `${55 + Math.random() * 20}%`;
      star.style.opacity = `${0.5 + Math.random() * 0.4}`;
      star.style.filter = `drop-shadow(0 0 8px ${color}88)`;
      const floatDur = 6 + Math.random() * 5;
      star.style.animation = `star-twinkle 2.2s ease-in-out infinite, star-float ${floatDur}s ease-in-out infinite`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      star.style.transition = 'left 6s ease-in-out, top 6s ease-in-out, opacity 1.5s ease-in-out';
      star.innerHTML = `
        <polygon points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18 5.5,22 7,14.5 2,9.5 9,9" fill="${color}"/>
      `;
      container.appendChild(star);
      stars.push(star);
    }

    // No teleports; smooth looping via CSS animations
    return () => {};
  }, [baseColor, colors, numStars]);

  return <div ref={containerRef} className="starfield-container"></div>;
};

export default Starfield;
