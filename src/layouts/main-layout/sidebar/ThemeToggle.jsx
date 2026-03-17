import React, { useState, useEffect } from 'react';
import IconifyIcon from 'components/base/IconifyIcon';
import './ThemeToggle.css';

const ThemeToggle = () => {
  // Define the forced default theme
  const forcedDefaultTheme = 'dark'; // Change this to 'light' if you want to force light mode instead

  // Initialize state: Use saved theme from localStorage OR fallback to forced default
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || forcedDefaultTheme;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen for system theme changes
  // Only update the theme if the user hasn't manually selected one (i.e., no 'theme' in localStorage)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = (e) => {
      const savedTheme = localStorage.getItem('theme');
      // If user has NOT manually selected a theme, update based on system change
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
    localStorage.setItem('theme', newTheme); // Persist user's choice
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