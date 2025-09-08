import React, { useState, useEffect } from 'react';
import IconifyIcon from 'components/base/IconifyIcon';
import './ThemeToggle.css';

const ThemeToggle = () => {
  // Detect system theme
  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  // Only load localStorage theme if it exists
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : getSystemTheme();
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen for system theme changes, ONLY if user hasn't manually selected a theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = (e) => {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        setTheme(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, []);

  // User manually changes theme
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // persist user choice
  };

  return (
    <div className="theme-toggle">
      <button
        className={`toggle-btn ${theme === 'light' ? 'active' : ''}`}
        onClick={() => handleThemeChange('light')}
      >
        <IconifyIcon icon="solar:sun-bold" />
        <span>Light</span>
      </button>

      <button
        className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => handleThemeChange('dark')}
      >
        <IconifyIcon icon="solar:moon-bold" />
        <span>Dark</span>
      </button>
    </div>
  );
};

export default ThemeToggle;
