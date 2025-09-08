import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isSystemTheme, setIsSystemTheme] = useState(false);

  // Function to detect system theme preference
  const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  // Function to apply theme to document
  const applyTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  // Function to toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setIsSystemTheme(false);
    applyTheme(newTheme);
  };

  // Function to set system theme
  const setSystemTheme = () => {
    setIsSystemTheme(true);
    const systemTheme = getSystemTheme();
    applyTheme(systemTheme);
  };

  // Function to set manual theme
  const setManualTheme = (newTheme) => {
    setIsSystemTheme(false);
    applyTheme(newTheme);
  };

  useEffect(() => {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const savedSystemTheme = localStorage.getItem('isSystemTheme') === 'true';

    if (savedSystemTheme) {
      // User prefers system theme
      setIsSystemTheme(true);
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);
    } else if (savedTheme) {
      // User has a manual theme preference
      setIsSystemTheme(false);
      applyTheme(savedTheme);
    } else {
      // First time user, use system theme
      setIsSystemTheme(true);
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (isSystemTheme) {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        applyTheme(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Listen for theme changes from other tabs
    const handleStorageChange = (event) => {
      if (event.key === 'theme') {
        const newTheme = event.newValue || 'light';
        if (!isSystemTheme) {
          setTheme(newTheme);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isSystemTheme]);

  // Save system theme preference
  useEffect(() => {
    localStorage.setItem('isSystemTheme', isSystemTheme.toString());
  }, [isSystemTheme]);

  const value = {
    theme,
    isSystemTheme,
    toggleTheme,
    setSystemTheme,
    setManualTheme,
    getSystemTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};




