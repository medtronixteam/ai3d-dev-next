import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import { Mail, Phone } from 'lucide-react';
import '../LandingPage.css';
import '../Service/bookDemo.css';
import './inquiry.css';
import './studentProgram.css';
import './inquiryMotion.css';
import Fb from '../../assets/icon/Fb.svg';
import Ln from '../../assets/service/LN.svg';
import elipse from '../../pages/images/heading_ellipse.png';
import logo from '../../pages/images/logo.png';
import line from '../../pages/images/line.png';
import dot from '../../pages/images/do.png';
import arrow from '../../pages/images/arri.png';
import DemoBg from '../../assets/service/DemoBg.svg';
import WaitlistModal from '../../components/popup/WaitlistModal';
import JoinPlatformCta from '../../components/landing/JoinPlatformCta';
import FooterLangCurrency from '../../components/footer/FooterLangCurrency';

const DOT_CONFIG = [
  { top: '8%', left: '3%', size: 4, delay: 0, duration: 5.2, color: '#de3996' },
  { top: '14%', left: '11%', size: 3, delay: 0.8, duration: 6.1, color: '#de3996' },
  { top: '6%', left: '22%', size: 5, delay: 1.4, duration: 4.8, color: '#a052b5' },
  { top: '20%', left: '7%', size: 3, delay: 2.1, duration: 7.0, color: '#ff85ca' },
  { top: '28%', left: '17%', size: 4, delay: 0.3, duration: 5.5, color: '#de3996' },
  { top: '10%', left: '33%', size: 3, delay: 1.7, duration: 6.3, color: '#a052b5' },
  { top: '35%', left: '4%', size: 5, delay: 0.6, duration: 4.9, color: '#de3996' },
  { top: '8%', left: '55%', size: 3, delay: 0.7, duration: 6.5, color: '#ff85ca' },
  { top: '24%', left: '63%', size: 5, delay: 1.3, duration: 5.4, color: '#de3996' },
  { top: '12%', left: '72%', size: 3, delay: 2.2, duration: 7.1, color: '#a052b5' },
  { top: '20%', left: '88%', size: 5, delay: 0.2, duration: 4.7, color: '#de3996' },
  { top: '45%', left: '90%', size: 4, delay: 1.2, duration: 6.8, color: '#de3996' },
];

const COPY = {
  enterprise: {
    titleBefore: '',
    accent: 'Enterprise',
    titleAfter: ' Inquiry',
    subtitle:
      'Share your team size, usage, and requirements so we can prepare the right storage, processing, and support plan.',
    stats: ['Custom pricing', 'Priority processing', 'Private storage', 'Dedicated support'],
  },
  student: {
    titleBefore: '',
    accent: 'Student',
    titleAfter: ' Program',
    subtitle:
      'Get academic access for projects, research, and learning. Apply with your university email and student ID.',
    stats: ['University verified', 'Academic projects', 'Thesis & research', 'Quick review'],
  },
};

