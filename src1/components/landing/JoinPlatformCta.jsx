import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import paths from '../../routes/paths';
import { getMsUntilPlatformLaunch, isPlatformLaunched } from '../../utils/platformLaunch';

const JoinPlatformCta = ({
  className = 'a3d-join-btn',
  onWaitlistOpen,
  onAfterClick,
  style,
  ...rest
}) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [launched, setLaunched] = useState(() => isPlatformLaunched());

  useEffect(() => {
    setLaunched(isPlatformLaunched());
    if (isPlatformLaunched()) return undefined;

    const timer = setTimeout(() => setLaunched(true), getMsUntilPlatformLaunch());
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (event) => {
    navigate('/3dio/');
    onAfterClick?.(event);
  };

  return (
    <button type="button" className={className} onClick={handleClick} style={style} {...rest}>
      Join Platform
    </button>
  );
};

export default JoinPlatformCta;
