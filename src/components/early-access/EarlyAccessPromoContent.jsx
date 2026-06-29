import React, { useState, useEffect, useCallback } from 'react';
import { PRE_LAUNCH_END_AT } from '../../utils/platformLaunch';
import './EarlyAccessPromo.css';

const Pink = ({ children }) => <span className="ea-pink">{children}</span>;

export const EarlyAccessTitle = ({ as: Tag = 'h2', className = 'ea-title' }) => (
  <Tag className={className}>
    Get <Pink>Early Access</Pink> – Free for the <Pink>First 100 Users</Pink>
  </Tag>
);

export const EarlyAccessDescriptions = ({
  className = 'ea-desc',
  secondaryClassName = 'ea-desc ea-desc-secondary',
}) => (
  <>
    <p className={className}>
      Sign up now and <Pink>secure your spot</Pink>. The <Pink>first 100 users</Pink> receive a{' '}
      <Pink>free plan</Pink> with <Pink>50 AI-generated 3D model creations</Pink>.
    </p>
    <p className={secondaryClassName}>
      No waiting list. No invitation required. Create, explore, and experience the future of 3D content generation today.
    </p>
  </>
);

export const EarlyAccessCountdown = ({ className = 'ea-countdown' }) => {
  const calculateTimeLeft = useCallback(() => {
    const difference = PRE_LAUNCH_END_AT.getTime() - Date.now();

    if (difference <= 0) {
      return { days: 0, hours: 0, min: 0, sec: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      min: Math.floor((difference / 1000 / 60) % 60),
      sec: Math.floor((difference / 1000) % 60),
    };
  }, []);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const formatNumber = (num) => (num < 10 ? `0${num}` : num);

  return (
    <div className={className}>
      <div className="ea-timer-wrap">
        <div className="ea-time-unit">
          <div className="ea-time-box">{formatNumber(timeLeft.days)}</div>
          <span className="ea-time-label">DAYS</span>
        </div>
        <div className="ea-time-dots">:</div>
        <div className="ea-time-unit">
          <div className="ea-time-box">{formatNumber(timeLeft.hours)}</div>
          <span className="ea-time-label">HOURS</span>
        </div>
        <div className="ea-time-dots">:</div>
        <div className="ea-time-unit">
          <div className="ea-time-box">{formatNumber(timeLeft.min)}</div>
          <span className="ea-time-label">MIN</span>
        </div>
        <div className="ea-time-dots">:</div>
        <div className="ea-time-unit">
          <div className="ea-time-box">{formatNumber(timeLeft.sec)}</div>
          <span className="ea-time-label">SEC</span>
        </div>
      </div>
    </div>
  );
};
