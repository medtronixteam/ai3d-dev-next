// src/components/effects/Starfield.jsx
import React, { useEffect, useRef } from 'react';
import './Starfield.css';

const STAR_COLORS = [
  '#fff', // white
  '#ffe6f3', // pink
  '#e0e7ff', // blue
  '#fffbe6', // yellowish
  '#fbe5f7', // soft pink
  '#eaf1ff', // soft blue
];

const Starfield = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const numStars = 60;
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < numStars; i++) {
      const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const size = 10 + Math.random() * 10;
      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      star.setAttribute('width', size);
      star.setAttribute('height', size);
      star.setAttribute('viewBox', '0 0 24 24');
      star.style.position = 'absolute';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.opacity = `${0.6 + Math.random() * 0.4}`;
      star.style.filter = `drop-shadow(0 0 8px ${color}88)`;
      star.style.animation = `star-twinkle 1.5s ease-in-out infinite, star-float ${2 + Math.random() * 3}s ease-in-out infinite`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      star.innerHTML = `
        <polygon points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18 5.5,22 7,14.5 2,9.5 9,9" fill="${color}"/>
      `;
      container.appendChild(star);
    }
  }, []);

  return <div ref={containerRef} className="starfield-container"></div>;
};

export default Starfield;
