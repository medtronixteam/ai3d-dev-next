import React, { useEffect, useRef, useState } from 'react';
import '../LandingPage.css';
import './ContributorLandingPage.css';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import rightarrow from '../images/mdi_arrow-right-thin.png';
import { useMediaQuery } from 'react-responsive';
import elipse from '../images/heading_ellipse.png';
import Contributor from '../images/Contributor.svg';
import inscription from '../images/inscription.svg';
import StartEarning from '../images/StartEarning.svg';
import UploadModel from '../images/UploadModel.svg';
import ExploreTools from '../images/ExploreTools.svg';
import ContributorApp from '../images/ContributorApp.svg';
import world from '../images/worl.png';
import line from '../images/line.png';
import dot from '../images/do.png';
import { FaChevronDown, FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import arrow from '../images/arri.png';
import AI3dCreatorsPopUp from '../../components/popup/AI3dCreatorsPopUp';
import PremiumQuality from '../images/PremiumQuality.svg';
import GrowBrand from '../images/GrowBrand.svg';
import ProtectedWork from '../images/ProtectedWork.svg';
import EarnMore from '../images/EarnMore.svg';
import EasyUpload from '../images/EasyUpload.svg';
import WaitlistModal from '../../components/popup/WaitlistModal';
import { useLocation } from 'react-router-dom';

const ContributorLandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const location = useLocation();

  const pills = [
    { label: 'Construction', icon: rightarrow, target: '3d-Sample' },
    { label: 'Gaming', icon: rightarrow, target: '3d-Sample' },
    { label: 'VR', icon: rightarrow, target: '3d-Sample' },
    { label: 'Retail', icon: rightarrow, target: '3d-Sample' },
    { label: 'Manufacturing', icon: rightarrow, target: '3d-Sample' },
    { label: 'Health', icon: rightarrow, target: '3d-Sample' },
  ];

  const pillsRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
     if (!pillsRef.current) return;
     if (!isMobile) return;
 
     const el = pillsRef.current;
     const speed = 0.5;
     let animationFrameId;
     let isPaused = false;
 
     // --- Auto scroll ---
     const animateScroll = () => {
       if (!isPaused) {
         el.scrollLeft += speed;
         if (el.scrollLeft >= el.scrollWidth / 2) {
           el.scrollLeft = 0;
         }
       }
       animationFrameId = requestAnimationFrame(animateScroll);
     };
     animationFrameId = requestAnimationFrame(animateScroll);
 
     // --- Mouse drag ---
     let isMouseDown = false;
     let startX = 0;
     let scrollLeftStart = 0;
 
     const onMouseDown = (e) => {
       isMouseDown = true;
       isPaused = true;
       startX = e.pageX - el.offsetLeft;
       scrollLeftStart = el.scrollLeft;
       el.style.cursor = 'grabbing';
     };
 
     const onMouseMove = (e) => {
       if (!isMouseDown) return;
       e.preventDefault();
       const x = e.pageX - el.offsetLeft;
       const walk = (x - startX) * 1.5;
       el.scrollLeft = scrollLeftStart - walk;
     };
 
     const onMouseUp = () => {
       isMouseDown = false;
       el.style.cursor = 'grab';
       // Resume auto-scroll after a short delay
       setTimeout(() => { isPaused = false; }, 1500);
     };
 
     // --- Touch drag ---
     let touchStartX = 0;
     let touchScrollStart = 0;
 
     const onTouchStart = (e) => {
       isPaused = true;
       touchStartX = e.touches[0].pageX;
       touchScrollStart = el.scrollLeft;
     };
 
     const onTouchMove = (e) => {
       const x = e.touches[0].pageX;
       const walk = (touchStartX - x) * 1.2;
       el.scrollLeft = touchScrollStart + walk;
     };
 
     const onTouchEnd = () => {
       setTimeout(() => { isPaused = false; }, 1500);
     };
 
     el.style.cursor = 'grab';
     el.style.overflowX = 'hidden';
 
     el.addEventListener('mousedown', onMouseDown);
     el.addEventListener('mousemove', onMouseMove);
     el.addEventListener('mouseup', onMouseUp);
     el.addEventListener('mouseleave', onMouseUp);
     el.addEventListener('touchstart', onTouchStart, { passive: true });
     el.addEventListener('touchmove', onTouchMove, { passive: true });
     el.addEventListener('touchend', onTouchEnd);
 
     return () => {
       cancelAnimationFrame(animationFrameId);
       el.removeEventListener('mousedown', onMouseDown);
       el.removeEventListener('mousemove', onMouseMove);
       el.removeEventListener('mouseup', onMouseUp);
       el.removeEventListener('mouseleave', onMouseUp);
       el.removeEventListener('touchstart', onTouchStart);
       el.removeEventListener('touchmove', onTouchMove);
       el.removeEventListener('touchend', onTouchEnd);
     };
   }, [isMobile]);

  const faqs = [
    {
      question: 'How long does it take to transform a single model?',

      answer:
        ' With our AI powered processing, most 3D models are generated in seconds to a few minutes, depending on complexity and resolution settings.',
    },

    {
      question: 'How do I create an account?',

      answer:
        'Simply click "Sign Up" on our website or mobile app, enter your details, and verify your email. You can start with a free trial immediately.',
    },

    {
      question: 'How can I upgrade to the paid version?',

      answer:
        'You can upgrade anytime from your account dashboard by selecting a subscription plan and making a secure online payment.',
    },

    {
      question: 'Do you offer discounts?',

      answer:
        ' Yes-discounts are available for annual subscriptions, educational institutions, and bulk enterprise packages. Contact our sales team for details.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const trustedLogosRef = useRef(null);

  useEffect(() => {
    if (!isMobile || !trustedLogosRef.current) return;
    let scrollAmount = 0;
    const logoWidth = 140;
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

  const accordionRef = useRef(null);

  // Close FAQ if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (accordionRef.current && !accordionRef.current.contains(event.target)) {
        setOpenIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const landingRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const section = landingRef.current;
    if (!section) return;

    const handleScroll = () => {
      const scrollTop =
        section.scrollTop || document.documentElement.scrollTop || document.body.scrollTop || 0;

      // console.log('Section Scroll:', scrollTop);
      setIsScrolled(scrollTop > 30);
      setShowScrollTop(scrollTop > 300);
    };

    section.addEventListener('scroll', handleScroll);

    return () => section.removeEventListener('scroll', handleScroll);
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
    <section className="landing-page-section ai_3d_landing" ref={landingRef}>
      <div className="main_head" style={{ backgroundColor: '#FFEDF7' }}>
        <main className="container py-sm-4 pt-4">
          {/* ========================= navbar ======================= */}

          <header
            className={`a3d-header container-fluid mb-4 a3d-fade-in ${isScrolled ? 'a3d-header-scrolled' : ''}`}
          >
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/">
                <img src={logo} alt="Logo" style={{ width: '70%' }} />
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

              <nav className="d-none d-lg-flex gap-lg-3 gap-xl-4">
                <Link
                  to="/"
                  className={`a3d-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                  Home
                </Link>

                <Link to="https://calendly.com/arslan-medtronix/30min" className="a3d-nav-link">
                  Schedule Meeting
                </Link>

                <Link
                  to="/services"
                  className={`a3d-nav-link ${location.pathname === '/services' ? 'active' : ''}`}
                >
                  Services
                </Link>

                <a href="/#3d-Sample" className="a3d-nav-link">
                  3D Samples
                </a>

                <a href="/#Leadership" className="a3d-nav-link">
                  Leadership
                </a>
                {/* <a
                  href="/referral"
                  className={`a3d-nav-link ${location.pathname === '/referral' ? 'active' : ''}`}
                >
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
          {/* Spacer to prevent content overlap */}
          <div className="a3d-header-offset"></div>
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
              <Link to="/" className={`a3d-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>

              <Link to="https://calendly.com/arslan-medtronix/30min" className="a3d-nav-link">
                Schedule Meeting
              </Link>

              <Link
                to="/services"
                className={`a3d-nav-link ${location.pathname === '/services' ? 'active' : ''}`}
              >
                Services
              </Link>

              <a href="#3d-Sample" className="a3d-nav-link">
                3D Samples
              </a>

              <a href="#Leadership" className="a3d-nav-link">
                Leadership
              </a>
              {/* <Link
                to="/referral"
                className={`a3d-nav-link ${location.pathname === '/referral' ? 'active' : ''}`}
              >
                Referral
              </Link> */}

              {/* <Link to="/signin" className="a3d-nav-link">
                Sign-In
              </Link> */}

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

          {/* Overlay for background click */}

          {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
        </main>

        <div className="container" style={{ paddingBottom: 20 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 p-lg-0">
              <motion.h1
                className="contributor-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Your Work.
                <span className="ctc-arch-wrap">
                  <img src={elipse} alt="elipse" className="contri-arch"  />
                    Our Platform.
                </span> 
                <br />
                Limitless Possibilities,
                <br />
                Endless Impact.
              </motion.h1>

              <motion.p
                className="a3d-description mt-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Join forces with global visionaries and innovators to co-create next- <br />
                generation 3D solutions, shaping the future of immersive design and <br />{' '}
                collaboration.
              </motion.p>

              <motion.div
                className="a3d-pills-scroll d-flex gap-3 my-4"
                id="pillSlider"
                ref={pillsRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{
                  overflowX: isMobile ? 'hidden' : 'visible', // Hide scrollbar but allow programmatic scroll
                  whiteSpace: isMobile ? 'nowrap' : 'normal',
                  minHeight: 48,
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  flexWrap: isMobile ? 'nowrap' : 'wrap',
                }}
              >
                {/* Duplicate pills to create infinite illusion only on mobile */}
                {(isMobile ? [...pills, ...pills] : pills).map((pill, idx) => (
                  <div
                    className="a3d-pill"
                    key={`${pill.label}-${idx}`}
                    style={{ minWidth: 'auto', flexShrink: 0 }}
                    onClick={() => {
                      window.location.href = `/#${pill.target}`;
                    }}
                  >
                    <span>{pill.label}</span>
                    <img src={pill.icon} alt="" style={{ paddingTop: 2 }} />
                  </div>
                ))}
              </motion.div>

              <motion.div
                className="a3d-btn d-flex align-items-center gap-3 flex-wrap"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <button className="a3d-join-btn" onClick={() => setShowPopup(true)}>
                  Get Started as Contributor
                </button>
              </motion.div>
            </div>

            <div className="col-lg-5 p-lg-0 mt-4 mt-lg-0">
              <img src={Contributor} alt="" width={isMobile ? '100%' : '100%'} />
            </div>
          </div>
        </div>
      </div>

      <motion.section
        className="service-cards mt-5 pt-md-0 pt-3"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className="text-center mb-1">
            <h2 className="join-platform-text" style={{ fontSize: isMobile ? '29px' : '38px' }}>
              How it <span className="word-work">works</span>
              <img src={elipse} alt="Ellipse" className="ellipse-img-hiw" />
            </h2>

            <p className="section-subtitle">
              Transform Any 2D data into a High-Precision 3D{' '}
              <span className="d-none d-md-inline">
                <br />
              </span>
              Model in minutes.
            </p>
          </div>

          <section className="py-3 py-lg-4">
            <div className="container">
              <div className="row g-4">
                {/* Card */}
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="contributor-service-card">
                    <h3 className="contributor-service-title">Sign Up</h3>
                    <p className="contributor-service-desc">
                      Sign up and unlock your gateway to the future of 3D creation. With a quick and
                      seamless process, AI3D welcomes contributors from every background from
                      emerging talents to industry professionals
                    </p>
                    <div className="footer-wrapper">
                      <div className="service-footer">
                        <button className="circle-btn" aria-label="arrow">
                          01
                        </button>
                      </div>
                      <div className="card-icon" aria-hidden="true">
                        <img src={inscription} alt="Service Icon" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="contributor-service-card">
                    <h3 className="contributor-service-title">Upload your Model</h3>
                    <p className="contributor-service-desc">
                      Whether you are submitting individual models or entire collections, the upload
                      process is designed to be simple and efficient. Our review team ensures timely
                      and reliable approvals, allowing you to focus on what truly matters .
                    </p>
                    <div className="footer-wrapper">
                      <div className="service-footer">
                        <button className="circle-btn" aria-label="arrow">
                          02
                        </button>
                      </div>
                      <div className="card-icon" aria-hidden="true">
                        <img src={UploadModel} alt="Store Icon" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="contributor-service-card">
                    <h3 className="contributor-service-title">Start Earning</h3>
                    <p className="contributor-service-desc">
                      Turn your creativity into a source of income. Every time your 3D models are
                      used, shared, or integrated, you earn rewards helping your work gain global
                      recognition while fueling industries and innovations worldwide.
                    </p>
                    <div className="footer-wrapper">
                      <div className="service-footer">
                        <button className="circle-btn" aria-label="arrow">
                          03
                        </button>
                      </div>
                      <div className="card-icon" aria-hidden="true">
                        <img src={StartEarning} alt="3D Modeling Icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.section>

      <motion.section
        className="service-cards mt-5 pt-md-0 pt-3"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className="text-center mb-1">
            <h2 className="join-platform-text" style={{ fontSize: isMobile ? '29px' : '38px' }}>
              Why Join Our Platform
              <img src={elipse} alt="Ellipse" className="ellipse-img-platform" />
            </h2>

            <p className="section-subtitle">
              Unlock opportunities to create, collaborate, <br /> and monetize your 3D talent with
              AI3D.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="our-services"
        id="Services"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className="business-section" id="aboutus">
            <div className="row">
              <div className="col-lg-6">
                <div className="business-service">
                  <div className="business-service-icon">
                    <img src={PremiumQuality} alt="" />
                  </div>

                  <div className="business-service-content">
                    <h5>Premium Quality</h5>

                    <p>
                      Share high-quality work with millions of customers worldwide looking for
                      premium content.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mt-lg-0 mt-4">
                <div className="business-service">
                  <div className="business-service-icon">
                    <img src={EarnMore} alt="" />
                  </div>

                  <div className="business-service-content">
                    <h5>Earn More</h5>

                    <p>
                      Competitive revenue share and multiple earning opportunities from your
                      creative work.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mt-4">
                <div className="business-service">
                  <div className="business-service-icon">
                    <img src={GrowBrand} alt="" />
                  </div>

                  <div className="business-service-content">
                    <h5>Grow your Brand</h5>

                    <p>
                      Build your portfolio and reach a global audience of potential clients and
                      fans.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mt-4">
                <div className="business-service">
                  <div className="business-service-icon">
                    <img src={EasyUpload} alt="" />
                  </div>

                  <div className="business-service-content">
                    <h5>Easy Upload</h5>

                    <p>
                      Simple upload process with powerful tools to manage and track your content.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mt-4">
                <div className="business-service">
                  <div className="business-service-icon">
                    <img src={ProtectedWork} alt="" />
                  </div>

                  <div className="business-service-content">
                    <h5>Protected Work</h5>

                    <p>
                      Your content is protected with copyright safeguards and licensing agreements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="contributor-tools-section my-5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-12 d-flex align-items-center">
              <div className="explore-tools-section d-flex flex-column">
                <h1 className="explore-tools-section-text">
                  Easy to Use Tools
                  <img src={elipse} alt="Ellipse" className="ellipse-img-tools" />
                </h1>
                <p>
                  Contributing to the future of 3D has never been easier. Submit your creations,
                  personalize your creator space, and follow your impact — all powered by smart AI
                  tools designed to keep you focused on what matters most: creating.
                </p>
                <button className="a3d-join-btn" style={{ width: 'fit-content' }}>
                  Explore tools
                </button>
              </div>
            </div>

            <div className="col-md-6 col-12 mt-4 mt-lg-0">
              <img src={ExploreTools} alt="" width="100%" />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="contributor-app-section my-5"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-12">
              <img src={ContributorApp} alt="" width="100%" />
            </div>

            <div className="col-md-6 col-12 ps-lg-5 pb-5 pb-lg-0  mt-4 mt-lg-0 d-flex align-items-center">
              <div className="explore-app-section d-flex flex-column">
                <h1 className="explore-tools-section-text">
                  Get the AI3D Contributor App
                  <img src={elipse} alt="Ellipse" className="ellipse-img-app" />
                </h1>
                <p>
                  Create, upload, and manage your 3D models directly from your mobile device with
                  ease. The AI3D Contributor App keeps you updated on approvals, sales, and earnings
                  in real time, giving you full visibility into your portfolio. Focus on crafting
                  high-quality designs while we take care of distribution, exposure, and growth
                  opportunities.
                </p>
                <button className="a3d-join-btn" style={{ width: 'fit-content' }}>
                  Get Contributer App Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="aithreed">
        <section className="dropdown mt-5 bg-white pt-5" id="FAQs">
          <div className="container">
            {/* Heading */}
            <div className="text-center mb-4">
              <p className="mb-1 needh">Need Help?</p>
              <div className="faq-header">
                <h2 className="faq-title text-black">Frequently Asked Questions</h2>
                <img src={elipse} alt="" className="rainbow-overlay" />
              </div>
            </div>
            {/* Accordion */}
            <div className="accordion" ref={accordionRef}>
              {faqs.map((faq, index) => (
                <div className="accordion-item border-0 mb-3" key={index}>
                  <h2 className="accordion-header justify">
                    <button
                      className={`accordion-button fw-semibold widthh ${openIndex === index ? '' : 'collapsed'
                        }`}
                      type="button"
                      onClick={() => toggleFAQ(index)}
                    >
                      {faq.question}
                      <span className="icon-container">
                        <i
                          className="fa-solid fa-plus icon-plus"
                          style={{ display: openIndex === index ? 'none' : 'inline' }}
                        ></i>
                        <i
                          className="fa-solid fa-minus icon-minus"
                          style={{ display: openIndex === index ? 'inline' : 'none' }}
                        ></i>
                      </span>
                    </button>
                  </h2>
                  {openIndex === index && (
                    <div className="accordion-collapse show">
                      <div className="cet">
                        <div className="accordion-body text-muted">{faq.answer}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="aithreed">
        <footer className="footer">
          <div className="container">
            <div className="row">
              {/* Left Column */}

              <div className="col-lg-4 col-md-6 col-12">
                <div className="logo">
                  <img width="120px" src={logo} alt="Logo" />
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

                  {/* Mobile Language Dropdown */}

                  <div className="dropdown btn-wrapper d-lg-none d-md-none d-sm-none d-block">
                    <button
                      className="btn english"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src={world} alt="World" style={{ width: 18, marginRight: 6 }} />
                      English
                      <FaChevronDown size={12} className="ms-2" />
                    </button>

                    {/* <ul className="dropdown-menu menuo usd-tittle" data-bs-popper="static">
                      <li>
                        <a className="dropdown-item black" href="#">
                          English
                        </a>
                      </li>
                    </ul> */}
                  </div>

                  {/* Mobile Currency Dropdown */}

                  <div className="dropdown btn-wrapper d-lg-none d-md-none d-sm-none d-block">
                    <button
                      className="btn usd"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      $USD
                      <FaChevronDown size={12} className="ms-2" />
                    </button>

                    {/* <ul className="dropdown-menu menu usd-tittle" data-bs-popper="static">
                      <li>
                        <a className="dropdown-item black" href="#">
                          $USD
                        </a>
                      </li>
                    </ul> */}
                  </div>

                  {/* Desktop Language + Currency */}

                  <div className="d-flex gap-2 none">
                    <div className="dropdown btn-wrapper none">
                      <button
                        className="btn english"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img src={world} alt="World" style={{ width: 18, marginRight: 6 }} />
                        English
                        <FaChevronDown size={12} className="ms-2" />
                      </button>

                      {/* <ul className="dropdown-menu menuo usd-tittle" data-bs-popper="static">
                        <li>
                          <a className="dropdown-item black" href="#">
                            English
                          </a>
                        </li>
                      </ul> */}
                    </div>

                    <div className="dropdown btn-wrapper none">
                      <button
                        className="btn usd"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        $USD
                        <FaChevronDown size={12} className="ms-2" />
                      </button>

                      {/* <ul className="dropdown-menu menu usd-tittle" data-bs-popper="static">
                        <li>
                          <a className="black" href="#">
                            $USD
                          </a>
                        </li>
                      </ul> */}
                    </div>
                  </div>
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
                  {['Home', 'Services', 'Pricing'].map((item) => (
                    <li key={item}>
                      <a
                        href={
                          item === 'Pricing'
                            ? '/platform/subscription'
                            : item === 'Services'
                              ? '/services'
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
                      <a href={item === 'FAQ' ? '#FAQs' : '/#help'}>
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
                      <a href="tel:4055550218">
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

      {showPopup && <AI3dCreatorsPopUp onClose={() => setShowPopup(false)} />}
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
              border: '2px solid white',
            }}
          >
            <FaArrowUp color="white" size={20} />
          </motion.div>
        )}
      </AnimatePresence>
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </section>
  );
};

export default ContributorLandingPage;
