import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Service.css';
import './LandingPage.css';
import logo from './images/logo.png';
import vera from './images/vera-ai.png';
import consulting from './images/consulting.png';
import elipse from './images/heading_ellipse.png';
import rightarrow from './images/mdi_arrow-right-thin.png';
import arrow2 from './images/arrow2.png';
import robot from './images/robot-2.png';
import google from './images/google-startups.png';
import googleCloud from './images/google-cloud.png';
import reginalPlan from './images/regional-plan.png';
import PITB from './images/PITB.png';
import world from './images/worl.png';
import line from './images/line.png';
import dot from './images/do.png';
import arrow from './images/arri.png';
import AiImg from '../assets/images/AI_Image.png';
import AppImg from '../assets/images/Flutter_Image.png';
import CreativeMedia from '../assets/images/Creative_Media.png';
import Business from './images/desktop.png';
import GraphicImg from '../assets/images/Website_Image.png';
import DesktopImg from '../assets/images/Desktop_Image.png';
import LeftArrow from '../assets/images/left-arrow.svg';
import HalfEllipse from '../assets/images/HalfEllipse.svg';
import { useMediaQuery } from 'react-responsive';
import Cards from '../components/Cards/Cards';
import Circle from './Animation/Circle';
import { FaChevronDown, FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import WaitlistModal from '../components/popup/WaitlistModal';
import JoinPlatformCta from '../components/landing/JoinPlatformCta';
import FooterLangCurrency from '../components/footer/FooterLangCurrency';
const Service = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { pathname, hash, key } = useLocation();
  const pills = [
    { label: 'AI Development', icon: rightarrow, target: "AI-Development" },
    { label: 'Flutter App', icon: rightarrow, target: "Flutter" },
    { label: 'Website Development', icon: rightarrow, target: "Website-Development" },
    { label: 'Desktop App', icon: rightarrow, target: "Desktop-App" },
    // { label: 'Manufacturing', icon: rightarrow },
    // { label: 'Health', icon: rightarrow },
  ];

  const pillsRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    if (!isMobile || !pillsRef.current) return;
    let scrollAmount = 0;
    const pillWidth = 130; // Approx width of one pill
    const interval = setInterval(() => {
      scrollAmount += pillWidth;
      if (scrollAmount >= pillsRef.current.scrollWidth - pillsRef.current.clientWidth) {
        scrollAmount = 0;
      }
      pillsRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isMobile]);

  const trustedLogos = [
    { src: google, alt: 'Google', style: { width: 130, marginTop: 6, marginRight: 5 } },
    { src: googleCloud, alt: 'Google Cloud', style: { width: 130, marginRight: 7 } },
    { src: PITB, alt: 'PITB', style: { width: 37, marginRight: 10 } },
    { src: reginalPlan, alt: 'regional-plan', style: { width: 66, marginRight: 10 } },
    { src: consulting, alt: 'consulting', style: { width: 76, marginRight: 10 } },
    { src: vera, alt: 'vera-ai', style: { width: 30 } },
  ];

  const trustedLogosRef = useRef(null);

  useEffect(() => {
    if (!isMobile || !trustedLogosRef.current) return;
    let scrollAmount = 0;
    const logoWidth = 140; // Approx width of one logo
    const interval = setInterval(() => {
      scrollAmount += logoWidth;
      if (
        scrollAmount >=
        trustedLogosRef.current.scrollWidth - trustedLogosRef.current.clientWidth
      ) {
        scrollAmount = 0;
      }
      trustedLogosRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isMobile]);

  useEffect(() => {
    // if not a hash link, scroll to top
    if (hash === '') {
      window.scrollTo(0, 0);
    }
    // else scroll to id
    else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
      }, 0);
    }
  }, [pathname, hash, key]);
  const landingRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);


  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const section = landingRef.current;
    if (!section) return;

    const handleScroll = () => {
      const scrollTop =
        section.scrollTop ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      // console.log("Section Scroll:", scrollTop);
      setIsScrolled(scrollTop > 30);
      setShowScrollTop(scrollTop > 300);
    };

    section.addEventListener("scroll", handleScroll);

    return () => section.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (landingRef.current) {
      landingRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };
  return (
    <>
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            className="scroll-to-top"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
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
              border: '2px solid white'
            }}
          >
            <FaArrowUp color="white" size={20} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="landing-page-section service-section-page ai_3d_landing" ref={landingRef}>
        <div className="main_head" style={{ backgroundColor: '#FFEDF7' }}>
          {/* <main className="container"> */}
          {/* </main> */}

          {/* ========================= Hero Section ======================= */}

          <section className="service-herosection">

            <main className="container py-4">

              {/* ========================= navbar ======================= */}

              <header
                className={`a3d-header container-fluid mb-4 a3d-fade-in ${isScrolled ? 'a3d-header-scrolled' : ''}`}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/" className="a3d-header-logo-link">
                    <img src={logo} alt="Logo" className="a3d-header-logo" />
                  </Link>

                  {/* Menu Button for Mobile */}

                  <button
                    className="navbar-toggler d-lg-none border-0"
                    type="button"
                    onClick={() => setIsOpen(true)}
                  >
                    <i className="fas fa-bars" />
                  </button>

                  {/* Desktop Nav */}

                  <nav className="d-none d-lg-flex gap-4">
                    <Link
                      to="/"
                      className={`a3d-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                      Home
                    </Link>

                    <a href="/#3d-Sample" className="a3d-nav-link">
                      3D Samples
                    </a>

                    <a href="/#Leadership" className="a3d-nav-link">
                      Leadership
                    </a>
                    <Link
                      to="/referral"
                      className={`a3d-nav-link ${location.pathname === '/referral' ? 'active' : ''}`}
                    >
                      Referral
                    </Link>
                    <a
                      href="#"
                      className="a3d-nav-link"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsWaitlistOpen(true);
                      }}
                    >
                      Wish List
                    </a>
                  </nav>

                  <div className="d-none d-lg-flex gap-3 align-items-center">
                    <JoinPlatformCta onWaitlistOpen={() => setIsWaitlistOpen(true)} />
                  </div>
                </div>
              </header>
              
              {/* Spacer to prevent content overlap */}
              <div className="a3d-header-offset"></div>
              {/* Mobile Sidebar */}

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
                  <Link
                    to="/"
                    className={`a3d-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                  >
                    Home
                  </Link>

                  <Link to="/#3d-Sample" className="a3d-nav-link">
                    3D Samples
                  </Link>

                  <Link to="/#Leadership" className="a3d-nav-link">
                    Leadership
                  </Link>
                  <Link
                    to="/referral"
                    className={`a3d-nav-link ${location.pathname === '/referral' ? 'active' : ''}`}
                  >
                    Referral
                  </Link>

                  <a
                    href="#"
                    className="a3d-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsWaitlistOpen(true);
                      setIsOpen(false);
                    }}
                  >
                    Wish List
                  </a>

                  {/* <Link to="/signin" className="a3d-nav-link">
                  Sign-In
                </Link> */}

                  <JoinPlatformCta
                    onWaitlistOpen={() => setIsWaitlistOpen(true)}
                    onAfterClick={() => setIsOpen(false)}
                  />
                </nav>
              </div>

              {/* Overlay for background click */}

              {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}

            </main>

            <motion.h1
              className="service-herosection-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Our Full Range of AI &{' '}
              <span>
                Software Services
                <img src={HalfEllipse} alt="icon" className="service-title-img" />
              </span>
            </motion.h1>

            <motion.p
              className="service-herosection-description"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              From concept to deployment, AI3D Scanning Solutions delivers end-to-end technology
              services that combine innovation, precision and scalability. Our expert team transform
              ideas into reality with cutting-edge design, development and customization solutions
              tailored to your business goals.
            </motion.p>

            <motion.div
              className="a3d-pills-scroll-service d-flex gap-3 my-4"
              id="pillSlider"
              ref={pillsRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                overflowX: isMobile ? 'auto' : 'visible',
                minHeight: 48,
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {pills.map((pill, idx) => (
                <div className="a3d-pill" key={pill.label} style={{ minWidth: 'auto' }}
                  onClick={() => {
                    const target = document.getElementById(pill.target)
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  <span>{pill.label}</span>
                  <img src={pill.icon} alt="" style={{ paddingTop: 2 }} />
                </div>
              ))}
            </motion.div>

            <div className="circle-cards-wrapper a3d-slide-up" style={{ animationDelay: '0.2s' }}>
              <Cards position="top" />
              <Circle />
              <Cards position="bottom" />
            </div>
          </section>

          {/* ========================= Hero Section End ======================= */}
        </div>

        {/* ========================= Service Content Section ======================= */}

        <section className="services-section">
          <h3 className="services-section2-title a3d-slide-up text-center">
            Our Full Range of {''}
            <span className="highlight-ai">
              {' '}
              AI
              <img src={elipse} alt="rainbow" className="services-rainbow-above" />
            </span>
            <br /> & Software Services
          </h3>

          <p className="service-herosection2-description a3d-slide-up" style={{ animationDelay: '0.2s' }}>
            From concept to deployment, AI3D Scanning Solutions delivers end-to-end technology
            services that combine innovation, precision and scalability. Our expert team transform
            ideas into reality with cutting-edge design, development and customization solutions
            tailored to your business goals.
          </p>

          <h6 className="services-description-sub a3d-slide-up text-center">
            We don't just build, we partner with you to create future ready products that drive
            growth and efficiency.
          </h6>

          {/* ========================= Service Content Section End ======================= */}

          <div className="container">
            {/* =================== AI Development ===================== */}
            <motion.div
              className="row align-items-center mb-5 py-2"
              id='AI-Development'
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Left content */}
              <div className="col-lg-6 mb-lg-0 mb-4">
                <h2 className="services-title">AI Development &amp; Solutions</h2>
                <ul className="service-list">
                  <li>
                    <i className="bx bx-check-circle" /> Custom AI model design and training
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> Machine learning &amp; deep learning
                    integrations
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> Computer vision and 3D data processing
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> Natural language processing (NLP) solutions
                  </li>
                </ul>
              </div>
              {/* Right image */}
              <div className="col-lg-5 services-img text-center text-lg-end">
                <img src={AiImg} alt="AI Services Image" />
              </div>
            </motion.div>
            {/* =================== Flutter App Development ===================== */}
            <motion.div
              className="row align-items-center mt-lg-5 mt-3 py-lg-5 mt-3"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Left image */}
              <div className="col-lg-5 services-img text-center text-lg-end order-lg-1 order-2 mb-lg-0 mb-4">
                <img src={AppImg} alt="App Development Image" />
              </div>
              {/* Right content */}
              <div className="col-lg-6 mb-4 mb-lg-0 offset-lg-1 order-lg-2 order-1" id='Flutter'>
                <h2 className="services-title">Flutter App Development</h2>
                <ul className="service-list">
                  <li>
                    <i className="bx bx-check-circle" />
                    Cross-platform mobile apps for iOS &amp; Android
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> Single codebase, high-quality native
                    performance
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> Feature-rich, scalable, and secure
                    applications
                  </li>
                </ul>
              </div>
            </motion.div>
            {/* =================== Website Development ===================== */}
            <motion.div
              className="row align-items-center mt-lg-5 mt-3 py-lg-5 mt-3"
              id='Website-Development'
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Left content */}
              <div className="col-lg-6 mb-4 mb-lg-0">
                <h2 className="services-title">Website Development</h2>
                <ul className="service-list">
                  <li>
                    <i className="bx bx-check-circle" /> Responsive, high-performance websites
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> Full-stack development (React, Node.js,
                    Laravel, etc).
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> API integration &amp; automation
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> Scalable cloud-based web apps
                  </li>
                </ul>
              </div>
              {/* Right image */}
              <div className="col-lg-5 services-img text-center text-lg-end mb-lg-0 mb-4">
                <img src={GraphicImg} alt="Website Services Image" />
              </div>
            </motion.div>
            {/* =================== Desktop App Development ===================== */}
            <motion.div
              className="row align-items-center mt-lg-5 mt-3 py-lg-5 mt-3"
              id='Desktop-App'
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Left image */}
              <div className="col-lg-5 services-img text-center text-lg-end order-lg-1 order-2 mb-lg-0 mb-4">
                <img src={DesktopImg} alt="Desktop App Services Image" />
              </div>
              {/* Right content */}
              <div className="col-lg-6 mb-4 mb-lg-0 offset-lg-1 order-lg-2 order-1">
                <h2 className="services-title">Desktop App Development</h2>
                <ul className="service-list">
                  <li>
                    <i className="bx bx-check-circle" /> Windows, macOS, and Linux desktop solutions
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> Custom tools and enterprise-grade software
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> Offline and online hybrid capabilities
                  </li>
                </ul>
              </div>
            </motion.div>
            {/* =================== Bus. Dev. & Consulting ===================== */}
            <motion.div
              className="row align-items-center mt-lg-5 mt-3 py-lg-5 mt-3"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Left content */}
              <div className="col-lg-6 mb-lg-0 mb-4">
                <h2 className="services-title">Bus. Dev. &amp; Consulting</h2>
                <ul className="service-list">
                  <li>
                    <i className="bx bx-check-circle" /> Go-to-market strategies
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> B2B and B2C sales enablement
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> Partnership &amp; ecosystem building
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> Scaling roadmaps and investor readiness
                  </li>
                </ul>
              </div>
              {/* Right image */}
              <div className="col-lg-5 services-img text-center text-lg-end mb-lg-0 mb-4">
                <img src={Business} alt="Consulting Services Image" />
              </div>
            </motion.div>
            {/* =================== Creative Media ===================== */}
            <motion.div
              className="row align-items-center mt-lg-5 mt-3 py-lg-5 mt-3"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Left image */}
              <div className="col-lg-5 services-img text-center text-lg-end order-lg-1 order-2 mb-lg-0 mb-4">
                <img src={CreativeMedia} alt="Creative Media Image" />
              </div>
              {/* Right content */}
              <div className="col-lg-6 mb-4 mb-lg-0 offset-lg-1 order-lg-2 order-1">
                <h2 className="services-title">Creative Media</h2>
                <ul className="service-list">
                  <li>
                    <i className="bx bx-check-circle" /> Brand identity design
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> UI/UX design for web &amp; mobile
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> Motion graphics and 3D animations
                  </li>
                  <li>
                    <i className="bx bx-check-circle" /> Marketing visuals &amp; campaign assets
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================= Footer ======================= */}
        <div className="aithreed">
          <footer className="footer">
            <div className="container">
              <div className="row">
                {/* Left Column */}

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

                {/* Quick Links */}

                <div className="col-lg-2 col-md-4 col-6 txcenter top">
                  <h6>Quick Links</h6>

                  <div className="relative">
                    <img width="61px" src={line} alt="Line" />

                    <img src={dot} alt="Dot" className="posotion" />
                  </div>
                  <ul className="mt-1">
                    {['Home', 'About us', 'Pricing', 'Student'].map((item) => (
                      <li key={item}>
                        <a
                          href={
                            item === 'Pricing'
                              ? '/3dio/subscription'
                              : item === 'About us'
                                ? '/#aboutus'
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

                {/* Support */}

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

                {/* Follow */}

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

                {/* Contact */}

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
                    >
                      <i className="bx bxl-facebook" />
                    </a>

                    <a href="https://x.com/ai3dscanning" target="_blank">
                      <i className="bx bxl-twitter" />
                    </a>

                    <a
                      href="https://www.linkedin.com/company/ai3d-scanning-solutions-inc/"
                      target="_blank"
                    >
                      <i className="bx bxl-linkedin" />
                    </a>

                    <a
                      href="https://www.instagram.com/ai3d_scanning_solutions?igsh=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr"
                      target="_blank"
                    >
                      <i className="bx bxl-instagram" />
                    </a>
                  </div>
                </div>

                {/* Mobile Social Icons */}
                <div className="social-icons  d-md-none d-block d-flex justify-content-center mt-3">
                  <a
                    href="https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr"
                    target="_blank"
                  >
                    <i className="bx bxl-facebook" />
                  </a>

                  <a href="https://x.com/ai3dscanning" target="_blank">
                    <i className="bx bxl-twitter" />
                  </a>

                  <a
                    href="https://www.linkedin.com/company/ai3d-scanning-solutions-inc/"
                    target="_blank"
                  >
                    <i className="bx bxl-linkedin" />
                  </a>

                  <a
                    href="https://www.instagram.com/ai3d_scanning_solutions?igsh=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr"
                    target="_blank"
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
      </div>
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </>
  );
};

export default Service;
