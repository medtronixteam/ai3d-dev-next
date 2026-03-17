import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, useBlocker } from 'react-router-dom';

export function useRouteLeave(when, onLeave) {
  const navigate = useNavigate();
  const location = useLocation();
  const confirmedRef = useRef(false);

  // Block navigation when condition is true
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      when && currentLocation.pathname !== nextLocation.pathname && !confirmedRef.current
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirmLeave = window.confirm(
        'Changes that you made may not be saved!'
      );

      if (confirmLeave) {
        confirmedRef.current = true;
        
        // Call cleanup callback if provided
        if (onLeave) {
          onLeave();
        }
        
        // Proceed with navigation
        blocker.proceed();
      } else {
        // Reset the blocker
        blocker.reset();
      }
    }
  }, [blocker, onLeave]);

  // Reset confirmed flag when location changes
  useEffect(() => {
    confirmedRef.current = false;
  }, [location]);

  return blocker;
}