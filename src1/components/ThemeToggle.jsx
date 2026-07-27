import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, isSystemTheme, toggleTheme, setSystemTheme, setManualTheme } = useTheme();
  const [showOptions, setShowOptions] = useState(false);

  const handleSystemTheme = () => {
    setSystemTheme();
    setShowOptions(false);
  };

  const handleManualTheme = (newTheme) => {
    setManualTheme(newTheme);
    setShowOptions(false);
  };

  const getThemeIcon = () => {
    if (isSystemTheme) {
      return <FiMonitor size={20} />;
    }
    return theme === 'dark' ? <FiMoon size={20} /> : <FiSun size={20} />;
  };

  const getThemeText = () => {
    if (isSystemTheme) {
      return 'System';
    }
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <div className="theme-toggle-container" style={{ position: 'relative' }}>
      <button
        className="theme-toggle-btn"
        onClick={() => setShowOptions(!showOptions)}
        style={{
          background: 'none',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: 'inherit',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'var(--hover-bg)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        {getThemeIcon()}
        <span>{getThemeText()}</span>
      </button>

      {showOptions && (
        <div
          className="theme-options-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: 'var(--dropdown-shadow)',
            padding: '8px 0',
            minWidth: '160px',
            zIndex: 1000,
            marginTop: '4px',
          }}
        >
          <button
            className="theme-option"
            onClick={handleSystemTheme}
            style={{
              width: '100%',
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: 'inherit',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--hover-bg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <FiMonitor size={16} />
            <span>System</span>
            {isSystemTheme && (
              <span style={{ marginLeft: 'auto', color: '#DE3996' }}>✓</span>
            )}
          </button>

          <button
            className="theme-option"
            onClick={() => handleManualTheme('light')}
            style={{
              width: '100%',
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: 'inherit',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--hover-bg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <FiSun size={16} />
            <span>Light</span>
            {!isSystemTheme && theme === 'light' && (
              <span style={{ marginLeft: 'auto', color: '#DE3996' }}>✓</span>
            )}
          </button>

          <button
            className="theme-option"
            onClick={() => handleManualTheme('dark')}
            style={{
              width: '100%',
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: 'inherit',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--hover-bg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <FiMoon size={16} />
            <span>Dark</span>
            {!isSystemTheme && theme === 'dark' && (
              <span style={{ marginLeft: 'auto', color: '#DE3996' }}>✓</span>
            )}
          </button>
        </div>
      )}

      {/* Click outside to close */}
      {showOptions && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
};

export default ThemeToggle;
