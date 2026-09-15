import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import logo from './images/logo.png';
import consulting from './images/consulting.png';
import elipse from './images/heading_ellipse.png';
import rightarrow from './images/mdi_arrow-right-thin.png';
import arrow2 from './images/arrow2.png';
import robot from './images/robot-2.png';
import google from './images/google-startups.png';
import googleCloud from './images/google-cloud.png';
import reginalPlan from './images/regional-plan.png';
import PITB from './images/PITB.png';
import Modling from './images/3d-modeling.png';
import store from './images/store.png';
import design from './images/provide.png';
import mobile from '../assets/images/b2b.png';
import machine from './images/machine.png';
import e_commerce from './images/ecommerce.png';
import vr from './images/vr.png';
import gaming from './images/gaming.png';
import rightArrow1 from './images/basil_arrow-right-outline.png';
import encripted from './images/encrypted.png';
import instant from './images/instant-results.png';
import understand from './images/language-understanding.png';
import scan from './images/3d-cube.png';
import elipse1 from './images/Ellipse.png';
import elipse2 from './images/Ellipse2.png';
import rectangle1 from './images/Rectangle1.png';
import rectangle2 from './images/Rectangle2.png';
import search from './images/search_icon.png';
import down from './images/down_.png';
import carImg from './images/car.png';
import homeImg from './images/home.png';
import shoesImg from './images/shoes.png';
import astronautImg from './images/astronaut.png';
import headphonesImg from './images/headphones.png';
import car2Img from './images/car2.png';
import car3Img from './images/car3.png';
import ninjaImg from './images/ninja.png';
import modelButtonIcon from './images/model_button_icon.png';
import nvidia from './images/nvdia.png';
import videoSrc from './images/3dModal.mp4';
import videoIcon from './images/video_icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPauseCircle } from '@fortawesome/free-solid-svg-icons';
import { FaChevronDown, FaLinkedin, FaApple, FaGooglePlay, FaArrowUp } from 'react-icons/fa';
import rainbowImg from './images/rainbow.png';
import googlePlayImg from '../assets/images/google-play.png';
import ArslanImg from '../assets/images/Arslan.jpeg';
import ArslanImg2 from '../assets/images/arslan-bhai-2.png';
import manImage from './images/man.png';
import plusIcon from './images/plus.png';
import minusIcon from './images/minus.png';
import world from './images/worl.png';
import line from './images/line.png';
import dot from './images/do.png';
import arrow from './images/arri.png';
// Modal assets;
import client1 from '../assets/images/client1.png';
import client2 from '../assets/images/client2.jpg';

// Managers Images
import UsamaSir from '../assets/images/UsamaSir.jpeg';
import MudassarSir from '../assets/images/mudassar.jpeg';
import WaitlistModal from '../components/popup/WaitlistModal';
import JoinPlatformCta from '../components/landing/JoinPlatformCta';
import SehrozSir from '../assets/images/ShehrozSir.jpeg';

import hiraImg from '../assets/images/HiraImg.svg';
import samiaImg from '../assets/images/samia.png';
import ozainImg from '../assets/images/ozain_fixed.png';
import FrameWiseImg from '../assets/images/FrameWise-Logo.png';
import { useMediaQuery } from 'react-responsive';
import SubscriptionModal from '../components/popup/SubscriptionModal';
import LandingPageModal from '../components/popup/LandingPageModal';
import LoginPopup from '../components/popup/LoginPopup';
import CustomInfoModal from '../components/popup/CustomInfoModal';
import Robot_Loader from '../assets/images/RobotLoader.png';
import { FiArrowRight } from 'react-icons/fi';
import FooterLangCurrency from '../components/footer/FooterLangCurrency';
import { baseURL } from '../config';
import { useAuth } from '../context/AuthContext';
import RoadmapSection from './LandingPageRoadmap';
import TestimonialSection from './TestimonialSection';
import LeadershipSection from './LeadershipSection';
import WaitingListSection from './WaitingListSection';
import InteractiveShowcaseSection from '../components/landing/InteractiveShowcaseSection';
import EarlyAccessPopup from '../components/popup/EarlyAccessPopup';
import {
  shouldShowEarlyAccessPopup,
  markEarlyAccessPopupDismissed,
} from '../components/early-access/earlyAccessStorage';
import paths from '../routes/paths';
import { isPreLaunchActive } from '../utils/platformLaunch';

import { toast } from 'react-toastify';
import SampleModels from '../Popup/SampleModels';