const InquiryPageLayout = ({ variant, children }) => {
  const location = useLocation();
  const landingRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const copy = COPY[variant];

  useEffect(() => {
    const container = landingRef.current;
    if (!container) return;
    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 30);
      setShowScrollTop(container.scrollTop > 300);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    landingRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div ref={landingRef} className={`landing-page-section ai_3d_landing inq-page ${variant === 'student' ? 'stu-program' : ''}`}>
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            className="scroll-to-top"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => landingRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              zIndex: 9999,
              cursor: 'pointer',
              backgroundColor: '#de3996',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 15px rgba(222, 57, 150, 0.4)',
              border: '2px solid white',
            }}
          >
            <FaArrowUp color="white" size={20} />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="bd-hero-wrap">
        <div className="bd-bg">
          <div className="bd-bg-gradient" />
          {DOT_CONFIG.map((item, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                top: item.top,
                left: item.left,
                width: `${item.size}px`,
                height: `${item.size}px`,
                borderRadius: '50%',
                background: item.color,
                animation: `${i % 3 === 0 ? 'bd-dot-twinkle' : 'bd-dot-float'} ${item.duration}s ease-in-out ${item.delay}s infinite`,
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          ))}
        </div>

        <div className="ai_3d_landing" style={{ position: 'relative', zIndex: 10 }}>
          <main className="container py-sm-4 pt-4">
            <header
              className={`a3d-header container-fluid mb-4 a3d-fade-in ${isScrolled ? 'a3d-header-scrolled' : ''}`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <Link to="/" className="a3d-header-logo-link">
                  <img src={logo} alt="Logo" className="a3d-header-logo" />
                </Link>
                <button
                  className="navbar-toggler d-lg-none border-0"
                  type="button"
                  onClick={() => setIsOpen(true)}
                >
                  <i className="fas fa-bars" />
                </button>
                <nav className="d-none d-lg-flex gap-lg-3 gap-xl-4">
                  <Link to="/" className={`a3d-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                    Home
                  </Link>
                  <Link to="https://calendly.com/arslan-medtronix/30min" className="a3d-nav-link">
                    Schedule Meeting
                  </Link>
                  <Link
                    to="/generate"
                    className={`a3d-nav-link ${location.pathname.startsWith('/generate') ? 'active' : ''}`}
                  >
                    Generate
                  </Link>
                  <Link
                    to="/3dio/api-sdk"
                    className={`a3d-nav-link ${location.pathname === '/3dio/api-sdk' ? 'active' : ''}`}
                  >
                    API & Pricing
                  </Link>
                  <a href="/#Leadership" className="a3d-nav-link">
                    Leadership
                  </a>
                </nav>
                <div className="d-none d-lg-flex gap-2 align-items-center">
                  <Link to="/book-demo">
                    <button className="a3d-book-demo-btn">Book a Demo</button>
                  </Link>
                  <JoinPlatformCta onWaitlistOpen={() => setIsWaitlistOpen(true)} />
                </div>
              </div>
            </header>
            <div className="a3d-header-offset" />
          </main>

          <div className={`mobile-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2">
              <Link to="/" className="a3d-header-logo-link">
                <img src={logo} alt="Logo" className="a3d-header-logo" />
              </Link>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <nav className="d-flex flex-column gap-2 px-3 pb-3">
              <Link to="/" className={`a3d-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
              <Link to="https://calendly.com/arslan-medtronix/30min" className="a3d-nav-link">
                Schedule Meeting
              </Link>
              <Link
                to="/generate"
                className={`a3d-nav-link ${location.pathname.startsWith('/generate') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Generate
              </Link>
              <Link
                to="/3dio/api-sdk"
                className={`a3d-nav-link ${location.pathname === '/3dio/api-sdk' ? 'active' : ''}`}
              >
                API & Pricing
              </Link>
              <a href="/#Leadership" className="a3d-nav-link">
                Leadership
              </a>
              <div className="d-flex flex-column gap-2">
                <Link to="/book-demo">
                  <button className="a3d-book-demo-btn">Book a Demo</button>
                </Link>
                <JoinPlatformCta
                  onWaitlistOpen={() => setIsWaitlistOpen(true)}
                  onAfterClick={() => setIsOpen(false)}
                />
              </div>
            </nav>
          </div>
          {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
        </div>

        <div className="bd-hero-content">
          <h1 className="bd-hero-title">
            {copy.titleBefore}
            <span className="ctc-arch-wrap">
              <img src={elipse} alt="" className="book-arch" />
              {copy.accent}
            </span>
            {copy.titleAfter}
          </h1>
          <p className="bd-hero-subtitle">{copy.subtitle}</p>
          {variant !== 'student' ? (
            <div className="bd-stats-row">
              {copy.stats.map((label) => (
                <div className="bd-stat-item" key={label}>
                  <span className="bd-stat-label">
                    {label}
                    <span className="bd-stat-sep ms-1">✦</span>
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="bd-card-section">
        <img src={DemoBg} alt="" className="bd-demo-bg" aria-hidden="true" />
        <div className="bd-card">
          {variant !== 'student' && (
          <div className="bd-top-bar">
            <div className="bd-top-contacts">
              <div className="bd-contact-chip">
                <span className="bd-contact-icon">
                  <Mail size={14} color="#de3996" />
                </span>
                <div className="d-flex flex-column">
                  <span className="bd-contact-label">Email</span>
                  <Link
                    to="https://mail.google.com/mail/?view=cm&fs=1&to=contact@ai3dscanning.com"
                    target="_blank"
                    className="bd-contact-value"
                  >
                    contact@ai3dscanning.com
                  </Link>
                </div>
              </div>
            </div>
            <div style={{ width: '1px', height: '22px', background: '#0000001A' }} />
            <div className="bd-contact-chip">
              <span className="bd-contact-icon">
                <Phone size={14} color="#de3996" />
              </span>
              <div className="d-flex flex-column">
                <span className="bd-contact-label">Phone</span>
                <span className="bd-contact-value">+923443228863 , +12088076899</span>
              </div>
            </div>
            <div style={{ width: '1px', height: '22px', background: '#0000001A' }} />
            <div className="bd-top-social">
              <span className="bd-social-label">Follow us</span>
              <a
                href="https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="bd-social-btn"
                aria-label="Facebook"
              >
                <img src={Fb} alt="fb" width="18" height="18" />
              </a>
              <a
                href="https://www.instagram.com/ai3d_scanning_solutions?igshid=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noreferrer"
                className="bd-social-btn"
                aria-label="Instagram"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#de3996"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="#de3996" stroke="none" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/ai3d-scanning-solutions-inc/?"
                target="_blank"
                rel="noreferrer"
                className="bd-social-btn"
                aria-label="LinkedIn"
              >
                <img src={Ln} alt="linkedin" width="18" height="18" />
              </a>
            </div>
          </div>
          )}
          <div className="inq-form-card">{children}</div>
        </div>
      </section>

      <div className="aithreed">
        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <div className="logo">
                  <img src={logo} alt="Logo" />
                </div>
                <p className="desc">
                  AI 3D Scanning Solutions transforms photos, videos, and real-world objects into
                  high-precision 3D models instantly and without expensive hardware. Our platform
                  offers creation, editing, and a vast 3D content library, all powered by cutting
                  edge AI. From individuals to enterprises, we make 3D accessible, scalable, and
                  secure.
                </p>
                <div className="alldiv">
                  <div className="btn-wrapper">
                    <Link to="/contributor/program">
                      <button className="btn btn-custom Sell">Sell your 3D Models</button>
                    </Link>
                  </div>
                  <FooterLangCurrency />
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-6 txcenter top">
                <h6>Quick Links</h6>
                <div className="relative">
                  <img width="61px" src={line} alt="Line" />
                  <img src={dot} alt="Dot" className="posotion" />
                </div>
                <ul className="mt-1">
                  {['Home', 'Services', 'Pricing', 'Student'].map((item) => (
                    <li key={item}>
                      <a
                        href={
                          item === 'Pricing'
                            ? '/3dio/subscription'
                            : item === 'Services'
                              ? '/service'
                              : item === 'Student'
                                ? '/student-program'
                                : '/'
                        }
                      >
                        <img
                          className="iconsize me-1"
                          src={arrow}
                          alt="Arrow"
                          style={{ verticalAlign: 'middle' }}
                        />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-lg-2 col-md-4 col-6 top">
                <h6>Support</h6>
                <div className="relative">
                  <img width="61px" src={line} alt="Line" />
                  <img src={dot} alt="Dot" className="posotion" />
                </div>
                <ul className="mt-1">
                  {['Help Center', 'FAQ'].map((item) => (
                    <li key={item}>
                      <a href={item === 'FAQ' ? '/#FAQs' : '/#help'}>
                        <img
                          className="iconsize me-1"
                          src={arrow}
                          alt="Arrow"
                          style={{ verticalAlign: 'middle' }}
                        />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-lg-2 col-md-4 col-6 bottom padd">
                <h6>Follow</h6>
                <div className="relative">
                  <img width="61px" src={line} alt="Line" />
                  <img src={dot} alt="Dot" className="posotion" />
                </div>
                <ul className="mt-1">
                  {[
                    {
                      name: 'LinkedIn',
                      url: 'https://www.linkedin.com/company/ai3d-scanning-solutions-inc/?',
                    },
                    {
                      name: 'Instagram',
                      url: 'https://www.instagram.com/ai3d_scanning_solutions?igshid=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr',
                    },
                    {
                      name: 'Threads',
                      url: 'https://www.threads.net/@ai3d_scanning_solutions',
                    },
                    {
                      name: 'Facebook',
                      url: 'https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr',
                    },
                  ].map((item) => (
                    <li key={item.name}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <img
                          className="iconsize me-1"
                          src={arrow}
                          alt="Arrow"
                          style={{ verticalAlign: 'middle' }}
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-lg-2 col-md-4 col-6 bottom p-0 contact mt-md-0 mt-4">
                <h6>Get In Touch</h6>
                <div className="relative">
                  <img width="61px" src={line} alt="Line" />
                  <img src={dot} alt="Dot" className="posotion" />
                </div>
                <div className="contact">
                  <ul className="mt-lg-2 mt-0">
                    <li>
                      <span className="colorc">Email: </span>
                      <br />
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@ai3dscanning.com"
                        target="_blank"
                        className="mt-1"
                        rel="noopener noreferrer"
                      >
                        contact@ai3dscanning.com
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <span className="colorc">Phone: </span>
                        <br />
                        <br />
                        +923443228863 , +12088076899
                      </a>
                    </li>
                    <li>
                      <a href="#" className=" my-0">
                        <span className="colorc">Address: </span> <br />
                        <br /> 3765 W Dublin Dr, Eagle, Idaho 83616, USA
                      </a>
                      <a href="#" className="mt-1">
                        H 167/B, Gol Chakar, Sahiwal, Pakistan 57000
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="social-icons d-md-block d-none ">
                  <a
                    href="https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bx bxl-facebook" />
                  </a>
                  <a href="https://x.com/ai3dscanning" target="_blank" rel="noreferrer">
                    <i className="bx bxl-twitter" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/ai3d-scanning-solutions-inc/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bx bxl-linkedin" />
                  </a>
                  <a
                    href="https://www.instagram.com/ai3d_scanning_solutions?igsh=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bx bxl-instagram" />
                  </a>
                </div>
              </div>

              <div className="social-icons  d-md-none d-block d-flex justify-content-center mt-3">
                <a
                  href="https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bx bxl-facebook" />
                </a>
                <a href="https://x.com/ai3dscanning" target="_blank" rel="noreferrer">
                  <i className="bx bxl-twitter" />
                </a>
                <a
                  href="https://www.linkedin.com/company/ai3d-scanning-solutions-inc/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bx bxl-linkedin" />
                </a>
                <a
                  href="https://www.instagram.com/ai3d_scanning_solutions?igsh=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bx bxl-instagram" />
                </a>
              </div>
            </div>
            <hr />
            <p className="copyright">Copyright © Powered by AI 3D Scanning Solutions Inc.</p>
          </div>
        </footer>
      </div>
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </div>
  );
};

export default InquiryPageLayout;
