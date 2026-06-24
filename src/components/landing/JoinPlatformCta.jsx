import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMsUntilPlatformLaunch, isPlatformLaunched } from '../../utils/platformLaunch';

const JoinPlatformCta = ({
  className = 'a3d-join-btn',
  onWaitlistOpen,
  onAfterClick,
  style,
  ...rest
}) => {
  const navigate = useNavigate();
  const [launched, setLaunched] = useState(() => isPlatformLaunched());

  useEffect(() => {
    setLaunched(isPlatformLaunched());
    if (isPlatformLaunched()) return undefined;

    const timer = setTimeout(() => setLaunched(true), getMsUntilPlatformLaunch());
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (event) => {
    if (launched) {
      navigate('/signup');
    } else {
      onWaitlistOpen?.();
    }
    onAfterClick?.(event);
  };

  return (
    <button type="button" className={className} onClick={handleClick} style={style} {...rest}>
      {launched ? 'Join Platform' : 'Join Waitlist'}
    </button>
  );
};

export default JoinPlatformCta;
