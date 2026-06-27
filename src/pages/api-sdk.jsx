import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ApiSdk.css';

import launchingSoonIcon from '../assets/api-sdk/icons/launchingsoonicon.svg';
import blurStarIcon from '../assets/api-sdk/icons/blurstar.svg';
import textToPromptIcon from '../assets/api-sdk/icons/texttoprompticon.svg';
import imgTo3dIcon from '../assets/api-sdk/icons/imgto3dicon.svg';
import videoTo3dIcon from '../assets/api-sdk/icons/videoto3dicon.svg';
import modelEditorIcon from '../assets/api-sdk/icons/3dmodeleditoricon.svg';
import restApiIcon from '../assets/api-sdk/icons/restapiicon.svg';
import javascriptIcon from '../assets/api-sdk/icons/javascripticon.svg';
import pythonIcon from '../assets/api-sdk/icons/pythonicon.svg';
import iosIcon from '../assets/api-sdk/icons/iosicon.svg';
import androidIcon from '../assets/api-sdk/icons/andriodicon.svg';
import unityIcon from '../assets/api-sdk/icons/unityicon.svg';
import pythonCodeImg from '../assets/api-sdk/icons/pythoncodeimg.png';
import javascriptCodeImg from '../assets/api-sdk/icons/javascriptcodeimg.png';
import notificationIcon from '../assets/api-sdk/icons/notificationicon.png';

const API_FEATURES = [
  {
    id: 'text',
    title: 'Text Prompt API',
    description:
      'Generate 3D models from text descriptions using natural language processing',
    icon: textToPromptIcon,
  },
  {
    id: 'image',
    title: 'Image to 3D API',
    description:
      'Convert single or multiple images into stunning 3D models with our advanced AI algorithms',
    icon: imgTo3dIcon,
  },
  {
    id: 'video',
    title: 'Video to 3D API',
    description:
      'Transform videos into interactive 3D models with frame-by-frame analysis',
    icon: videoTo3dIcon,
  },
  {
    id: 'editor',
    title: '3D Model Editor SDK',
    description:
      'Powerful editing tools and SDK for modifying and enhancing generated models',
    icon: modelEditorIcon,
  },
];

const INTEGRATIONS = [
  { id: 'rest', label: 'REST API', icon: restApiIcon },
  { id: 'js', label: 'JavaScript', icon: javascriptIcon },
  { id: 'python', label: 'Python', icon: pythonIcon },
  { id: 'ios', label: 'iOS', icon: iosIcon },
  { id: 'android', label: 'Android', icon: androidIcon },
  { id: 'unity', label: 'Unity', icon: unityIcon },
];

const MOBILE_SLIDER_MQ = '(max-width: 640px)';
const AUTO_SLIDE_MS = 4500;

