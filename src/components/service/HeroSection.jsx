import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../pages/images/logo.png';
import elipse from '../../pages/images/heading_ellipse.png';
import WaitlistModal from '../../components/popup/WaitlistModal';

const TICKER_ITEMS = [
  'AI Development',
  'Flutter Apps',
  'Web Development',
  'Desktop App Development',
  'Bus. Dev. & Consulting',
  'Creative Media',
  '3D Scanning',
  'AR / VR Solutions',
];

const STATS = [
  { number: '100', suffix: '+',  label: 'Happy Client' },
  { number: '30',  suffix: '+',  label: 'Amazing Engineers' },
  { number: '98',  suffix: '%',  label: 'On-time Delivery' },
  { number: '24',  suffix: '/7', label: 'Support Available' },
];

const DOT_CONFIG = [
  { top: '8%',  left: '3%',   size: 4, delay: 0,    duration: 5.2, color: '#de3996' },
  { top: '14%', left: '11%',  size: 3, delay: 0.8,  duration: 6.1, color: '#de3996' },
  { top: '6%',  left: '22%',  size: 5, delay: 1.4,  duration: 4.8, color: '#a052b5' },
  { top: '20%', left: '7%',   size: 3, delay: 2.1,  duration: 7.0, color: '#ff85ca' },
  { top: '28%', left: '17%',  size: 4, delay: 0.3,  duration: 5.5, color: '#de3996' },
  { top: '10%', left: '33%',  size: 3, delay: 1.7,  duration: 6.3, color: '#a052b5' },
  { top: '35%', left: '4%',   size: 5, delay: 0.6,  duration: 4.9, color: '#de3996' },
  { top: '42%', left: '14%',  size: 3, delay: 2.5,  duration: 5.8, color: '#ff85ca' },
  { top: '18%', left: '42%',  size: 4, delay: 1.1,  duration: 6.7, color: '#de3996' },
  { top: '50%', left: '6%',   size: 3, delay: 0.4,  duration: 5.1, color: '#a052b5' },
  { top: '58%', left: '18%',  size: 4, delay: 1.9,  duration: 4.6, color: '#de3996' },
  { top: '8%',  left: '55%',  size: 3, delay: 0.7,  duration: 6.5, color: '#ff85ca' },
  { top: '24%', left: '63%',  size: 5, delay: 1.3,  duration: 5.4, color: '#de3996' },
  { top: '12%', left: '72%',  size: 3, delay: 2.2,  duration: 7.1, color: '#a052b5' },
  { top: '38%', left: '58%',  size: 4, delay: 0.5,  duration: 5.9, color: '#de3996' },
  { top: '6%',  left: '82%',  size: 3, delay: 1.6,  duration: 6.2, color: '#ff85ca' },
  { top: '20%', left: '88%',  size: 5, delay: 0.2,  duration: 4.7, color: '#de3996' },
  { top: '30%', left: '78%',  size: 3, delay: 2.0,  duration: 5.6, color: '#a052b5' },
  { top: '45%', left: '90%',  size: 4, delay: 1.2,  duration: 6.8, color: '#de3996' },
  { top: '55%', left: '70%',  size: 3, delay: 0.9,  duration: 5.3, color: '#ff85ca' },
  { top: '62%', left: '85%',  size: 5, delay: 1.5,  duration: 4.5, color: '#de3996' },
  { top: '48%', left: '45%',  size: 3, delay: 2.3,  duration: 6.0, color: '#a052b5' },
  { top: '65%', left: '32%',  size: 4, delay: 0.1,  duration: 5.7, color: '#de3996' },
  { top: '70%', left: '55%',  size: 3, delay: 1.8,  duration: 6.4, color: '#ff85ca' },
  { top: '15%', left: '95%',  size: 4, delay: 2.4,  duration: 5.0, color: '#de3996' },
  { top: '52%', left: '27%',  size: 3, delay: 0.6,  duration: 7.2, color: '#a052b5' },
  { top: '75%', left: '10%',  size: 4, delay: 1.0,  duration: 5.5, color: '#de3996' },
  { top: '68%', left: '75%',  size: 3, delay: 1.4,  duration: 6.1, color: '#ff85ca' },
  { top: '40%', left: '96%',  size: 5, delay: 0.3,  duration: 4.8, color: '#de3996' },
  { top: '78%', left: '42%',  size: 3, delay: 2.1,  duration: 5.9, color: '#a052b5' },
];

