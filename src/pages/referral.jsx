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
import AiImg from './images/ai.png';
import AppImg from './images/app.jpg';
import GraphicImg from './images/graphic.png';
import DesktopImg from './images/desktop.png';
import refferal from '../assets/images/refferal.png';
import airoplan from '../assets/images/airoplan.png';
import branded_stars from '../assets/images/token-branded_stars.png';
import partyCard from '../assets/images/party-card.png';
import launching from '../assets/images/launching.png';
import checkCircle from '../assets/images/check-circle.png';
import plusIcon from './images/plus.png';
import minusIcon from './images/minus.png';
import { useMediaQuery } from 'react-responsive';

const Referral = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { pathname, hash, key } = useLocation();
  const pills = [
    { label: 'AI Development', icon: rightarrow },
    { label: 'Flutter App', icon: rightarrow },
    { label: 'Website Development', icon: rightarrow },
    { label: 'Desktop App Development', icon: rightarrow },
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

  // FAQ data
  const faqs = [
    {
      question: 'How does the referral program works?',
      answer:
        ' Our referral program lets you invite friends to join. When they sign up using your unique referral link and complete a qualifying action ',
    },
    {
      question: 'How  much reward can I earn?',
      answer:
        'You can earn up to $50 per successful referral, depending on the plan your friend chooses. There’s no limit to how many people you can refer',
    },
    {
      question: 'Who can I invite?',
      answer:
        'You can invite anyone who isn’t already a customer—friends, family, coworkers, or followers. Just share your referral link, and as long as they’re new to the service, they can sign up and unlock rewards for both of you.',
    },
    {
      question: 'Can I use more than one reward at once?',
      answer:
        ' No, referral rewards can typically only be used one per transaction or account, depending on the terms. They cannot be combined with other discounts or rewards unless otherwise stated',
    },
  ];

  // FAQ accordion state
  const [openIndex, setOpenIndex] = useState(null);
  const accordionRef = useRef(null);

  // Toggle FAQ open/close
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

  return (
    <>
      <div className="ai_3d_landing">
        <div className="main_head" style={{ backgroundColor: '#FFEDF7' }}>
          <main className="container pt-4">
            {/* ========================= navbar ======================= */}

            <header className="a3d-header container-fluid bg-white mb-lg-0 mb-4 a3d-fade-in">
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

                <nav className="d-none d-lg-flex gap-4">
                  <Link
                    to="/"
                    className={`a3d-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                  >
                    Home
                  </Link>
                  <a href="https://calendly.com/arslan-medtronix/30min" className="a3d-nav-link">
                    Schedule Meeting
                  </a>

                  <Link
                    to="/service"
                    className={`a3d-nav-link ${location.pathname === '/service' ? 'active' : ''}`}
                  >
                    Services
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
                </nav>

                <div className="d-none d-lg-flex gap-3 align-items-center">
                  <Link to="/signin" className="a3d-nav-link">
                    Sign-In
                  </Link>

                  <Link to="/platform/">
                    <button className="a3d-join-btn">Join Us</button>
                  </Link>
                </div>
              </div>
            </header>

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
                  to="/service"
                  className={`a3d-nav-link ${location.pathname === '/service' ? 'active' : ''}`}
                >
                  Services
                </Link>

                <Link to="/#3d-Sample" className="a3d-nav-link">
                  3D Samples
                </Link>

                <Link to="/#Leadership" className="a3d-nav-link">
                  Leadership
                </Link>

                <Link to="/signin" className="a3d-nav-link">
                  Sign-In
                </Link>

                <Link to="/platform/">
                  <button className="a3d-join-btn">Join Us</button>
                </Link>
              </nav>
            </div>

            {/* Overlay for background click */}

            {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
          </main>

          {/* ========================= Hero Section ======================= */}

          <div className="container rafferal pb-5" style={{ paddingBottom: 20 }}>
            <div className="row align-items-center">
              <div className="col-lg-7">
                <h1 className="a3d-title a3d-slide-up">
                  Spread the
                  <span className="perfect-heading">
                    Ma
                    <span className="ec-wrapper">
                      gi
                      <img src={elipse} alt="Ellipse" className="ellipse-img" />
                    </span>
                    c.
                  </span>
                  <span className="a3d-gradient-text">
                    Stack
                    <span className="d-none d-lg-inline">
                      <br />
                    </span>
                    the Rewards.
                    <span className="circle-star">
                      <img src={airoplan} alt="" />
                    </span>
                  </span>
                </h1>
                <p className="a3d-description mt-4 a3d-slide-up" style={{ animationDelay: '0.2s' }}>
                  <span style={{ color: '#DE3996' }}>Invite your crew</span>, unlock milestones, and
                  climb the leaderboard to <br className="d-lg-block d-none" /> earn premium
                  features, merch, and more.
                </p>
                <div className="position-relative">
                  <span className="circle-star-2">
                    <img src={branded_stars} alt="Star" />
                  </span>
                </div>
              </div>
              <div className="col-lg-5 text-center">
                <img
                  src={refferal}
                  alt="3D Robot"
                  className="img-fluid main-image"
                  style={{ maxWidth: 450 }}
                />
              </div>
            </div>
            <div
              className="row bg-white p-4"
              style={{
                borderRadius: 12,
                marginTop: '-40px',
                boxShadow: '5px 21px 30px 0px #00000040',
              }}
            >
              <div className="col-md-4">
                <div className="icon-box mb-2 mt-lg-0 mt-2">
                  <img
                    src={partyCard}
                    alt="Invite New Friends"
                    style={{ height: 40, width: 'auto' }}
                  />
                </div>
                <h5
                  className="mt-3 heading-text-card"
                  style={{ color: '#DE3996', fontWeight: 700 }}
                >
                  Invite New Friends
                </h5>
                <p className="mb-0 sub-text-card " style={{ color: '#666' }}>
                  Share your link with friends new to Ai3D.
                </p>
              </div>
              <div className="col-md-4">
                <div className="icon-box mb-2 mt-lg-0 mt-2">
                  <img
                    src={launching}
                    alt="They Get a Starter Pack"
                    style={{ height: 40, width: 'auto' }}
                  />
                </div>
                <h5
                  className="mt-3 heading-text-card"
                  style={{ color: '#DE3996', fontWeight: 700 }}
                >
                  They Get a Starter Pack
                </h5>
                <p className="mb-0 sub-text-card " style={{ color: '#666' }}>
                  Your friend receives a special pack of textures, templates, and free renders.
                </p>
              </div>
              <div className="col-md-4">
                <div className="icon-box mb-2 mt-lg-0 mt-2">
                  <img
                    src={checkCircle}
                    alt="You Get a Creator Pack"
                    style={{ height: 40, width: 'auto' }}
                  />
                </div>
                <h5
                  className="mt-3 heading-text-card"
                  style={{ color: '#DE3996', fontWeight: 700 }}
                >
                  You Get a Creator Pack
                </h5>
                <p className="mb-0 sub-text-card " style={{ color: '#666' }}>
                  Unlock advanced assets and extra renders once they get started.
                </p>
              </div>
            </div>
          </div>

          {/* ========================= Hero Section End ======================= */}
        </div>

        {/* ========================= Footer ======================= */}
        <div className="aithreed">
          <section className="dropdown mt-5 bg-white pt-5">
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
                        className={`accordion-button fw-semibold widthh ${
                          openIndex === index ? '' : 'collapsed'
                        }`}
                        type="button"
                        onClick={() => toggleFAQ(index)}
                      >
                        {faq.question}
                        <span className="icon-container">
                          <img
                            src={plusIcon}
                            alt="Plus"
                            className="icon-plus"
                            style={{ display: openIndex === index ? 'none' : 'inline' }}
                          />
                          <img
                            src={minusIcon}
                            alt="Minus"
                            className="icon-minus"
                            style={{ display: openIndex === index ? 'inline' : 'none' }}
                          />
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
                      <button className="btn btn-custom Sell">Sell your 3D Models</button>
                    </div>

                    {/* Mobile Language Dropdown */}

                    <div className="dropdown btn-wrapper d-lg-none d-md-none d-sm-none d-block">
                      <button
                        className="btn dropdown-toggle english"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img src={world} alt="World" style={{ width: 18, marginRight: 6 }} />
                        English
                      </button>

                      <ul className="dropdown-menu menuo usd-tittle" data-bs-popper="static">
                        <li>
                          <a className="dropdown-item black" href="#">
                            English
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Mobile Currency Dropdown */}

                    <div className="dropdown btn-wrapper d-lg-none d-md-none d-sm-none d-block">
                      <button
                        className="btn dropdown-toggle usd"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        $USD
                      </button>

                      <ul className="dropdown-menu menu usd-tittle" data-bs-popper="static">
                        <li>
                          <a className="dropdown-item black" href="#">
                            $USD
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Desktop Language + Currency */}

                    <div className="d-flex gap-2 none">
                      <div className="dropdown btn-wrapper none">
                        <button
                          className="btn dropdown-toggle english"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <img src={world} alt="World" style={{ width: 18, marginRight: 6 }} />
                          English
                        </button>

                        <ul className="dropdown-menu menuo usd-tittle" data-bs-popper="static">
                          <li>
                            <a className="dropdown-item black" href="#">
                              English
                            </a>
                          </li>
                        </ul>
                      </div>

                      <div className="dropdown btn-wrapper none">
                        <button
                          className="btn dropdown-toggle usd"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          $USD
                        </button>

                        <ul className="dropdown-menu menu usd-tittle" data-bs-popper="static">
                          <li>
                            <a className="black" href="#">
                              $USD
                            </a>
                          </li>
                        </ul>
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
                    {['Home', 'About us', 'Pricing'].map((item) => (
                      <li key={item}>
                        <a href={item === 'Pricing' ? '/platform/subscription' : '#'}>
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
                        <a href="#">
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
      </div>
    </>
  );
};

export default Referral;