const ApiSdkPage = () => {
  const featuresGridRef = useRef(null);
  const activeFeatureRef = useRef(0);
  const pauseAutoSlideRef = useRef(() => {});
  const [activeFeature, setActiveFeature] = useState(0);

  const updateActiveFeature = useCallback(() => {
    const grid = featuresGridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll('.apisdk-feature-card');
    if (!cards.length) return;

    const gridCenter = grid.scrollLeft + grid.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(gridCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveFeature(closestIndex);
  }, []);

  const scrollToFeature = useCallback((index) => {
    const grid = featuresGridRef.current;
    const card = grid?.querySelectorAll('.apisdk-feature-card')[index];
    if (!card) return;

    card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    setActiveFeature(index);
  }, []);

  const handleDotClick = (index) => {
    pauseAutoSlideRef.current();
    scrollToFeature(index);
  };

  useEffect(() => {
    activeFeatureRef.current = activeFeature;
  }, [activeFeature]);

  useEffect(() => {
    const grid = featuresGridRef.current;
    if (!grid) return undefined;

    grid.addEventListener('scroll', updateActiveFeature, { passive: true });
    window.addEventListener('resize', updateActiveFeature);

    return () => {
      grid.removeEventListener('scroll', updateActiveFeature);
      window.removeEventListener('resize', updateActiveFeature);
    };
  }, [updateActiveFeature]);

  useEffect(() => {
    updateActiveFeature();
  }, [updateActiveFeature]);

  useEffect(() => {
    const grid = featuresGridRef.current;
    if (!grid) return undefined;

    const mobileQuery = window.matchMedia(MOBILE_SLIDER_MQ);
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let slideTimer = null;
    let resumeTimer = null;
    let isPaused = false;

    const clearSlideTimer = () => {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    };

    const clearResumeTimer = () => {
      if (resumeTimer) {
        clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    };

    const pauseAutoSlide = (resumeMs = AUTO_SLIDE_MS * 2) => {
      isPaused = true;
      clearResumeTimer();
      resumeTimer = setTimeout(() => {
        isPaused = false;
      }, resumeMs);
    };

    pauseAutoSlideRef.current = pauseAutoSlide;

    const startAutoSlide = () => {
      clearSlideTimer();
      if (!mobileQuery.matches || reducedMotionQuery.matches) return;

      slideTimer = setInterval(() => {
        if (isPaused) return;
        const nextIndex = (activeFeatureRef.current + 1) % API_FEATURES.length;
        scrollToFeature(nextIndex);
      }, AUTO_SLIDE_MS);
    };

    const handleUserInteract = () => pauseAutoSlide();

    const handleMediaChange = () => {
      isPaused = false;
      clearResumeTimer();
      startAutoSlide();
    };

    grid.addEventListener('touchstart', handleUserInteract, { passive: true });
    grid.addEventListener('mousedown', handleUserInteract);
    mobileQuery.addEventListener('change', handleMediaChange);
    reducedMotionQuery.addEventListener('change', handleMediaChange);

    startAutoSlide();

    return () => {
      clearSlideTimer();
      clearResumeTimer();
      grid.removeEventListener('touchstart', handleUserInteract);
      grid.removeEventListener('mousedown', handleUserInteract);
      mobileQuery.removeEventListener('change', handleMediaChange);
      reducedMotionQuery.removeEventListener('change', handleMediaChange);
      pauseAutoSlideRef.current = () => {};
    };
  }, [scrollToFeature]);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    const style = document.createElement('style');
    style.id = 'hide-scrollbar-style';
    style.innerHTML = `
      html, body {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      html::-webkit-scrollbar,
      body::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `;

    const existingStyle = document.getElementById('hide-scrollbar-style');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById('hide-scrollbar-style');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);

  return (
    <div className="apisdk-landing">
      <section className="apisdk-hero">
        <div className="apisdk-soon-badge">
          <img src={launchingSoonIcon} alt="" aria-hidden="true" />
          Launching Soon
        </div>

        <h1 className="apisdk-hero-title">
          Power Up with <span className="apisdk-accent">API &amp; SDK</span>
        </h1>

        <p className="apisdk-hero-desc">
          Powerful APIs and SDKs to integrate A3D&apos;s advanced 3D generation
          capabilities directly into your applications
        </p>
      </section>

      <section className="apisdk-features" aria-label="API features">
        <div className="apisdk-features-shell">
          <div
            className="apisdk-features-grid"
            ref={featuresGridRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="API feature cards"
          >
            {API_FEATURES.map(({ id, title, description, icon }, index) => (
              <article
                key={id}
                className="apisdk-feature-card"
                aria-label={`${index + 1} of ${API_FEATURES.length}: ${title}`}
              >
                <div className="apisdk-feature-card-glow" aria-hidden="true" />

                <img
                  className="apisdk-sparkle apisdk-sparkle--tl"
                  src={blurStarIcon}
                  alt=""
                  aria-hidden="true"
                />
                <img
                  className="apisdk-sparkle apisdk-sparkle--tr"
                  src={blurStarIcon}
                  alt=""
                  aria-hidden="true"
                />

                <div className="apisdk-feature-content">
                  <h2 className="apisdk-feature-title">{title}</h2>
                  <p className="apisdk-feature-desc">{description}</p>
                </div>

                <div className="apisdk-feature-icon-wrap">
                  <div className="apisdk-feature-icon-box">
                    <img className="apisdk-feature-icon" src={icon} alt="" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="apisdk-features-dots">
            {API_FEATURES.map(({ id }, index) => (
              <button
                key={id}
                type="button"
                className={`apisdk-features-dot${activeFeature === index ? ' is-active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Show feature ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="apisdk-integration">
        <h2 className="apisdk-integration-title">
          Multiple <span className="apisdk-accent">Integration</span> Options
        </h2>
        <p className="apisdk-integration-desc">
          Choose the perfect integration method for your platform and development stack
        </p>

        <div className="apisdk-integration-grid">
          {INTEGRATIONS.map(({ id, label, icon }) => (
            <div key={id} className="apisdk-integration-badge">
              <img className="apisdk-integration-icon" src={icon} alt="" />
              <span className="apisdk-integration-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="apisdk-code-samples" aria-label="Code examples">
        <div className="apisdk-code-grid">
          <img
            className="apisdk-code-img"
            src={pythonCodeImg}
            alt="Python API example code"
          />
          <img
            className="apisdk-code-img"
            src={javascriptCodeImg}
            alt="JavaScript SDK example code"
          />
        </div>
      </section>

      <section className="apisdk-updates" aria-label="Launch updates">
        <div className="apisdk-updates-card">
          <div className="apisdk-updates-icon-wrap" aria-hidden="true">
            <img className="apisdk-updates-icon" src={notificationIcon} alt="" />
          </div>

          <h2 className="apisdk-updates-title">
            Want <span className="apisdk-accent">Launch</span> Updates?
          </h2>

          <p className="apisdk-updates-desc">
            Stay informed and be the first to know when our API and SDK are officially
            released.
          </p>

          <button type="button" className="apisdk-updates-btn">
            Notify Me
          </button>
        </div>
      </section>
    </div>
  );
};

export default ApiSdkPage;
