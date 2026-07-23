import React from 'react';

const useSidebarCollapse = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    // Only use localStorage on large screens
    if (window.innerWidth > 992) {
      return JSON.parse(localStorage.getItem('sidebar-collapsed')) || false;
    }
    return false; // Always expanded on smaller screens
  });

  const [isLargeScreen, setIsLargeScreen] = React.useState(window.innerWidth > 992);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      const largeScreen = window.innerWidth > 992;
      setIsLargeScreen(largeScreen);
      
      if (!largeScreen) {
        // Force expanded state on smaller screens
        setIsCollapsed(false);
      } else {
        // Restore saved state on large screens
        const savedState = JSON.parse(localStorage.getItem('sidebar-collapsed')) || false;
        setIsCollapsed(savedState);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapse = () => {
    if (isLargeScreen) {
      setIsCollapsed((prev) => {
        const newState = !prev;
        localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
        return newState;
      });
    }
  };

  const setCollapse = (state) => {
    if (isLargeScreen) {
      setIsCollapsed(state);
      localStorage.setItem('sidebar-collapsed', JSON.stringify(state));
    }
  };

  return [isCollapsed, toggleCollapse, isLargeScreen, setCollapse];
};

export default useSidebarCollapse;