const HeroSection = ({ scrollContainerRef }) => {
  const tickerLoop = [...TICKER_ITEMS, ...TICKER_ITEMS];
  const location   = useLocation();
  const [isOpen, setIsOpen]         = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef?.current;

    const handleScroll = () => {
      const scrollTop = container ? container.scrollTop : window.scrollY;
      setIsScrolled(scrollTop > 30);
    };

    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollContainerRef]);

  return (
    <>
      <style>{`
        @keyframes ssp-dot-float {
          0%,100% { transform: translateY(0px) scale(1);    opacity: 0.22; }
          50%      { transform: translateY(-8px) scale(1.2); opacity: 0.45; }
        }
        @keyframes ssp-dot-twinkle {
          0%,100% { opacity: 0.15; transform: scale(0.85); }
          50%      { opacity: 0.5;  transform: scale(1.3);  }
        }
        @keyframes ssp-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <section className="service-section-page-hero container-fluid">

        <div className="service-section-page-bg">
          <div className="service-section-page-bg-gradient" />
          {DOT_CONFIG.map((dot, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                top: dot.top, left: dot.left,
                width:  `${dot.size}px`,
                height: `${dot.size}px`,
                borderRadius: '50%',
                background: dot.color,
                animation: `${i % 3 === 0 ? 'ssp-dot-twinkle' : 'ssp-dot-float'} ${dot.duration}s ease-in-out ${dot.delay}s infinite`,
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          ))}
        </div>

        {/* navbar */}
        <div className="ai_3d_landing" style={{ position: 'relative', zIndex: 10 }}>
          <main className="container py-sm-4 pt-4">

            <header
              className={`a3d-header container-fluid mb-4 a3d-fade-in ${isScrolled ? 'a3d-header-scrolled' : ''}`}
            >
              <div className="d-flex justify-content-between align-items-center">

                <Link to="/">
                  <img src={logo} alt="Logo" style={{ width: '70%' }} />
                </Link>

                {/* Hamburger */}
                <button
                  className="navbar-toggler d-lg-none border-0"
                  type="button"
                  onClick={() => setIsOpen(true)}
                >
                  <i className="fas fa-bars" />
                </button>

                {/* Desktop Nav */}
                <nav className="d-none d-lg-flex gap-lg-3 gap-xl-4">
                  <Link to="/" className={`a3d-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                    Home
                  </Link>
                  <Link to="https://calendly.com/arslan-medtronix/30min" className="a3d-nav-link">
                    Schedule Meeting
                  </Link>
                  <Link to="/services" className={`a3d-nav-link ${location.pathname === '/services' ? 'active' : ''}`}>
                    Services
                  </Link>
                  <a href="/#3d-Sample"  className="a3d-nav-link">3D Samples</a>
                  <a href="/#Leadership" className="a3d-nav-link">Leadership</a>
                  {/* <a href="/referral"    className={`a3d-nav-link ${location.pathname === '/referral' ? 'active' : ''}`}>
                    Referral
                  </a> */}
                </nav>

                <div className="d-none d-lg-flex gap-2 align-items-center">
                  <Link to="/book-demo">
                    <button className="a3d-book-demo-btn">Book a Demo</button>
                  </Link>
                  <Link>
                    <button className="a3d-join-btn" onClick={() => setIsWaitlistOpen(true)}>Join Waitlist</button>
                  </Link>
                </div>

              </div>
            </header>

            <div className="a3d-header-offset" />

          </main>

          {/* Mobile Sidebar */}
          <div className={`mobile-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2">
              <Link to="/">
                <img src={logo} alt="Logo" style={{ width: '70%' }} />
              </Link>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <nav className="d-flex flex-column gap-2 px-3 pb-3">
              <Link to="/"        className={`a3d-nav-link ${location.pathname === '/'        ? 'active' : ''}`}>Home</Link>
              <Link to="https://calendly.com/arslan-medtronix/30min" className="a3d-nav-link">Schedule Meeting</Link>
              <Link to="/services" className={`a3d-nav-link ${location.pathname === '/services' ? 'active' : ''}`}>Services</Link>
              <a href="#3d-Sample"  className="a3d-nav-link">3D Samples</a>
              <a href="#Leadership" className="a3d-nav-link">Leadership</a>
              {/* <a href="/referral"   className={`a3d-nav-link ${location.pathname === '/referral' ? 'active' : ''}`}>Referral</a> */}
              <div className="d-flex flex-column gap-2">
                  <Link to="/book-demo">
                    <button className="a3d-book-demo-btn">Book a Demo</button>
                  </Link>
                  <Link>
                    <button className="a3d-join-btn" onClick={() => setIsWaitlistOpen(true)}>Join Waitlist</button>
                  </Link>
              </div>
            </nav>
          </div>

          {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
        </div>

        {/* ── Hero ── */}
        <div className="service-section-page-content">
          <h1 className="service-section-page-title">
            Expert <span className="ctc-arch-wrap">
            <img src={elipse} alt="elipse" className="hero-arch"  />
              3D
            </span> Scanning &amp;{' '}<br />AI Solutions
          </h1>
          <p className="service-section-page-subtitle">
            Whether you need a one-off project or a full-time dedicated engineering
            team — we've got the perfect model for your business.
          </p>
          <div className="service-section-page-cta-wrap">
            <a href="#contact" className="service-section-page-btn-primary">Get In Touch</a>
          </div>
          <div className="service-section-page-stats">
            {STATS.map((stat, i) => (
              <div className="service-section-page-stat-item" key={i}>
                <span className="service-section-page-stat-number">
                  {stat.number}<span>{stat.suffix}</span>
                </span>
                <span className="service-section-page-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Ticker ── */}
        <div className="service-section-page-ticker-wrap">
          <div
            className="service-section-page-ticker-track"
            style={{ animation: 'ssp-marquee 28s linear infinite' }}
          >
            {tickerLoop.map((item, i) => (
              <span className="service-section-page-ticker-item" key={i}>
                {item}
                <span className="service-section-page-ticker-sep">✦</span>
              </span>
            ))}
          </div>
        </div>

      </section>

      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </>
  );
};

export default HeroSection;