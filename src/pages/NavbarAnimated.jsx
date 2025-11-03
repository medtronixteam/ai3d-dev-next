import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const NavbarAnimated = () => {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // useEffect ko fix karen
  useEffect(() => {
    const handleScroll = () => {
      console.log('scrollY', window.scrollY);
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div></div>;
};

export default NavbarAnimated;