const LandingPage = () => {
  const { pathname, hash, key } = useLocation();
  const navigate = useNavigate();
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const landingRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isMobileProductOpen, setIsMobileProductOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  const handleProductMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsProductDropdownOpen(true);
  };

  const handleProductMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsProductDropdownOpen(false);
    }, 180);
  };

  useEffect(() => {
    const section = landingRef.current;
    if (!section) return;

    const handleScroll = () => {
      const scrollTop = section.scrollTop;
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

  // // useEffect ko fix karen
  // // useEffect(() => {
  // //   const handleScroll = () => {
  // //     console.log('scrollY', window.scrollY);
  // //     setScrolled(window.scrollY > 50);
  // //   };

  // //   window.addEventListener('scroll', handleScroll);
  // //   return () => window.removeEventListener('scroll', handleScroll);
  // // }, []);
  // // Create a ref for the scrollable div
  // const scrollableDivRef = useRef(null);

  // useEffect(() => {
  //   // Get the actual DOM element that scrolls
  //   const scrollableElement = scrollableDivRef.current;

  //   if (!scrollableElement) {
  //     console.error('Scrollable div ref is not attached to any element.');
  //     return;
  //   }

  //   const handleScroll = () => {
  //     // Use scrollableElement.scrollTop instead of window.scrollY
  //     setIsScrolled(scrollableElement.scrollTop > 30);
  //   };

  //   // Add the scroll listener to the div, not the window
  //   scrollableElement.addEventListener('scroll', handleScroll);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     scrollableElement.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenLogin = () => {
    setSubscriptionModalOpen(false);
    setShowLoginModal(true);
  };

  const flagColors = {
    USA: '#B22234',
    Spain: '#AA151B',
    Singapore: '#ED2939',
    'United States': '#B22234',
    Australia: '#00008B',
  };

  const testimonials = [
    {
      name: 'Victoria Akyea',
      role: 'USA',
      text: 'It’s been a pleasure working and collaborating with Arslan and the AI 3D Scanning team! They are an amazingly innovative team that eagerly tackle even complex  projects in any sector with ease. We were amazed at the speed of execution they can deliver, and so appreciated their professionalism and expertise in helping us accomplish our vision. Truly honored to partner with a company that has such a bold and pioneering vision.',
      image: FrameWiseImg,
    },
    {
      name: 'Antonio Vegan',
      role: 'Spain',
      text: 'I HIGHLY recommend Medtronix for AI development services, especially working with Islaava and his team. Their CODE expertise and thorough DOCUMENTATION truly EXCEEDED my expectations, coupled with Islaava’s deep understanding and quick responsiveness. It was an AMAZING experience with great outcomes!',
      image: client1,
    },
    {
      name: 'Ganeshkumar',
      role: 'Singapore',
      text: 'Really an awesome person to work with, fast replies , quality work and hardworking ',
      image: null,
    },
    {
      name: 'Shakesfuture',
      role: 'United States',
      text: '5 stars all around. great guy to work with. will work with again',
      image: null,
    },
    {
      name: 'Neil Kemp',
      role: 'Australia',
      text: 'Ahmad completed my task perfectly. He was on budget, lightning fast and communicated with me when I asked a question. When he finished the task he sent me a video of the program working and a walk through comprehensive video on how to install and run the new program. I could not be any happier with the service. Neil. Sydney, Australia.',
      image: null,
    },
    {
      name: 'Zheyu X',
      role: 'Australia',
      text: 'Ahmad and his team are very hard workers producing for me excellent results. I can always run ideas past Ahmad to see if they can be done. Most times they can be done. He is very proffessional and i will be using many many more times. Thank you for all the hard work. I am super impressed with what you have delivered.',
      image: null,
    },
    {
      name: 'Edwin Koort',
      role: 'Australia',
      text: 'I hired this company to design my website, and I was completely satisfied. From the beginning, they showed a high level of professionalism, listened to my needs, and offered tailored solutions.The final design was modern, functional, and fully responsive. The process was transparent, with timely deliveries and great communication. Plus, the post-launch support has been outstanding.',
      image: client2,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(1);
  const [scaledIndex, setScaledIndex] = useState(null);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleCards = () => {
    const leftIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
    const rightIndex = (activeIndex + 1) % testimonials.length;
    return [leftIndex, activeIndex, rightIndex];
  };

  useEffect(() => {
    setScaledIndex(null);
    const timer = setTimeout(() => {
      setScaledIndex(activeIndex);
    }, 500);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const visibleCards = getVisibleCards();

  // hide scrollbar
  // useEffect(() => {
  //   const css = `
  //     html, body {
  //       scrollbar-width: none !important;
  //       -ms-overflow-style: none !important;
  //     }
  //     html::-webkit-scrollbar,
  //     body::-webkit-scrollbar {
  //       display: none !important;
  //     }
  //   `;

  //   const style = document.createElement('style');
  //   style.innerHTML = css;
  //   document.head.appendChild(style);

  //   return () => {
  //     document.head.removeChild(style);
  //   };
  // }, []);

  const pills = [
    { label: 'Gaming', icon: rightarrow, target: '3d-Sample' },
    { label: 'AR/VR', icon: rightarrow, target: '3d-Sample' },
    { label: 'E-commerce', icon: rightarrow, target: '3d-Sample' },
    { label: 'Digital Twins', icon: rightarrow, target: '3d-Sample' },
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

  const trustedLogos = [
    { src: google, alt: 'Google for Startups', label: 'Program', style: { width: 130, marginTop: 6 } },
    { src: googleCloud, alt: 'Google Cloud', label: 'Program', style: { width: 130 } },
    { src: nvidia, alt: 'NVIDIA', label: 'Program', style: { width: 130 } },
    { src: PITB, alt: 'PITB', label: 'Program', style: { width: 37 } },
    { src: reginalPlan, alt: 'Regional Plan', label: 'Pilot', style: { width: 66 } },
    { src: consulting, alt: 'Hiller Consulting', label: 'Advisor', style: { width: 76 } },
  ];

  const trustedLogosRef = useRef(null);

  useEffect(() => {
    const track = trustedLogosRef.current;
    if (!track) return;

    let animationId;
    let isPaused = false;
    const speed = 0.12;

    const animate = () => {
      if (!isPaused) {
        track.scrollLeft += speed;

        const halfWidth = track.scrollWidth / 2;

        if (track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth;
        }
      }
      animationId = requestAnimationFrame(animate);
      return animationId;
    };

    animationId = requestAnimationFrame(animate);

    const pause = () => { isPaused = true; };
    const resume = () => { isPaused = false; };

    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);

    return () => {
      cancelAnimationFrame(animationId);
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', resume);
    };
  }, []);

  // useEffect(() => {
  //   if (!isMobile || !trustedLogosRef.current) return;
  //   let scrollAmount = 0;
  //   const logoWidth = 140;
  //   const interval = setInterval(() => {
  //     scrollAmount += logoWidth;
  //     if (
  //       scrollAmount >=
  //       trustedLogosRef.current.scrollWidth - trustedLogosRef.current.clientWidth
  //     ) {
  //       scrollAmount = 0;
  //     }
  //     trustedLogosRef.current.scrollTo({
  //       left: scrollAmount,
  //       behavior: 'smooth',
  //     });
  //   }, 1800);
  //   return () => clearInterval(interval);
  // }, [isMobile]);

  useEffect(() => {
    if (hash === '') {
      window.scrollTo(0, 0);
    } else {
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
  const [modalData, setModalData] = useState(null);
  const videoRef = useRef(null);
  const location = useLocation();

  const [isPlaying, setIsPlaying] = useState(false);

  const [openIndex, setOpenIndex] = useState(null);

  const [models, setModels] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredModels = React.useMemo(() => {
    if (!searchQuery.trim()) return models;
    const query = searchQuery.toLowerCase().trim();
    return models.filter((model) => 
      (model.title || model.name || '').toLowerCase().includes(query) ||
      (model.description || '').toLowerCase().includes(query)
    );
  }, [models, searchQuery]);

  const [showAllModels, setShowAllModels] = useState(false);

  const [error, setError] = useState('');

  const { token } = useAuth();

  const fetchModels = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(`${baseURL}/home/models`, { headers });
      const data = await response.json();
      console.log('Full model API response:', data);

      setModels(data.models || data);
    } catch (error) {
      console.error('Error fetching models:', error);
      setError('Failed to load models.');
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  // FAQ data

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

  // useEffect(() => {
  //   const slider = new window.Splide('#team-slider', {
  //     type: 'loop',
  //     perPage: 5,
  //     perMove: 1,
  //     pagination: false,
  //     arrows: false,
  //     autoplay: true,
  //     interval: 2000,
  //     gap: '1.5rem',
  //     drag: true,
  //     focus: 'center',
  //     breakpoints: {
  //       1200: { perPage: 3 },
  //       768: { perPage: 3 },
  //       576: { perPage: 1 },
  //     },
  //   }).mount();

  //   // Custom Navigation Buttons
  //   const prevBtn = document.getElementById('prevBtn');
  //   const nextBtn = document.getElementById('nextBtn');

  //   prevBtn?.addEventListener('click', () => slider.go('<'));
  //   nextBtn?.addEventListener('click', () => slider.go('>'));

  //   return () => {
  //     slider.destroy();
  //     prevBtn?.removeEventListener('click', () => { });
  //     nextBtn?.removeEventListener('click', () => { });
  //   };
  // }, []);

  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();

      setIsPlaying(true);
    } else {
      videoRef.current.pause();

      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Auto-scroll animation

    const track = document.querySelector('.logo_track');

    if (track) {
      let animationFrame;

      let scrollSpeed = 1; // Adjust speed as needed

      const animate = () => {
        track.scrollLeft += scrollSpeed;

        if (track.scrollLeft >= track.scrollWidth - track.clientWidth) {
          track.scrollLeft = 0;
        }

        animationFrame = requestAnimationFrame(animate);
      };

      animate();

      // Pause on hover

      track.addEventListener('mouseenter', () => {
        cancelAnimationFrame(animationFrame);
      });

      track.addEventListener('mouseleave', () => {
        animationFrame = requestAnimationFrame(animate);
      });

      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, []);

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [showEarlyAccessPopup, setShowEarlyAccessPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!shouldShowEarlyAccessPopup()) return undefined;

    const timer = setTimeout(() => {
      setShowEarlyAccessPopup(true);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseEarlyAccessPopup = () => {
    markEarlyAccessPopupDismissed();
    setShowEarlyAccessPopup(false);
  };

  const handleEarlyAccessSignUp = () => {
    markEarlyAccessPopupDismissed();
    setShowEarlyAccessPopup(false);
    navigate(token ? paths.dashboard : paths.signup);
  };

  useEffect(() => {
    const section = document.querySelector('.slidertwooo');
    if (!section) return;

    const items = Array.from(section.querySelectorAll('.testimonial-item'));
    if (items.length < 3) return;

    const prevBtn = section.querySelector('#prevBtn');
    const nextBtn = section.querySelector('#nextBtn');

    // Read data from DOM
    const readCard = (item) => ({
      avatar: item.querySelector('.testimonial-avatar img')?.src || '',
      text: item.querySelector('.testimonial-text p')?.innerHTML || '',
      name: item.querySelector('.author-name')?.textContent || '',
      title: item.querySelector('.author-title')?.textContent || '',
    });

    const slides = items.map(readCard);
    let currentIndex = 1;

    const setCard = (item, data, isActive) => {
      const avatarImg = item.querySelector('.testimonial-avatar img');
      const textP = item.querySelector('.testimonial-text p');
      const nameEl = item.querySelector('.author-name');
      const titleEl = item.querySelector('.author-title');
      const card = item.querySelector('.testimonial-card');

      if (avatarImg) avatarImg.src = data.avatar;
      if (textP) textP.innerHTML = data.text;
      if (nameEl) nameEl.textContent = data.name;
      if (titleEl) titleEl.textContent = data.title;
      if (card) card.classList.toggle('active', isActive);
    };

    const getDataTriple = () => ({
      left: slides[(currentIndex - 1 + slides.length) % slides.length],
      center: slides[currentIndex % slides.length],
      right: slides[(currentIndex + 1) % slides.length],
    });

    const swapWithAnimation = (item, data, isActive) => {
      const card = item.querySelector('.testimonial-card');
      const duration = 250;
      if (!card) {
        setCard(item, data, isActive);
        return;
      }

      card.style.willChange = 'opacity, transform';
      card.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
      card.style.opacity = '0';
      card.style.transform = 'translateY(6px) scale(0.995)';

      setTimeout(() => {
        setCard(item, data, isActive);
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
        setTimeout(() => {
          card.style.transition = '';
          card.style.willChange = '';
          card.style.opacity = '';
          card.style.transform = '';
        }, duration + 50);
      }, duration);
    };

    const render = (animate = false) => {
      const { left, center, right } = getDataTriple();
      if (animate) {
        swapWithAnimation(items[0], left, false);
        swapWithAnimation(items[1], center, true);
        swapWithAnimation(items[2], right, false);
      } else {
        setCard(items[0], left, false);
        setCard(items[1], center, true);
        setCard(items[2], right, false);
      }
    };

    const goToNext = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      render(true);
    };

    const goToPrev = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      render(true);
    };

    prevBtn?.addEventListener('click', goToPrev);
    nextBtn?.addEventListener('click', goToNext);

    const disableDrag = (e) => {
      e.preventDefault();
    };

    const wrapper = section.querySelector('.testimonials-wrapper');
    if (wrapper) {
      wrapper.style.touchAction = 'none';
      wrapper.addEventListener('touchstart', disableDrag, { passive: false });
      wrapper.addEventListener('touchmove', disableDrag, { passive: false });
      wrapper.addEventListener('touchend', disableDrag, { passive: false });
      wrapper.addEventListener('mousedown', disableDrag);
    }

    let autoSlideInterval = setInterval(goToNext, 4000);

    return () => {
      prevBtn?.removeEventListener('click', goToPrev);
      nextBtn?.removeEventListener('click', goToNext);
      if (wrapper) {
        wrapper.removeEventListener('touchstart', disableDrag, { passive: false });
        wrapper.removeEventListener('touchmove', disableDrag, { passive: false });
        wrapper.removeEventListener('touchend', disableDrag, { passive: false });
        wrapper.removeEventListener('mousedown', disableDrag);
      }
      clearInterval(autoSlideInterval);
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      const clicked = e.currentTarget;
      const slide = clicked.closest('.team-slide');

      const imgSrc = slide.querySelector('.img-container img')?.src || '';
      const name = slide.querySelector('h5')?.textContent || '';
      const role = slide.querySelector('.twocards, .teamtitle')?.textContent || '';
      const desc = slide.querySelector('p')?.textContent || '';

      const fullDataMap = {
        'Arslan Ahmad': {
          Image: ArslanImg2,
          title: 'Founder - CEO & Product Lead',
          desc: [
            'Arslan drives the vision and product innovation at AI 3D Scanning Solutions Inc., leading end-to-end product development from concept to deployment. With a focus on cutting-edge AI and LLM integration, he spearheads strategic partnerships oversees market positioning, and ensures the platform delivers transformative value to global industries.',
            ' His leadership blends deep technical understanding with a sharp business acumen to scale AI3D’s solutions across multiple sectors.',
          ],
          expertise: [
            'AI-driven product innovation & development',
            'Strategic partnerships & fundraising',
            'Scalable platform architecture & go-to-market strategy',
            'Team management & scaling',
            'Product management',
          ],
          linkedin: 'https://www.linkedin.com/in/arslan-ahmad-4b123a1b5/',
          philosophy:
            'Build tech that’s not just advanced but accessible, impactful, and scalable for the world',
        },

        // 'Dr. Joel Hillier': {
        //   Image: CeoImg,
        //   title: 'Growth Co-Founder – Business & AI Strategy Advisor',

        //   desc: [
        //     'Dr. Hillier provides strategic guidance on business growth, market positioning, and AI development direction. With expertise spanning artificial intelligence, data-driven innovation, and commercial strategy, he ensures that AI3D’s technological roadmap aligns with evolving market demands.',
        //     'His role bridges technical capabilities with high-impact business outcomes, supporting scalable adoption across diverse industries',
        //   ],
        //   expertise: [
        //     'AI strategy & market alignment',
        //     'Global business growth & scaling strategies',
        //     'Bridging research with commercial applications',
        //   ],
        //   linkedin: 'https://www.linkedin.com/in/joelhillier/',
        //   philosophy: '.........',
        // },
        'Shehroz Shabbir': {
          Image: SehrozSir,
          title: 'Web Development Manager',
          desc: [
            'As the Full Stack Developer at AI3D Scanning Solutions, Shehroz Shabbir is the technical backbone behind the company’s innovative platforms. Skilled in both front-end and back-end development, he ensures that every digital product delivers a seamless, high-performance user experience.',
            'Shehroz’s expertise spans coding, system architecture, and database management, enabling him to translate complex business needs into functional, efficient, and scalable solutions. His work powers the AI-driven and 3D scanning technologies that define the company’s cutting-edge services.',
          ],
          expertise: [
            'Full Stack Web Development',
            'Front-End & Back-End Programming',
            'Database Design & Management',
            'UI/UX Implementation',
            'Scalable Software Solutions',
          ],
          linkedin: 'https://www.linkedin.com/in/m-shehroz-shabbir/',
          philosophy:
            '"Great technology isn’t just built — it’s crafted with precision, creativity, and purpose."',
        },
        'Hira Aziz': {
          Image: hiraImg,
          title: 'Creative Media Manager & Video Editor',

          desc: [
            'Hira is the creative force behind the visual identity of AI3D Scanning Solutions. With over 3 years of professional experience as a video editor and creative strategist, she transforms complex ideas into visually compelling stories that captivate audiences and strengthen the company’s brand presence.',
            'As Creative Media Manager, Hira oversees the planning, production, and delivery of high-quality multimedia content. Her expertise in video editing, graphic design, and creative direction ensures that every project reflects the company’s commitment to innovation and excellence in AI and 3D scanning solutions.',
          ],
          expertise: [
            'Creative Direction & Brand Storytelling',
            'Video Editing & Post-Production',
            'Motion Graphics & Visual Effects',
            'Multimedia Campaign Development',
            'Graphic Design & Visual Communication',
            'Content Strategy & Execution',
          ],
          linkedin: 'https://www.linkedin.com/in/hira-chaudhary-287186287/',
          philosophy: '"Great design doesn’t just capture attention it inspires connection."',
        },
        'Usama Ahmad': {
          Image: UsamaSir,
          title: 'Finance Manager',

          desc: [
            'As the Finance Manager at AI3D Scanning Solutions, Usama plays a pivotal role in ensuring the company’s financial health and long-term stability. With strong expertise in financial planning, budgeting, and strategic analysis, he oversees all aspects of accounting, reporting, and compliance, ensuring that business decisions are backed by accurate and insightful financial data.',
            ' Usama is committed to optimizing resources, managing risks, and supporting the company’s rapid growth in the cutting-edge field of AI and 3D scanning technology. His meticulous approach to financial management empowers AI3D Scanning Solutions to maintain operational efficiency while driving innovation in the industry.',
          ],
          expertise: [
            'Financial Planning & Analysis',
            'Budget Development & Cost Control',
            'Risk Assessment & Compliance',
            'Cash Flow Management',
            'Strategic Decision Support',
            'Process Optimization',
          ],
          linkedin: 'https://www.linkedin.com/in/usama-khan-793960337/',
          philosophy:
            '"A strong financial foundation is the backbone of innovation. My mission is to ensure every number tells a story that drives the company forward.”',
        },
        'Mudassar Farooq': {
          Image: MudassarSir,
          title: 'HR & Business Development Manager',
          desc: [
            'Mudassar is a dynamic professional at AI3D Scanning Solutions, combining strategic business development expertise with a strong foundation in human resources. In his business development role, he focuses on identifying growth opportunities, building partnerships, and expanding the company’s reach in the AI and 3D scanning industry.',
            'Mudassar is a dynamic professional at AI3D Scanning Solutions, combining strategic business development expertise with a strong foundation in human resources. In his business development role, he focuses on identifying growth opportunities, building partnerships, and expanding the company’s reach in the AI and 3D scanning industry.',
          ],
          expertise: [
            'Business Growth Strategy & Market Expansion',
            'Client Relationship Management',
            'Partnership Development & Networking',
            'Talent Acquisition & Retention',
            'Organizational Development',
            'Strategic Planning & Execution',
          ],
          linkedin: 'https://www.linkedin.com/in/m-mudassar-farooq/',
          philosophy:
            '"Success is built on strong relationships — both with clients and within the team."',
        },
        'Samia Rasheed': {
          Image: samiaImg,
          title: 'Social Media Manager & Associate HR',

          desc: [
            'Samia brings creativity, communication expertise, and people-focused leadership to AI3D Scanning Solutions. As Social Media Manager, she crafts engaging digital content and manages the company’s online presence, ensuring the brand’s voice reaches the right audience with impact and consistency.',
            ' In her role as Associate HR, Samia supports a positive and productive work environment by assisting in talent acquisition, employee engagement, and team coordination. Her unique blend of marketing insight and human resource skills helps bridge the gap between the company’s brand identity and its internal culture.',
          ],
          expertise: [
            'Social Media Strategy & Content Creation',
            'Brand Awareness & Audience Engagement',
            'Talent Acquisition & Onboarding',
            'Internal Communication & Collaboration',
            'Creative Campaign Development',
          ],
          linkedin: 'https://www.linkedin.com/in/samiarasheed/',
          philosophy:
            '"A strong brand starts with inspired people — and inspired people create the stories worth sharing."',
        },
        'Ozain Ahmad': {
          Image: ozainImg,
          title: 'Junior Business Developer',
          desc: [
            'Ozain contributes to business growth and strategic partnerships at AI 3D Scanning Solutions.',
            'His focus is on strategic outreach, client communication, and supporting long-term business partnerships across industries.',
          ],
          expertise: [
            'Business Development',
            'Market Research',
            'Client Relations',
            'Lead Generation',
            'Strategic Partnerships',
          ],
          linkedin: 'https://www.linkedin.com/',
          philosophy:
            '"Driven by curiosity and dedicated to creating meaningful business connections and growth."',
        },
      };

      const detailed = fullDataMap[name] || {
        title: role,
        description: desc,
        expertise: [],
        philosophy: '...',
      };

      // Set modal data
      setModalData({
        img: imgSrc,
        name: name,
        ...detailed,
      });
    };

    const buttons = document.querySelectorAll('.learn-more, .learn-m');
    buttons.forEach((btn) => btn.addEventListener('click', handler));

    return () => {
      buttons.forEach((btn) => btn.removeEventListener('click', handler));
    };
  }, []);
  // const [isScrolled, setIsScrolled] = useState(false); // Use this state
  // const landingSectionRef = useRef(null);

  // useEffect(() => {
  //   const section = landingSectionRef.current;
  //   if (!section) {
  //     console.error('Landing section ref is not attached to any element.');
  //     return;
  //   }

  //   const handleScroll = () => {
  //     // Use section.scrollTop instead of window.scrollY
  //     setIsScrolled(section.scrollTop > 30); // Target 30px as requested
  //   };

  //   section.addEventListener('scroll', handleScroll);
  //   return () => section.removeEventListener('scroll', handleScroll);
  // }, []);

  // useEffect(() => {
  //   const handleScroll = () => setIsScrolled(window.scrollY > 30);
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  // useEffect ko fix karen
  // useEffect(() => {
  //   const handleScroll = () => {
  //     console.log('scrollY', window.scrollY);
  //     setScrolled(window.scrollY > 50);
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);
  // Create a ref for the scrollable div


 const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribeLoading(true);
    try {
      const res = await fetch(`${baseURL}/subscriber`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.status !== 'error') {
        toast.success(data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        toast.error(data.message || 'Something went wrong.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setSubscribeLoading(false);
    }
  };

  return (
    <>
      <div className="landing-page-section ai_3d_landing" ref={landingRef}>
        {/* ========================= navbar ======================= */}

        <div className="main_head" style={{ backgroundColor: '#FFEDF7' }}>
          <main className="container py-sm-4 pt-4">
            {/* ========================= navbar ======================= */}

            <header
              className={`a3d-header container-fluid mb-4 a3d-fade-in ${isScrolled ? 'a3d-header-scrolled' : ''}`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <Link to="/" className="a3d-header-logo-link">
                  <img src={logo} alt="AI 3D Scanning Logo" className="a3d-header-logo" />
                </Link>

                {/* Menu Button for Mobile */}

                <button
                  className="navbar-toggler d-lg-none border-0"
                  type="button"
                  onClick={() => setIsOpen(true)}
                  aria-label="Open navigation menu"
                  aria-expanded={isOpen}
                  aria-controls="mobile-sidebar-nav"
                >
                  <i className="fas fa-bars" aria-hidden="true" />
                </button>

                {/* Desktop Nav */}

                <nav className="d-none d-lg-flex gap-lg-3 gap-xl-4 align-items-center">
                  <Link
                    to="/"
                    className={`a3d-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                  >
                    Home
                  </Link>

                  {/* Product Mega Dropdown */}
                  <div
                    className="a3d-product-dropdown-container"
                    onMouseEnter={handleProductMouseEnter}
                    onMouseLeave={handleProductMouseLeave}
                  >
                    <button
                      type="button"
                      className="a3d-nav-link a3d-product-trigger"
                      onClick={() => setIsProductDropdownOpen((prev) => !prev)}
                      aria-expanded={isProductDropdownOpen}
                    >
                      Product
                      <FaChevronDown
                        className={`a3d-product-chevron ${isProductDropdownOpen ? 'open' : ''}`}
                      />
                    </button>

                    {isProductDropdownOpen && (
                      <div className="a3d-product-menu" role="menu">
                        <div className="a3d-product-column">
                          <Link
                            to="/3dio/new/scan"
                            className="a3d-product-item"
                            onClick={() => setIsProductDropdownOpen(false)}
                          >
                            <span className="a3d-product-item-title">Text to 3D</span>
                            <span className="a3d-product-item-desc">Prompt to finished asset</span>
                          </Link>
                          <Link
                            to="/3dio/new/scan"
                            className="a3d-product-item"
                            onClick={() => setIsProductDropdownOpen(false)}
                          >
                            <span className="a3d-product-item-title">Multi-image to 3D</span>
                            <span className="a3d-product-item-desc">Multiple views fused</span>
                          </Link>
                          <Link
                            to="/3dio/new/scan"
                            className="a3d-product-item"
                            onClick={() => setIsProductDropdownOpen(false)}
                          >
                            <span className="a3d-product-item-title">Skeleton & rigging</span>
                            <span className="a3d-product-item-desc">Auto-rig with motion presets</span>
                          </Link>
                          <Link
                            to="/3dio/workspace"
                            className="a3d-product-item"
                            onClick={() => setIsProductDropdownOpen(false)}
                          >
                            <span className="a3d-product-item-title">Workspace</span>
                            <span className="a3d-product-item-desc">Projects, versions, library</span>
                          </Link>
                        </div>

                        <div className="a3d-product-column">
                          <Link
                            to="/3dio/new/scan"
                            className="a3d-product-item"
                            onClick={() => setIsProductDropdownOpen(false)}
                          >
                            <span className="a3d-product-item-title">Image to 3D</span>
                            <span className="a3d-product-item-desc">One photo, one model</span>
                          </Link>
                          <Link
                            to="/3dio/new/scan"
                            className="a3d-product-item"
                            onClick={() => setIsProductDropdownOpen(false)}
                          >
                            <span className="a3d-product-item-title">Video to 3D</span>
                            <span className="a3d-product-item-desc">Turntable capture</span>
                          </Link>
                          <Link
                            to="/3dio/"
                            className="a3d-product-item"
                            onClick={() => setIsProductDropdownOpen(false)}
                          >
                            <span className="a3d-product-item-title">Editor</span>
                            <span className="a3d-product-item-desc">Remesh, clean, texture</span>
                          </Link>
                          <Link
                            to="/3dio/settings/team"
                            className="a3d-product-item"
                            onClick={() => setIsProductDropdownOpen(false)}
                          >
                            <span className="a3d-product-item-title">Teams</span>
                            <span className="a3d-product-item-desc">Roles, seats, SSO</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/3dio/api-sdk"
                    className={`a3d-nav-link ${location.pathname === '/3dio/api-sdk' ? 'active' : ''}`}
                  >
                    API & Pricing
                  </Link>

                  <a href="/#3d-Sample" className="a3d-nav-link">
                    3D Samples
                  </a>

                  <a href="/#Leadership" className="a3d-nav-link">
                    Leadership
                  </a>
                </nav>

                <div className="d-none d-lg-flex gap-2 align-items-center">
                  <Link to="https://calendly.com/arslan-medtronix/30min" className="a3d-book-demo-btn">
                    Schedule Meeting
                  </Link>
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
                  <img src={logo} alt="AI 3D Scanning Logo" className="a3d-header-logo" />
                </Link>

                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setIsOpen(false)}
                />
              </div>

              <nav id="mobile-sidebar-nav" className="d-flex flex-column gap-2 px-3 pb-3">
                <Link
                  to="/"
                  className={`a3d-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                  Home
                </Link>

                {/* Mobile Product Accordion */}
                <div className="a3d-mobile-product-group">
                  <button
                    type="button"
                    className="a3d-nav-link a3d-mobile-product-toggle"
                    onClick={() => setIsMobileProductOpen((prev) => !prev)}
                  >
                    <span>Product</span>
                    <FaChevronDown
                      className={`a3d-product-chevron ${isMobileProductOpen ? 'open' : ''}`}
                    />
                  </button>

                  {isMobileProductOpen && (
                    <div className="a3d-mobile-product-menu">
                      <Link
                        to="/3dio/new/scan"
                        className="a3d-mobile-product-item"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="a3d-product-item-title">Text to 3D</span>
                        <span className="a3d-product-item-desc">Prompt to finished asset</span>
                      </Link>
                      <Link
                        to="/3dio/new/scan"
                        className="a3d-mobile-product-item"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="a3d-product-item-title">Image to 3D</span>
                        <span className="a3d-product-item-desc">One photo, one model</span>
                      </Link>
                      <Link
                        to="/3dio/new/scan"
                        className="a3d-mobile-product-item"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="a3d-product-item-title">Multi-image to 3D</span>
                        <span className="a3d-product-item-desc">Multiple views fused</span>
                      </Link>
                      <Link
                        to="/3dio/new/scan"
                        className="a3d-mobile-product-item"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="a3d-product-item-title">Video to 3D</span>
                        <span className="a3d-product-item-desc">Turntable capture</span>
                      </Link>
                      <Link
                        to="/3dio/new/scan"
                        className="a3d-mobile-product-item"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="a3d-product-item-title">Skeleton & rigging</span>
                        <span className="a3d-product-item-desc">Auto-rig with motion presets</span>
                      </Link>
                      <Link
                        to="/3dio/"
                        className="a3d-mobile-product-item"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="a3d-product-item-title">Editor</span>
                        <span className="a3d-product-item-desc">Remesh, clean, texture</span>
                      </Link>
                      <Link
                        to="/3dio/workspace"
                        className="a3d-mobile-product-item"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="a3d-product-item-title">Workspace</span>
                        <span className="a3d-product-item-desc">Projects, versions, library</span>
                      </Link>
                      <Link
                        to="/3dio/settings/team"
                        className="a3d-mobile-product-item"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="a3d-product-item-title">Teams</span>
                        <span className="a3d-product-item-desc">Roles, seats, SSO</span>
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/3dio/api-sdk"
                  className={`a3d-nav-link ${location.pathname === '/3dio/api-sdk' ? 'active' : ''}`}
                >
                  API & Pricing
                </Link>

                <a href="#3d-Sample" className="a3d-nav-link">
                  3D Samples
                </a>

                <a href="#Leadership" className="a3d-nav-link">
                  Leadership
                </a>

                <div className="d-flex flex-column gap-2">
                  <Link to="https://calendly.com/arslan-medtronix/30min" className="a3d-book-demo-btn">
                    Schedule Meeting
                  </Link>
                  <JoinPlatformCta
                    onWaitlistOpen={() => setIsWaitlistOpen(true)}
                    onAfterClick={() => setIsOpen(false)}
                  />
                </div>
              </nav>
            </div>

            {/* Overlay for background click */}

            {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
          </main>

          {/* ========================= Hero Section ======================= */}

          <div className="container" style={{ paddingBottom: 20 }}>
            <div
              className="row align-items-center"
              style={{ marginTop: isMobile ? '-2.5rem' : '-4rem' }}
            >
              <div
                className="col-lg-7 p-lg-0"
              // style={{ marginTop: isMobile ? '0rem' : '-2rem' }}
              >
                <motion.h1
                  className="a3d-title"
                  style={{ marginTop: 30 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="a3d-gradient-span-text">
                    Turn images, video, and text into
                    <br className="a3d-title-break" />
                    production-ready 3D assets
                    <br className="a3d-title-break" />
                    in about{' '}
                    <span className="a3d-seconds-wrap">
                      <img src={elipse} alt="" className="ellipse-img-seconds" />
                      30 seconds.
                    </span>
                  </span>
                </motion.h1>

                <motion.p
                  className="a3d-description mt-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Building the &quot;Canva of 3D&quot; — an AI native end-to-end platform that turns
                  images, video, and text into 3D assets in approximately 30 seconds, with editing,
                  asset management, and developer APIs built in.
                </motion.p>

                <div
                  className="a3d-btn d-flex align-items-center gap-3 flex-wrap a3d-slide-up mb-4"
                  style={{ animationDelay: '0.2s' }}
                >
                  {token ? (
                    <JoinPlatformCta onWaitlistOpen={() => setIsWaitlistOpen(true)} />
                  ) : (
                    <Link to="/signin" className="a3d-join-btn">
                      Log in for free
                    </Link>
                  )}
                  <Link to="/book-demo">
                    <button
                      className="btn btn-warning text-white"
                      style={{ backgroundColor: '#FF9C3E' }}
                    >
                      Book a Demo
                    </button>
                  </Link>

                  <a href="#video">
                    <div className="a3d-play-circle">
                      <img src={arrow2} alt="Scroll to Video" style={{ width: '34%', marginLeft: 6 }} />
                    </div>
                  </a>
                </div>

                <div
                  className="a3d-pills-scroll d-flex gap-3 my-4 a3d-slide-up"
                  id="pillSlider"
                  ref={pillsRef}
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
                        const target = document.getElementById(pill.target);
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      <span>{pill.label}</span>
                      <img src={pill.icon} alt={`${pill.label} Icon`} style={{ paddingTop: 2 }} />
                    </div>
                  ))}
                </div>

              </div>

              <div className="col-lg-5 p-lg-0">
                {/* {{-- <div> --}} */}

                {/* <img
                  src={robot}
                  alt="3D Robot"
                  className="img-fluid main-image a3d-pulse-animation"
                  style={{
                    maxWidth: 580,

                    position: 'absolute',

                    top: '8.5rem',

                    right: '1rem',
                  }}
                /> */}

                {/* <MiniBotViewer modelPath="/assets/images/mini_fixed.glb" /> */}

                <div style={{ position: 'relative', width: '100%', height: '500px' }}>
                  {/* Loader */}
                  {loading && (
                    <div className="loader-robot-container">
                      <img src={Robot_Loader} alt="Loading..." className="loader-robot-image" />
                    </div>
                  )}

                  {/* Model */}
                  {!loading && (
                    <model-viewer
                      src="/assets/images/mini_fixed.glb"
                      ar
                      ar-modes="webxr scene-viewer quick-look"
                      camera-controls
                      disable-zoom
                      tone-mapping="neutral"
                      // camera-target=""
                      shadow-intensity="1"
                      autoplay
                      // camera-orbit="35deg 85deg 9m"
                      camera-orbit="0deg 90deg 9m"
                      field-of-view="29.68deg"
                      reveal="auto"
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'transparent',
                        // marginTop: isMobile ? '0' : '-4rem',
                      }}
                    />
                  )}
                </div>

                {/* {{--

                      </div> --}} */}
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-8">
                <div
                  className="a3d-trusted d-flex align-items-center gap-1 a3d-slide-up"
                  style={{ animationDelay: '0.2s', marginTop: window.innerWidth < 768 ? 0 : 40, flexWrap: 'nowrap' }}
                >
                  <span className="trusted-label" style={{ fontSize: 14, marginRight: 10, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Trusted by:
                  </span>
                  <div
                    className="a3d-trusted-scroll-wrapper"
                    ref={trustedLogosRef}
                    onMouseEnter={() => {
                      if (trustedLogosRef.current) {
                        trustedLogosRef.current.style.animationPlayState = 'paused';
                      }
                    }}
                    onMouseLeave={() => {
                      if (trustedLogosRef.current) {
                        trustedLogosRef.current.style.animationPlayState = 'running';
                      }
                    }}
                  >
                    <div className="a3d-trusted-scroll-track">
                      {[...trustedLogos, ...trustedLogos].map((logo, idx) => (
                        <span className="a3d-logo-item" key={`${logo.alt}-${idx}`}>
                          <img src={logo.src} alt={logo.alt} style={{ ...logo.style, flexShrink: 0 }} />
                          <span className="a3d-logo-label">{logo.label}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================= Hero Section End ======================= */}
        </div>

        {/* ========================= Interactive Showcase Section (From pixels to worlds) ======================= */}
        <InteractiveShowcaseSection />

        {/* ========================= How it Work Section (Disabled / Commented Out) ======================= */}
        {false && (
        <motion.section
          className="service-cards mt-5 pt-md-4 pt-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container">
            <div className="text-center mb-4">
              <h2 className="section-title" style={{ fontSize: isMobile ? '29px' : '38px' }}>
                How it{' '}
                <span className="perfect-heading">
                  w
                  <span className="wr-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                    o
                    <img
                      src={elipse}
                      alt="Ellipse"
                      style={{
                        position: 'absolute',
                        top: '-17px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '2.5rem',
                        height: 'auto',
                        pointerEvents: 'none',
                        zIndex: 2,
                      }}
                    />
                  </span>
                  rks
                </span>
              </h2>

              <p className="section-subtitle">
                Transform Any 2D data into a High-Precision 3D{' '}
                <span className="d-none d-md-inline">
                  <br />
                </span>
                Model in approximately 30 seconds.
              </p>
            </div>

            <section className="py-3 py-lg-4 services-cards mt-2">
              <div className="container">
                <div className="row g-4">
                  {/* Step 01 */}
                  <motion.div
                    className="col-12 col-md-6 col-lg-4"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <div className="service-card d-flex flex-column justify-content-between h-100 position-relative" style={{ padding: '24px 24px 20px' }}>
                      <div>
                        <span
                          className="badge rounded-pill mb-3"
                          style={{
                            backgroundColor: '#de3996',
                            color: '#fff',
                            fontSize: '0.75rem',
                            padding: '6px 12px',
                            fontWeight: 600,
                          }}
                        >
                          Step 01
                        </span>
                        <h3 className="service-title">Upload or Capture 2D Data</h3>
                        <p className="service-desc">
                          Simply upload images, recorded video clips, or input descriptive text prompts
                          directly into our platform from mobile or web.
                        </p>
                      </div>
                      <div className="footer-wrapper mt-3">
                        <div className="service-footer">
                          <Link to="/3dio/new/scan" className="circle-btn" aria-label="Upload Now">
                            <svg
                              viewBox="0 0 24 24"
                              width={18}
                              height={18}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                            >
                              <path d="M5 12h11" />
                              <path d="M13 6l6 6-6 6" />
                            </svg>
                          </Link>
                          <Link to="/3dio/new/scan" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div
                              className="footer-text"
                              style={{
                                fontFamily: 'DM Sans',
                                fontWeight: 500,
                                fontStyle: 'Medium',
                              }}
                            >
                              Upload Now
                            </div>
                          </Link>
                        </div>
                        <div className="card-icon" aria-hidden="true">
                          <img src={design} alt="Upload Icon" />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Step 02 */}
                  <motion.div
                    className="col-12 col-md-6 col-lg-4"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <div className="service-card d-flex flex-column justify-content-between h-100 position-relative" style={{ padding: '24px 24px 20px' }}>
                      <div>
                        <span
                          className="badge rounded-pill mb-3"
                          style={{
                            backgroundColor: '#de3996',
                            color: '#fff',
                            fontSize: '0.75rem',
                            padding: '6px 12px',
                            fontWeight: 600,
                          }}
                        >
                          Step 02
                        </span>
                        <h3 className="service-title">Instant AI Reconstruction</h3>
                        <p className="service-desc">
                          Our proprietary AI algorithms turn your 2D inputs into high-precision 3D meshes,
                          generating sub-millimeter textures automatically in seconds.
                        </p>
                      </div>
                      <div className="footer-wrapper mt-3">
                        <div className="service-footer">
                          <a href="#3d-Sample" className="circle-btn" aria-label="See Demo">
                            <svg
                              viewBox="0 0 24 24"
                              width={18}
                              height={18}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                            >
                              <path d="M5 12h11" />
                              <path d="M13 6l6 6-6 6" />
                            </svg>
                          </a>
                          <div
                            className="footer-text"
                            style={{
                              fontFamily: 'DM Sans',
                              fontWeight: 500,
                              fontStyle: 'Medium',
                            }}
                          >
                            See Demo
                          </div>
                        </div>
                        <div className="card-icon" aria-hidden="true">
                          <img src={Modling} alt="Reconstruction Icon" />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Step 03 */}
                  <motion.div
                    className="col-12 col-md-6 col-lg-4"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <div className="service-card d-flex flex-column justify-content-between h-100 position-relative" style={{ padding: '24px 24px 20px' }}>
                      <div>
                        <span
                          className="badge rounded-pill mb-3"
                          style={{
                            backgroundColor: '#de3996',
                            color: '#fff',
                            fontSize: '0.75rem',
                            padding: '6px 12px',
                            fontWeight: 600,
                          }}
                        >
                          Step 03
                        </span>
                        <h3 className="service-title">Customize &amp; Export 3D Models</h3>
                        <p className="service-desc">
                          Fine-tune your 3D asset with instant web editing tools, then export directly to GLB,
                          OBJ, or USDZ for Gaming, AR/VR, E-commerce, and Digital Twins.
                        </p>
                      </div>
                      <div className="footer-wrapper mt-3">
                        <div className="service-footer">
                          <Link to="/3dio/new/scan" className="circle-btn" aria-label="Start Creating">
                            <svg
                              viewBox="0 0 24 24"
                              width={18}
                              height={18}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                            >
                              <path d="M5 12h11" />
                              <path d="M13 6l6 6-6 6" />
                            </svg>
                          </Link>
                          <Link to="/3dio/new/scan" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div
                              className="footer-text"
                              style={{
                                fontFamily: 'DM Sans',
                                fontWeight: 500,
                                fontStyle: 'Medium',
                              }}
                            >
                              Start Creating
                            </div>
                          </Link>
                        </div>
                        <div className="card-icon" aria-hidden="true">
                          <img src={store} alt="Export Icon" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          </div>
        </motion.section>
        )}

        {/* ========================= Services Section  ======================= */}

        <motion.section
          className="our-services"
          id="Services"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container">
            {/* <div className="text-center mb-5">
              <h2 className="section-title">
                Our{' '}
                <span className="perfect-heading">
                  <span className="wr-wrapper">
                    Servi
                    <img src={elipse} alt="Ellipse" className="ellipse-img" />c
                  </span>
                  es
                </span>
              </h2>

              <p className="section-subtitle">
                Lorem ipsum dolor sit amet consectetur. Auctor cursus
                <span className="d-none d-lg-inline">
                  <br />
                </span>
                a odio integer id morbi ac.
              </p>
            </div> */}

            <div className="business-section" id="aboutus">
              <div className="text-center mb-4">
                <h2 className="business-title">Our Services for Businesses</h2>

                <h3 className="business-heading mb-1">Business to Business</h3>

                <p className="business-description">
                  3DIO integrates seamlessly into your existing web, mobile, or desktop ecosystem
                  through robust APIs. Built for Gaming, AR/VR, E-commerce, and Digital Twins — our
                  AI converts 2D images, videos, and text into lifelike, interactive 3D models in
                  approximately 30 seconds. Flexible licensing and deployment options ensure a
                  perfect fit for your business goals.
                </p>
              </div>

              <div className="row">
                <motion.div
                  className="col-lg-6 mt-lg-0 mt-4"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="business-service">
                    <div className="business-service-icon">
                      <img src={gaming} alt="" />
                    </div>

                    <div className="business-service-content">
                      <h4>Gaming</h4>

                      <p>
                        Accelerate game development with instant AI powered 3D scanning - create
                        lifelike assets, immersive worlds and high detail characters faster and at
                        lower cost.
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="col-lg-6 mt-lg-0 mt-4"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="business-service">
                    <div className="business-service-icon">
                      <img src={vr} alt="" />
                    </div>

                    <div className="business-service-content">
                      <h4>AR/VR</h4>

                      <p>
                        Fuel next-gen AR/VR experiences with AI-generated 3D environments, realistic
                        avatars, and immersive assets - ideal for training, simulations, and
                        interactive products.
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="col-lg-6 mt-4"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="business-service">
                    <div className="business-service-icon">
                      <img src={e_commerce} alt="" />
                    </div>

                    <div className="business-service-content">
                      <h4>E-commerce</h4>

                      <p>
                        Increase online conversions with realistic 3D product displays and AR
                        try-ons - enhancing engagement, reducing returns, and improving customer
                        trust.
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="col-lg-6 mt-4"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="business-service">
                    <div className="business-service-icon">
                      <img src={machine} alt="" />
                    </div>

                    <div className="business-service-content">
                      <h4>Digital Twins</h4>

                      <p>
                        Create accurate digital twins from images and video for products, spaces,
                        and operations - enabling visualization, simulation, and faster
                        decision-making.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
              <p className="business-ambition">
                Expanding into construction, manufacturing, and healthcare visualization.
              </p>
            </div>

            <section className="client-services" style={{ paddingBottom: 35 }}>
              <div className="container">
                <div className="row align-items-center" style={{ justifyContent: 'space-between' }}>
                  <motion.div
                    className="col-lg-6 col-12 mb-4 order-lg-1 order-2"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    style={{
                      display: 'flex',

                      justifyContent: 'center',

                      alignItems: 'center',
                    }}
                  >
                    <div className="d-flex flex-column align-items-center">
                      <img
                        src={mobile}
                        alt="Mobile Preview"
                        className="img leap-img me-md-4 mx-2"
                      />
                      <div className="d-flex justify-content-center gap-0 mt-4 flex-wrap">
                        <button className="store-btn">
                          <div className="icon-wrapper">
                            <FaApple size={28} className="store-icon" />
                          </div>
                          <div className="store-text">
                            <span className="small-text">GET IT ON</span>
                            <span className="large-text">APP STORE</span>
                          </div>
                        </button>
                        <button className="store-btn">
                          <div className="icon-wrapper">
                            <img
                              src={googlePlayImg}
                              alt="Google Play"
                              className="store-icon google-play-icon-img"
                            />
                          </div>
                          <div className="store-text">
                            <span className="small-text">GET IT ON</span>
                            <span className="large-text">GOOGLE PLAY</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="client-section col-lg-5 col-12 mb-4 order-lg-2 order-1"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <div className="client-section-content">
                      <div className="client-section-title text-center">
                        Our Services for Clients
                      </div>

                      <h3 className="client-heading text-center">Business to Client</h3>

                      <p className="section-subtitle">
                        3DIO is an AI powered 3D scanning platform available on Android, iOS, and
                        Web designed to turn your 2D images into stunning, high precision,
                        photorealistic 3D models within seconds. No complex software, no technical
                        expertise just powerful results made simple.
                        <br />
                        <br />
                        With 3DIO, you can easily create, customize, and export professional quality
                        3D models for gaming, AR/VR experiences, product design, 3D printing, or
                        personal creative projects all from one smart platform.
                      </p>
                      <div className="row align-items-start mt-2 g-0 key-highlights">
                        <div className="col-12 col-md-12 pe-md-3">
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }} className="mb-2">
                            Key Highlights:
                          </h3>
                        </div>
                        <div className="col-12 col-md-12">
                          <ul className="mb-0 px-0">
                            <li>
                              <span style={{ color: 'rgba(222, 57, 150, 1)', fontSize: '1rem  ' }}>
                                Instant AI Conversion
                              </span>{' '}
                              Turn any image into a 3D model in seconds.
                            </li>
                            <li>
                              <span style={{ color: 'rgba(222, 57, 150, 1)', fontSize: '1rem ' }}>
                                Cross-Platform Access
                              </span>{' '}
                              Work from mobile or web and keep your creations synced.
                            </li>
                            <li>
                              <span style={{ color: 'rgba(222, 57, 150, 1)', fontSize: '1rem ' }}>
                                Easy Editing Tools
                              </span>{' '}
                              Customize models with intuitive controls.
                            </li>
                            <li>
                              <span style={{ color: 'rgba(222, 57, 150, 1)', fontSize: '1rem ' }}>
                                Export Anywhere
                              </span>{' '}
                              Download in multiple formats for your needs.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          </div>
        </motion.section>



        <section className="scan_section py-5">
          <div className="container scan_container">
            <div className="row align-items-center justify-content-between">
              <div className="col-lg-5 col-12 mb-5 mb-md-0">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="scan_title">
                    Our{' '}
                    <span className="perfect-heading">
                      <span className="">
                        Adv
                        <img src={elipse} alt="Ellipse" className="ellipse-img" />
                        anc
                      </span>
                      ed
                    </span>{' '}
                    Scanning Features
                  </div>

                  <motion.p
                    className="scan_description"
                    style={{ width: '95%', color: '#1A1A40B2' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    3DIO combines cutting-edge AI algorithms with powerful cloud infrastructure to
                    deliver studio-quality 3D scanning that's fast, accurate, and secure. Whether
                    you're creating for gaming, e-commerce, design, or enterprise use, our features
                    ensure your results are top-tier and ready for production.
                  </motion.p>
                </motion.div>
              </div>


              <div className="col-lg-6 col-md-10 col-12 mb-5 mb-md-0">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="square-wrapper">
                  <div className="square-container">
                    <img src={rectangle2} alt="" className="square-line top" />

                    <img src={rectangle1} alt="" className="square-line right" />

                    <img src={rectangle2} alt="" className="square-line bottom" />

                    <img src={rectangle1} alt="" className="square-line left" />

                    <img src={elipse2} alt="" className="ellipse ellipse-top-left" />

                    <img src={elipse1} alt="" className="ellipse ellipse-top-right" />

                    <img src={elipse2} alt="" className="ellipse ellipse-bottom-left" />

                    <img src={elipse1} alt="" className="ellipse ellipse-bottom-right" />

                    <div className="scan_card top-left" style={{ paddingLeft: 25 }}>
                      <div className="scan_icon">
                        <img src={scan} alt="" />
                      </div>

                      <h4 className="scan_card_title">
                        High-Precision
                        <span className="d-none d-lg-inline">
                          <br />
                        </span>
                        Scanning
                      </h4>

                      <p className="scan_card_text">
                        Capture every detail with sub-millimeter accuracy. Our AI-driven scanning
                        technology ensures lifelike, photorealistic results using advanced sensor
                        algorithms and deep learning enhancements.
                      </p>

                      {/* <a href="">
                        <div className="scan_arrow" style={{ left: '54%', bottom: '0.3rem' }}>
                          <img src={rightArrow1} alt="" />
                        </div>
                      </a> */}
                    </div>

                    <div className="scan_card top-right" style={{ paddingRight: 25 }}>
                      <div className="scan_icon">
                        <img src={understand} alt="" />
                      </div>

                      <h4 className="scan_card_title">
                        AI Model
                        <span className="d-none d-lg-inline">
                          <br />
                        </span>
                        Processing
                      </h4>

                      <p className="scan_card_text" style={{ padding: '0px 11px' }}>
                        Automatically optimize your 3D models with intelligent mesh generation,
                        texture mapping, and polygon reduction - balancing visual quality with
                        performance for any platform.
                      </p>

                      {/* <a href="">
                        <div className="scan_arrow" style={{ left: '50%', bottom: '0.3rem' }}>
                          <img src={rightArrow1} alt="" />
                        </div>
                      </a> */}
                    </div>

                    <div className="scan_card bottom-left" style={{ paddingLeft: 27 }}>
                      <div className="scan_icon">
                        <img src={instant} alt="" />
                      </div>

                      <h4 className="scan_card_title">Instant Results</h4>

                      <p className="scan_card_text" style={{ padding: '8px 0px 0px 1rem' }}>
                        No more waiting hours for rendering. Our scalable cloud infrastructure
                        processes images, videos, or text prompts into ready to use 3D models within
                        minutes.
                      </p>

                      {/* <a href="">
                        <div className="scan_arrow" style={{ left: '54%', bottom: '0.7rem' }}>
                          <img src={rightArrow1} alt="" />
                        </div>
                      </a> */}
                    </div>

                    <div className="scan_card bottom-right">
                      <div className="scan_icon">
                        <img src={encripted} alt="" />
                      </div>

                      <h4 className="scan_card_title">Enterprise Security</h4>

                      <p className="scan_card_text" style={{ padding: '8px 1.70rem 0px 0px' }}>
                        Your data is protected with bank-grade encryption, secure cloud storage, and
                        compliance with global data protection standards - ensuring confidentiality
                        at every stage.
                      </p>

                      {/* <a href="">
                        <div className="scan_arrow" style={{ left: '50%', bottom: '0.7rem' }}>
                          <img src={rightArrow1} alt="" />
                        </div>
                      </a> */}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing_hero py-3 mt-5" id="3d-Sample">
          <div className="container text-center">
            <h2 className="landing_title">
              Our 3D{' '}
              <span className="perfect-heading">
                <span className="sm-wrapper">
                  Sa
                  <img src={elipse} alt="Ellipse" className="ellipse-img" />
                  mp
                </span>
                les
              </span>
            </h2>

            <p className="landing_subtitle">With top quality and high performance</p>

            <form onSubmit={(e) => e.preventDefault()} className="search_container mx-auto mt-2">
              <label htmlFor="search-models" className="visually-hidden">
                Search 3D models
              </label>
              <div className="input_with_icon">
                <img src={search} alt="" aria-hidden="true" className="input_icon" />

                <input
                  id="search-models"
                  type="search"
                  className="search_input"
                  placeholder="Search 3D Models"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button type="submit" className="search_button" aria-label="Search 3D models">
                <FiArrowRight size={18} aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>

        {/* ========================= Services Section End  ======================= */}

        <section className="model_section py-4 ai_3d_landing">
          <div className="container">
            <div className="row g-md-4">
              {error || (models.length === 0 && !loading) ? (
                <div className="col-12">
                  <div className="models-state-container">
                    <div className="models-state-icon">
                      <i className="fa-solid fa-cubes-stacked"></i>
                    </div>
                    <h3 className="models-state-title">3D Gallery Updating Soon</h3>
                    <p className="models-state-desc">
                      We are currently curating an exclusive collection of high-precision 3D samples.
                      Stay tuned – our latest innovations will be appearing here shortly!
                    </p>
                  </div>
                </div>
              ) : filteredModels.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <div className="models-state-icon mb-3" style={{ fontSize: '3rem', color: '#de3996' }}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <h3 className="models-state-title" style={{ color: '#de3996', fontWeight: 600 }}>No models found</h3>
                  <p className="text-muted">No models match your search query "{searchQuery}".</p>
                </div>
              ) : (
                (showAllModels ? filteredModels : filteredModels.slice(0, 6)).map((card, idx) => {
                  const imgUrl = card.image
                    ? `https://app.ai3dscanning.com/storage/${card.image.replace(/^\/+/, '')}`
                    : modelFallback;

                  return (
                    <div className="col-12 col-sm-6 col-lg-4" key={card.id || idx}>
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.6,
                          delay: idx * 0.2,
                        }}
                        className="model_card"
                        onClick={() => setSelectedModel(card)}
                        style={{ cursor: 'pointer' }} 
                      >
                        <img
                          src={imgUrl}
                          className="model_image"
                          alt={card.title}
                          onError={(e) => (e.target.src = modelFallback)}
                        />

                        <div className="model_footer">
                          <div className="model_label">
                            {card.title}
                            {/* <span className="model_price">23K</span> */}
                          </div>

                          <button
                            className="model_card_button"
                            aria-label={`View ${card.title} model`}
                            onClick={(e) => { e.stopPropagation(); setSelectedModel(card); }}
                          >
                            <img src={modelButtonIcon} alt="" aria-hidden="true" />
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  );
                })
              )}

              <div className="col-12 d-flex justify-content-end">
                <button
                  type="button"
                  className="toggle_arrow_btn1"
                  aria-label={showAllModels ? 'Show fewer models' : 'Show more models'}
                  aria-expanded={showAllModels}
                  onClick={() => setShowAllModels((prev) => !prev)}
                >
                  <img
                    src={down}
                    alt=""
                    aria-hidden="true"
                    style={{
                      width: 18,
                      marginTop: 6,
                      marginBottom: 4,
                      marginLeft: 1,
                      transform: showAllModels ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================= How it Work Section End  ======================= */}

        <section className="api_section ai_3d_landing mt-4">
          <div className="container">
            <div className="api_wrapper d-flex justify-content-between align-items-center flex-wrap">
              <div className="api_content">
                <h3 className="api_title">Business 3DIO API</h3>

                <p className="api_subtitle">More than quality, we develop language API</p>
              </div>

              <a href="/services" className="api_button">
                Connect API
              </a>
            </div>
          </div>
        </section>

        <div className="logo_slider">
          <div className="logo_track">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={`logos-${i}`}>
                {trustedLogos.map((logo) => (
                  <span className="a3d-logo-item" key={`${logo.alt}-${i}`}>
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      loading="lazy"
                      decoding="async"
                      style={logo.style}
                    />
                    <span className="a3d-logo-label">{logo.label}</span>
                  </span>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="aithreed">
          <section className="cards pt" id="Leadership">
            <div className="container-fluid">
              {/* Header */}

              <div className="row mt-5 justify-content-center marb">
                <div className="text-center mb-lg-4 mb-md-3 mb-0">
                  <h2 className="mb-2" style={{ color: 'rgba(222, 57, 150, 1)' }}>
                    Our Leadership
                  </h2>

                  {/* <div className="faq-head mb-0">
                    <h2 className="faq-t text-black">Our Team Members</h2>

                    <img src={rainbowImg} alt="Rainbow" className="rainbow-over" />
                  </div> */}

                  <p className="text-muted text d-lg-block">Meet Our C-Level Executive Team</p>
                </div>

                {/* Static Cards (CEO & Advisor) */}
                {/* 
                <div className="team-card-container col-12 col-md-4 col-3 mb-0 mt-3">
                  <div className="team-slide">
                    <div className="img-container Hillier">
                      <img src={ArslanImg} alt="Arslan Ahmad" />
                    </div>

                    <div className="team-card team-cads">
                      <h5>Arslan Ahmad</h5>

                      <small className="twocards">CEO & Product Lead</small>

                      <p>
                        Leads AI3D product development,
                        <br className="d-block" />
                        vision, product innovation and strategic partnerships.
                      </p>

                      <div className="mt-auto">
                        <a href="javascript:void(0)" className="learn-more learn-m">
                          Learn More
                          <img src={learnImg} alt="" className="mt-1 left lef ms-2" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="team-card-container col-12 col-md-4 col-3 mb-0 mt-3">
                  <div className="team-slide">
                    <div className="img-container Hillier">
                      <img src={CeoSir} alt="Dr. Joel Hillier" />
                    </div>

                    <div className="team-card team-cads">
                      <h5>Dr. Joel Hillier</h5>

                      <small className="twocards">Business & AI Strategy Advisor</small>

                      <p>
                        Guiding overall business direction and
                        <br className="d-lg-block d-none" />
                        shaping AI development strategy to
                        <br className="d-lg-block d-none" />
                        align with market needs.
                      </p>

                      <div className="mt-auto">
                        <a href="javascript:void(0)" className="learn-more learn-m">
                          Learn More
                          <img src={learnImg} alt="" className="mt-1 left lef ms-2" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div> */}

                {modalData && (
                  <CustomInfoModal modalData={modalData} onClose={() => setModalData(null)} />
                )}
              </div>

              {/* Splide Slider for Team Members */}

              {/* <div className="splide mt-4" id="team-slider" aria-label="Team Slider">
                <div className="splide__track">
                  <ul className="splide__list">
                    {[
                      {
                        img: SehrozSir,
                        name: 'Shehroz Shabbir',
                        role: 'Web Development Manager',
                        desc: 'Expertise spans coding, system architecture, and database management, enabling him to translate complex business needs into functional, efficient, and scalable solutions. His work powers the AI-driven and 3D scanning technologies that define the company’s cutting-edge services.',
                      },

                      {
                        img: MudassarSir,
                        name: 'Mudassar Farooq',
                        role: 'HR & Business Development Manager',
                        desc: 'Drives recruitment, culture, and leads business growth and client outreach efforts.',
                      },
                      {
                        img: HiraMam,
                        name: 'Hira Aziz',
                        role: 'Creative Media Manager',
                        desc: 'Leads visual communication, brand identity, and product design direction.',
                      },
                      {
                        img: samiaImg,
                        name: 'Samia Rasheed',
                        role: 'HR Associate & Social Media Manager',
                        desc: 'Supports hiring processes while managing brand voice and engagement across platforms.',
                      },
                      // Repeat for loop effect (optional)

                      {
                        img: osamaImg,
                        name: 'Usama Ahmad',
                        role: 'Admin & Finance Manager',
                        desc: 'Manages company finances, budgeting, and administrative operations with precision and compliance.',
                      },
                    ].map((member, index) => (
                      <li className="splide__slide" key={index}>
                        <div className="team-slide">
                          <div className="img-container image-container">
                            <img src={member.img} alt={member.name} />
                          </div>

                          <div className="team-card image-card">
                            <h5 className="teamname">{member.name}</h5>

                            <small className="teamtitle">{member.role}</small>

                            <p className="pera teampara">
                              {member.desc.length > 100
                                ? `${member.desc.substring(0, 100)}...`
                                : member.desc}
                            </p>

                            <div className="mt-auto">
                              <a href="javascript:void(0)" className="learn-more learn-m">
                                Learn More
                                <img src={learnImg} alt="" className="mt-1 left lef ms-2" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div> */}
              <LeadershipSection />
              {isPreLaunchActive() && <WaitingListSection />}

            </div>
          </section>

          <section className="slidertwooo">
            <div className="text-center mt-5 p-3 pb-0">
              <p className="mb-lg-1 mb-md-1 mb-sm-2 mb-2 nee">Testimonials</p>

              <div className="faq-he mb-lg-3 mb-2">
                <h2 className="faq-tt">What Our Customers Say</h2>
                <img src={elipse} alt="" className="rainbow-ov" />
              </div>

              <p className="texttwo d-lg-block">
                <span className="d-lg-block">
                  From gaming, AR/VR, e-commerce, and digital twins, our clients trust
                  <br className="d-lg-block d-md-block d-sm-none d-none" />
                  AI3D Scanning Solutions to deliver high-precision 3D models, faster workflows, and
                  cost-efficient results.
                  <br className="d-lg-block d-md-block d-sm-none d-none" />
                  <span style={{ color: '#df3c9c' }}>
                    Each partnership is a story of innovation
                  </span>
                </span>
              </p>
            </div>

            {/* Carousel */}
            {/* <section className="testimonial-section relative" style={{ padding: '50px 30px' }}>
              <div className="container-fluid">
                <div className="d-flex justify-content-center align-items-center">
                  {visibleCards.map((index) => {
                    const item = testimonials[index];
                    const isActive = index === activeIndex;
                    return (
                      <div
                        key={index}
                        className={`testimonial-card
                           ${isActive ? 'active' : ''} ${index === scaledIndex ? 'scaled' : ''}
                           `}
                        style={{ padding: '0 15px', margin: '0 20px' }}
                      >
                        {item.image ? (
                          <img src={item.image} className="testimonial-img" alt={item.name} />
                        ) : (
                          <b
                            className="testimonial-img d-flex text-center align-items-center justify-content-center"
                            style={{
                              background: flagColors[item.role] || '#DE3996',
                              color: 'white',
                            }}
                          >
                            {item.name[0]}
                          </b>
                        )}
                        <div className="testimonial-text">{item.text}</div>
                        <div className="testimonial-name">{item.name}</div>
                        <div className="testimonial-role">{item.role}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section> */}
            <TestimonialSection />

            {/* Navigation */}
            {/* <div className="custom-nav">
              <div className="nav-btn" id="prevBtn" onClick={prev}>
                <img width="12px" src={leftic} alt="" />
              </div>
              <div className="nav-btn" id="nextBtn" onClick={next}>
                <img width="12px" src={rightic} alt="" />
              </div>
            </div> */}
          </section>

          <motion.section
            className="difficult"
            style={{ marginTop: 65, marginBottom: 90 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="container">
              <div className="row g-4 roww">
                <div className="text-center mt-5">
                  <div className="faq-hehe">
                    <h2 className="faq-ttt text-black">Our Roadmap</h2>

                    <img src={elipse} alt="" className="rainbow-o" />
                  </div>

                  <p className="text-muted texttwo teo">
                    We are building AI3D Scanning Solutions into a{' '}
                    <span style={{ color: '#df3c9c' }}>complete, industry-ready platform</span>
                    <br className="d-lg-block d-md-block d-sm-block d-none" />
                    through a carefully planned development journey.
                  </p>
                </div>
                <RoadmapSection />
              </div>
            </div>
          </motion.section>

          <section className="dropdown" id="FAQs">
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

              <div className="accordion">
                {faqs.map((faq, index) => (
                  <div className="accordion-item border-0 mb-3" key={index}>
                    <h3 className="accordion-header justify">
                      <button
                        className={`accordion-button fw-semibold widthh ${openIndex === index ? '' : 'collapsed'
                          }`}
                        type="button"
                        onClick={() => toggleFAQ(index)}
                      >
                        {faq.question}

                        <span className="icon-container">
                          {/* <img
                            src={plusIcon}
                            alt="Plus"
                            className="icon-plus"
                            style={{ display: openIndex === index ? 'none' : 'inline' }}
                          /> */}
                          <i
                            className="fa-solid fa-plus icon-plus"
                            style={{ display: openIndex === index ? 'none' : 'inline' }}
                          ></i>

                          {/* <img
                            src={minusIcon}
                            alt="Minus"
                            className="icon-minus"
                            style={{ display: openIndex === index ? 'inline' : 'none' }}
                          /> */}
                          <i
                            className="fa-solid fa-minus icon-minus"
                            style={{ display: openIndex === index ? 'inline' : 'none' }}
                          ></i>
                        </span>
                      </button>
                    </h3>

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

          <section className="subscribe-section position-relative " id="help">
            <div className="container-fluid ">
              <div className="row align-items-center">
                <div className="col-md-7 card-data">
                  <h3 className="subscribe-title position-relative">
                    <span className="highlight-letters">
                      Subscribe
                      <img src={elipse} alt="rainbow" className="rainbow-above" /> to update
                    </span>
                  </h3>
                  <p className="subscribe-description">
                    Join our newsletter to stay informed about new{' '}
                    <br className="d-md-flex d-none" /> features and product updates.
                  </p>
                  <form onSubmit={handleSubscribe}>
                    <div className="form-row">
                      <div className="form-input">
                        <input
                          type="email"
                          className="form-controls"
                          id="email"
                          placeholder="Enter email address*"
                          required=""
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                       <button type="submit" className="btn btn-subscribe" disabled={subscribeLoading}>
                          {subscribeLoading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                      </div>
                      {/* {subscribeMsg && (
                        <p style={{ marginTop: 8, fontSize: '0.875rem', color: subscribeMsg.includes('success') ? 'green' : 'red' }}>
                          {subscribeMsg}
                        </p>
                      )} */}
                  </form>
                </div>
                <div className="col-md-5 d-flex justify-content-end align-items-end position-static">
                  {/* Empty column for spacing on desktop */}
                </div>
              </div>
              {/* Image absolutely positioned, head outside card */}
              <div className="subscribe-img-wrapper">
                <img src={manImage} alt="Newsletter illustration" className="subscribe-img" />
              </div>
            </div>
          </section>

          <footer className="footer">
            <div className="container">
              <div className="row">
                {/* Left Column */}

                <div className="col-lg-4 col-md-6 col-12">
                  <div className="logo">
                    <img src={logo} alt="AI 3D Scanning Logo" />
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
                      <Link to="/contributor/program" className="btn btn-custom Sell">
                        Sell your 3D Models
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
                  {[
                    { name: 'Home', url: '/' },
                    { name: 'About Us', url: '/about-us' },
                    { name: 'Services', url: '/services' },
                    { name: 'Pricing', url: '/3dio/subscription' },
                    { name: 'Student', url: '/student-program' },
                  ].map((item) => (
                    <li key={item.name}>
                      <Link to={item.url}>
                        <img
                          className="iconsize me-1"
                          src={arrow}
                          alt="Arrow"
                          style={{ verticalAlign: 'middle', marginTop: '-3px' }}
                        />
                        {item.name}
                      </Link>
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
                        <a href={item === 'FAQ' ? '#FAQs' : '/3dio/support'}>
                          <img
                            className="iconsize me-1"
                            src={arrow}
                            alt="Arrow"
                            style={{ verticalAlign: 'middle', marginTop: '-3px' }}
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
                            style={{ verticalAlign: 'middle', marginTop: '-2px' }}
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
                          href="mailto:contact@ai3dscanning.com"
                          className="mt-1"
                        >
                          contact@ai3dscanning.com
                        </a>
                      </li>
                      {/* <li>
                        <a href="mailto:contact@ai3dscanning.com">
                          <span className="colorc">Email: </span>
                          <br />
                          <br />
                          contact@ai3dscanning.com
                        </a>
                      </li> */}

                      <li>
                        <a href="tel:+923443228863">
                          <span className="colorc">Phone: </span>
                          <br />
                          <br />
                          +923443228863 , +12088076899
                        </a>
                      </li>

                      <li>
                        <address className="my-0">
                          <span className="colorc">Address: </span> <br />
                          <br />
                          <a
                            href="https://maps.google.com/?q=3765+W+Dublin+Dr,+Eagle,+Idaho+83616,+USA"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            3765 W Dublin Dr, Eagle, Idaho 83616, USA
                          </a>
                        </address>
                        <a
                          href="https://maps.google.com/?q=H+167/B,+Gol+Chakar,+Sahiwal,+Pakistan+57000"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1"
                        >
                          H 167/B, Gol Chakar, Sahiwal, Pakistan 57000
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="social-icons d-md-block d-none ">
                    <a
                      href="https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Facebook"
                    >
                      <i className="bx bxl-facebook" aria-hidden="true" />
                    </a>

                    <a
                      href="https://x.com/ai3dscanning"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on X"
                    >
                      <i className="bx bxl-twitter" aria-hidden="true" />
                    </a>

                    <a
                      href="https://www.linkedin.com/company/ai3d-scanning-solutions-inc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on LinkedIn"
                    >
                      <i className="bx bxl-linkedin" aria-hidden="true" />
                    </a>

                    <a
                      href="https://www.instagram.com/ai3d_scanning_solutions?igsh=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Instagram"
                    >
                      <i className="bx bxl-instagram" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                {/* Mobile Social Icons */}
                <div className="social-icons  d-md-none d-block d-flex justify-content-center mt-3">
                  <a
                    href="https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Facebook"
                  >
                    <i className="bx bxl-facebook" aria-hidden="true" />
                  </a>

                  <a
                    href="https://x.com/ai3dscanning"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on X"
                  >
                    <i className="bx bxl-twitter" aria-hidden="true" />
                  </a>

                  <a
                    href="https://www.linkedin.com/company/ai3d-scanning-solutions-inc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on LinkedIn"
                  >
                    <i className="bx bxl-linkedin" aria-hidden="true" />
                  </a>

                  <a
                    href="https://www.instagram.com/ai3d_scanning_solutions?igsh=MWd1bzRmaDBpcXcycg%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram"
                  >
                    <i className="bx bxl-instagram" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <hr />

              <p className="copyright">Copyright © Powered by AI 3D Scanning Solutions Inc.</p>
            </div>
          </footer>
        </div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            className="scroll-to-top"
            aria-label="Scroll to top"
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
            <FaArrowUp color="white" size={20} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Subscription Modal */}
      <LandingPageModal
        open={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        onRequireLogin={handleOpenLogin}
      />

      {showLoginModal && (
        <LoginPopup
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            setShowLoginModal(false);
          }}
        />
      )}
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      <EarlyAccessPopup
        isOpen={showEarlyAccessPopup}
        onClose={handleCloseEarlyAccessPopup}
        onSignUp={handleEarlyAccessSignUp}
      />

      {selectedModel && (
        <SampleModels
          model={selectedModel}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </>
  );
};

export default LandingPage;
