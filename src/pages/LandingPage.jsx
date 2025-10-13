import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LandingPage.css';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
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
import Modling from './images/3d-modeling.png';
import store from './images/store.png';
import design from './images/provide.png';
import mobile from './images/mobile-responsive.png';
import machine from './images/machine.png';
import e_commerce from './images/ecommerce.png';
import construction from './images/construction.png';
import vr from './images/vr.png';
import health from './images/healthcare.png';
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
import googleStartups from './images/google-startups.png';
import pitb from './images/PITB.png';
import regionalPlan from './images/regional-plan.png';
// import consulting from './images/consulting.png';
import veraAi from './images/vera-ai.png';
import nvidia from './images/nvdia.png';
import videoSrc from './images/3dModal.mp4';
import videoIcon from './images/video_icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPauseCircle } from '@fortawesome/free-solid-svg-icons';
import { FaChevronDown, FaLinkedin } from 'react-icons/fa';
import rainbowImg from './images/rainbow.png';
import ArslanImg from '../assets/images/Arslan.svg';
import CeoImg from '../assets/images/Ceo.svg';
import girImg from './images/gir.png';
import girtImg from './images/girt.png';
import mangImg from './images/mang.png';
import mantImg from './images/mant.png';
import manfivImg from './images/manfiv.png';
import learnImg from './images/learn.png';
import rightic from './images/rightic.png';
import leftic from './images/leftic.png';
import topRight from './images/top-rightimg.png';
import manIcon from './images/manicon.png';
import one from './images/one.png';
import tv from './images/tv.png';
import two from './images/two.png';
import beta from './images/beta.png';
import three from './images/three.png';
import lock from './images/lock.png';
import four from './images/four.png';
import manImage from './images/man.png';
import plusIcon from './images/plus.png';
import minusIcon from './images/minus.png';
import world from './images/worl.png';
import line from './images/line.png';
import dot from './images/do.png';
import arrow from './images/arri.png';
// Modal assets
import modalQuoteImg from './images/quation.png';
import modalBorderImg from './images/border.png';
import modalTextSlideImg from './images/text-slide.png';
import modalBulletImg from './images/bullet-point.png';
import client1 from '../assets/images/client1.png';
import client2 from '../assets/images/client2.jpg';

// Managers Images
import HiraMam from '../assets/images/HiraMam.svg';
import SamiaMam from '../assets/images/SamiaMam.svg';
import UsamaSir from '../assets/images/UsamaSir.svg';
import MudassarSir from '../assets/images/MudassarSir.svg';
import ArslanSir from '../assets/images/ArslanSir.svg';
import CeoSir from '../assets/images/CeoSir.svg';
import SajeelSir from '../assets/images/SajeelSir.svg';
import SehrozSir from '../assets/images/shehroz.png';

import hiraImg from '../assets/images/HiraImg.svg';
import samiaImg from '../assets/images/SamiaImg.svg';
import osamaImg from '../assets/images/Person1.svg';
import sajeelImg from '../assets/images/Sajeel.svg';
import mudassarImg from '../assets/images/Mudassar.svg';
import shehrozImg from '../assets/images/ShahrozImg.svg';
import FrameWiseImg from '../assets/images/FrameWise-Logo.png';
import { useMediaQuery } from 'react-responsive';
import SubscriptionModal from '../components/popup/SubscriptionModal';
import LandingPageModal from '../components/popup/LandingPageModal';
import LoginPopup from '../components/popup/LoginPopup';
import CustomInfoModal from '../components/popup/CustomInfoModal';
import Robot_Loader from '../assets/images/RobotLoader.png';
import { FiArrowRight } from 'react-icons/fi';
import { baseURL } from '../config';
import { useAuth } from '../context/AuthContext';
// import MiniBotViewer from '../components/MiniBotViewer';
// import Mini_bot from '../../public/assets/images/mini_bot.glb'

const LandingPage = () => {
  const { pathname, hash, key } = useLocation();
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenLogin = () => {
    setSubscriptionModalOpen(false); // subscription modal close
    setShowLoginModal(true); // login modal open
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
  useEffect(() => {
    const css = `
      html, body { 
        scrollbar-width: none !important;
        -ms-overflow-style: none !important; 
      }
      html::-webkit-scrollbar, 
      body::-webkit-scrollbar { 
        display: none !important; 
      }
    `;

    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
    if (!isMobile || !pillsRef.current) return;
    let scrollAmount = 0;
    const pillWidth = 130;
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

  const [showAllModels, setShowAllModels] = useState(false);

  const [error, setError] = useState('');

  const { token } = useAuth();

  useEffect(() => {
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

    fetchModels();
  }, []);

  // const modelCards = [
  //   { img: carImg, label: 'Car', price: '23K' },

  //   { img: homeImg, label: 'Home', price: '23K' },

  //   { img: shoesImg, label: 'Shoes', price: '23K' },

  //   { img: astronautImg, label: 'Space Robot', price: '23K' },

  //   { img: headphonesImg, label: 'Headphones', price: '23K' },

  //   { img: car2Img, label: 'Car', price: '23K' },

  //   { img: car3Img, label: 'Car', price: '23K' },

  //   { img: ninjaImg, label: 'Character', price: '23K' },

  //   { img: homeImg, label: 'Exterior', price: '23K' },

  //   { img: homeImg, label: 'Home', price: '23K' },

  //   { img: shoesImg, label: 'Shoes', price: '23K' },

  //   { img: carImg, label: 'Car', price: '23K' },
  // ];

  //  useEffect(() => {

  //     const wrapper = document.querySelector(".testimonials-wrapper");

  //     const cards = document.querySelectorAll(".testimonial-item");

  //     const prevBtn = document.getElementById("prevBtn");

  //     const nextBtn = document.getElementById("nextBtn");

  //     let currentIndex = 1;

  //     let autoSlideInterval;

  //     const updateSlidePosition = () => {

  //       const cardWidth = cards[0].offsetWidth;

  //       const offset = -(currentIndex - 1) * cardWidth;

  //       wrapper.style.transform = `translateX(${offset}px)`;

  //       cards.forEach((card, index) => {

  //         card.querySelector(".testimonial-card").classList.remove("active");

  //         if (index === currentIndex) {

  //           card.querySelector(".testimonial-card").classList.add("active");

  //         }

  //       });

  //     };

  //     const goToNext = () => {

  //       currentIndex = (currentIndex + 1) % cards.length;

  //       updateSlidePosition();

  //     };

  //     const goToPrev = () => {

  //       currentIndex = (currentIndex - 1 + cards.length) % cards.length;

  //       updateSlidePosition();

  //     };

  //     const startAutoSlide = () => {

  //       autoSlideInterval = setInterval(goToNext, 3000);

  //     };

  //     const stopAutoSlide = () => {

  //       clearInterval(autoSlideInterval);

  //     };

  //     prevBtn.addEventListener("click", () => {

  //       stopAutoSlide();

  //       goToPrev();

  //       startAutoSlide();

  //     });

  //     nextBtn.addEventListener("click", () => {

  //       stopAutoSlide();

  //       goToNext();

  //       startAutoSlide();

  //     });

  //     wrapper.style.transition = "transform 0.5s ease-in-out";

  //     updateSlidePosition();

  //     startAutoSlide();

  //     return () => {

  //       stopAutoSlide();

  //       prevBtn.removeEventListener("click", goToPrev);

  //       nextBtn.removeEventListener("click", goToNext);

  //     };

  //   }, []);

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

  useEffect(() => {
    const slider = new window.Splide('#team-slider', {
      type: 'loop',
      perPage: 5,
      perMove: 1,
      pagination: false,
      arrows: false,
      autoplay: true,
      interval: 2000,
      gap: '1.5rem',
      drag: true,
      focus: 'center',
      breakpoints: {
        1200: { perPage: 3 },
        768: { perPage: 3 },
        576: { perPage: 1 },
      },
    }).mount();

    // Custom Navigation Buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn?.addEventListener('click', () => slider.go('<'));
    nextBtn?.addEventListener('click', () => slider.go('>'));

    return () => {
      slider.destroy();
      prevBtn?.removeEventListener('click', () => {});
      nextBtn?.removeEventListener('click', () => {});
    };
  }, []);

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

  const [isOpen, setIsOpen] = useState(false);

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

    // ✅ Add click handlers
    prevBtn?.addEventListener('click', goToPrev);
    nextBtn?.addEventListener('click', goToNext);

    // ✅ Disable touch drag (Important!)
    const disableDrag = (e) => {
      e.preventDefault();
    };

    // Apply to wrapper and items
    const wrapper = section.querySelector('.testimonials-wrapper');
    if (wrapper) {
      wrapper.style.touchAction = 'none'; // Prevents browser from handling touch
      wrapper.addEventListener('touchstart', disableDrag, { passive: false });
      wrapper.addEventListener('touchmove', disableDrag, { passive: false });
      wrapper.addEventListener('touchend', disableDrag, { passive: false });
      wrapper.addEventListener('mousedown', disableDrag);
    }

    // ✅ Optional: Auto-slide every 4 seconds
    let autoSlideInterval = setInterval(goToNext, 4000);

    // Clear on unmount
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

      // Extract data from the clicked card
      const imgSrc = slide.querySelector('.img-container img')?.src || '';
      const name = slide.querySelector('h5')?.textContent || '';
      const role = slide.querySelector('.twocards, .teamtitle')?.textContent || '';
      const desc = slide.querySelector('p')?.textContent || '';

      // Optional: You can define more detailed data (like expertise, philosophy) in an object
      const fullDataMap = {
        'Arslan Ahmad': {
          Image: ArslanImg,
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

        'Dr. Joel Hillier': {
          Image: CeoImg,
          title: 'Growth Co-Founder – Business & AI Strategy Advisor',

          desc: [
            'Dr. Hillier provides strategic guidance on business growth, market positioning, and AI development direction. With expertise spanning artificial intelligence, data-driven innovation, and commercial strategy, he ensures that AI3D’s technological roadmap aligns with evolving market demands.',
            'His role bridges technical capabilities with high-impact business outcomes, supporting scalable adoption across diverse industries',
          ],
          expertise: [
            'AI strategy & market alignment',
            'Global business growth & scaling strategies',
            'Bridging research with commercial applications',
          ],
          linkedin: 'https://www.linkedin.com/in/joelhillier/',
          philosophy: '.........',
        },
        'Shehroz Shabbir': {
          Image: shehrozImg,
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
        // Add others as needed
        'Usama Ahmad': {
          Image: osamaImg,
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
        'Sajeel Nisar': {
          Image: sajeelImg,
          title: 'AI Lead',

          desc: [
            'As an AI Engineer at AI3D Scanning Solutions, Sajeel specializes in designing and implementing intelligent systems that power the company’s 3D scanning and automation technologies. With a deep understanding of machine learning, computer vision, and data modeling, he transforms complex datasets into actionable insights and automated solutions.',
            ' His work ensures that AI3D Scanning Solutions remains at the forefront of innovation, delivering smarter, faster, and more accurate scanning experiences for clients across industries. Sajeel’s approach blends technical precision with creative problem-solving to push the boundaries of what AI can achieve.',
          ],
          expertise: [
            'Artificial Intelligence & Machine Learning',
            'Computer Vision & Image Processing',
            'Neural Network Architecture',
            'Data Analysis & Predictive Modeling',
            'Automation Systems Development',
            'AI-Driven 3D Scanning Solutions',
          ],
          linkedin: 'https://www.linkedin.com/in/msajeel/',
          philosophy:
            '"The future belongs to intelligent systems — and I believe in building AI that makes technology more human."',
        },
        'Mudassar Farooq': {
          Image: mudassarImg,
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

  return (
    <>
      <div className="landing-page-section ai_3d_landing">
        <div className="main_head" style={{ backgroundColor: '#FFEDF7' }}>
          <main className="container py-sm-4 pt-4">
            {/* ========================= navbar ======================= */}

            <header className="a3d-header container-fluid bg-white mb-4 a3d-fade-in">
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
                  <Link to="https://calendly.com/arslan-medtronix/30min" className={`a3d-nav-link`}>
                    Schedule Meeting
                  </Link>

                  <Link
                    to="/service"
                    className={`a3d-nav-link ${location.pathname === '/service' ? 'active' : ''}`}
                  >
                    Services
                  </Link>

                  <a href="#3d-Sample" className="a3d-nav-link">
                    3D Samples
                  </a>

                  <a href="#Leadership" className="a3d-nav-link">
                    Leadership
                  </a>
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
                <Link
                  to="https://calendly.com/arslan-medtronix/30min"
                  className={`a3d-nav-link ${location.pathname === '/schedule' ? 'active' : ''}`}
                >
                  Schedule Meeting
                </Link>

                <Link
                  to="/service"
                  className={`a3d-nav-link ${location.pathname === '/service' ? 'active' : ''}`}
                >
                  Services
                </Link>

                <a href="#3d-Sample" className="a3d-nav-link">
                  3D Samples
                </a>

                <a href="#Leadership" className="a3d-nav-link">
                  Leadership
                </a>
                <Link
                  to="/referral"
                  className={`a3d-nav-link ${location.pathname === '/referral' ? 'active' : ''}`}
                >
                  Referral
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

          <div className="container" style={{ paddingBottom: 20 }}>
            <div
              className="row align-items-center"
              style={{ marginTop: isMobile ? '-2.5rem' : '-4rem' }}
            >
              <div
                className="col-lg-7"
                // style={{ marginTop: isMobile ? '0rem' : '-2rem' }}
              >
                <h1 className="a3d-title a3d-slide-up" style={{ marginTop: 30 }}>
                  {/* <span className="perfect-heading">
                    Perf
                    <span className="ec-wrapper">
                      ec
                      <img src={elipse} alt="Ellipse" className="ellipse-img" />
                    </span>
                    t
                  </span> */}
                  <span className="a3d-gradient-span-text">
                    <img src={elipse} alt="Ellipse" className="ellipse-img-ec" />
                    Perfect place where
                    <br />
                    <span>Innovation Meet 3D</span>
                    <br />
                    <span>Model Creation</span>
                  </span>
                  {/* <span className="a3d-gradient-text">
                    {' '}
                    place where
                    <span className="d-none d-lg-inline">
                      <br />
                    </span>
                    Innovation Meet 3D{' '}
                    <span className="d-none d-lg-inline">
                      <br />
                    </span>
                    Model Creation
                  </span> */}
                  <span></span>
                </h1>

                <p className="a3d-description mt-4 a3d-slide-up" style={{ animationDelay: '0.2s' }}>
                  AI-powered platform for live 3D model generation, editing and{' '}
                  <span className="d-none d-lg-inline">
                    <br />
                  </span>{' '}
                  collaboration - no expensive hardware needed.
                </p>

                <div
                  className="a3d-pills-scroll d-flex gap-3 my-4 a3d-slide-up"
                  id="pillSlider"
                  ref={pillsRef}
                  style={{
                    overflowX: isMobile ? 'auto' : 'visible',
                    minHeight: 48,
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  {pills.map((pill, idx) => (
                    <div
                      className="a3d-pill"
                      key={pill.label}
                      style={{ minWidth: 'auto' }}
                      onClick={() => {
                        const target = document.getElementById(pill.target);
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      <span>{pill.label}</span>
                      <img src={pill.icon} alt="" style={{ paddingTop: 2 }} />
                    </div>
                  ))}
                </div>

                <div
                  className="a3d-btn d-flex align-items-center gap-3 flex-wrap a3d-slide-up"
                  style={{ animationDelay: '0.2s' }}
                >
                  <Link to="/platform/">
                    <button className="a3d-join-btn">Join For Free</button>
                  </Link>
                  {/* <Link to="/platform/subscription"> */}
                  <button
                    className="btn btn-warning text-white"
                    style={{ backgroundColor: '#FF9C3E' }}
                    onClick={() => setSubscriptionModalOpen(true)}
                  >
                    See Plans
                  </button>
                  {/* </Link> */}

                  <a href="#video">
                    <div className="a3d-play-circle">
                      <img src={arrow2} alt="" style={{ width: '34%', marginLeft: 6 }} />
                    </div>
                  </a>
                </div>
              </div>

              <div className="col-lg-5">
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
                      loading="eager"
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
                  style={{ animationDelay: '0.2s', marginTop: window.innerWidth < 768 ? 0 : 40 }}
                >
                  <span className="trusted-label" style={{ fontSize: 14, marginRight: 10 }}>
                    Trusted by:
                  </span>
                  <div
                    className="a3d-trusted-scroll"
                    ref={trustedLogosRef}
                    style={{
                      display: 'flex',
                      gap: 10,
                      overflowX: isMobile ? 'auto' : 'visible',
                      scrollBehavior: 'smooth',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      alignItems: 'center',
                      minHeight: 40,
                    }}
                  >
                    {trustedLogos.map((logo, idx) => (
                      <img key={idx} src={logo.src} alt={logo.alt} style={logo.style} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================= Hero Section End ======================= */}
        </div>

        {/* ========================= How it Work Section  ======================= */}

        <section className="service-cards a3d-fade-in mt-5 pt-md-0 pt-3">
          <div className="container">
            <div className="text-center mb-1">
              <h2 className="section-title" style={{ fontSize: isMobile ? '29px' : '38px' }}>
                How it{' '}
                <span className="perfect-heading">
                  <span className="wr-wrapper">
                    wo
                    <img src={elipse} alt="Ellipse" className="ellipse-img-work" />r
                  </span>
                  ks
                </span>
              </h2>

              <p className="section-subtitle">
                Transform Any 2D data into a High-Precision 3D{' '}
                <span className="d-none d-md-inline">
                  <br />
                </span>
                Model in minutes.
              </p>
            </div>

            <section className="py-3 py-lg-4 services-cards">
              <div className="container">
                <div className="row g-4">
                  {/* Card */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="service-card">
                      <h3 className="service-title">Services we provide</h3>
                      <p className="service-desc">
                        Explore our full range of AI and software services - from concept to
                        deployment, our expert team delivers cutting-edge design, development, and
                        customization solutions for your business.
                      </p>
                      <div className="footer-wrapper">
                        <div className="service-footer">
                          <Link to="/service" className="circle-btn" aria-label="arrow">
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
                          <div
                            className="footer-text"
                            style={{
                              fontFamily: 'DM Sans',
                              fontWeight: 500,
                              fontStyle: 'Medium',
                            }}
                          >
                            Read more
                          </div>
                        </div>
                        <div className="card-icon" aria-hidden="true">
                          <img src={design} alt="Service Icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="service-card">
                      <h3 className="service-title">Buy &amp; sell 2D images</h3>
                      <p className="service-desc">
                        Buy &amp; Sell Assets and 2D Designs - Browse thousands of high quality
                        assets or upload your own creations to sell. Our marketplace connects global
                        buyers with top tier creators and 3D artists.
                      </p>
                      <div className="footer-wrapper">
                        <div className="service-footer">
                          <Link
                            to="#"
                            className="disabled-circle-btn"
                            aria-label="arrow"
                            onClick={(e) => e.preventDefault()}
                          >
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
                          <div
                            className="footer-text"
                            style={{
                              fontFamily: 'DM Sans',
                              fontWeight: 500,
                              fontStyle: 'Medium',
                            }}
                          >
                            Coming soon
                          </div>
                        </div>
                        <div className="card-icon" aria-hidden="true">
                          <img src={store} alt="Store Icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="service-card">
                      <h3 className="service-title">
                        Generate 3D models <br />
                        from image, video or text
                      </h3>
                      <p className="service-desc">
                        Create stunning, photorealistic 3D models from images, videos, or text
                        prompts - all powered by our AI engine. No hardware, no manual modeling,
                        just instant results.
                      </p>
                      <div className="footer-wrapper">
                        <div className="service-footer">
                          <Link to="/platform/" className="circle-btn" aria-label="arrow">
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
                          <div
                            className="footer-text"
                            style={{
                              fontFamily: 'DM Sans',
                              fontWeight: 500,
                              fontStyle: 'Medium',
                            }}
                          >
                            Start creating
                          </div>
                        </div>
                        <div className="card-icon" aria-hidden="true">
                          <img src={Modling} alt="3D Modeling Icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* ========================= Services Section  ======================= */}

        <section className="our-services a3d-fade-in" id="Services">
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
                <div className="business-title">Our Services for Businesses</div>

                <h3 className="business-heading mb-1">Business to Business</h3>

                <p className="business-description">
                  AI3D integrates seamlessly into your existing web, mobile, or desktop ecosystem
                  through robust APIs. From e-commerce and gaming to construction, healthcare, and
                  manufacturing - our AI converts 2D images, videos, and text into lifelike,
                  interactive 3D models in seconds. Flexible licensing and deployment options ensure
                  a perfect fit for your business goals.
                </p>
              </div>

              <div className="row">
                <div className="col-lg-6 mt-lg-0 mt-4">
                  <div className="business-service">
                    <div className="business-service-icon">
                      <img src={gaming} alt="" />
                    </div>

                    <div className="business-service-content">
                      <h5>Gaming</h5>

                      <p>
                        Accelerate game development with instant AI powered 3D scanning - create
                        lifelike assets, immersive worlds and high detail characters faster and at
                        lower cost.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mt-lg-0 mt-4">
                  <div className="business-service">
                    <div className="business-service-icon">
                      <img src={construction} alt="" />
                    </div>

                    <div className="business-service-content">
                      <h5>Construction Rendering</h5>

                      <p>
                        Streamline architectural visualization with AI generated, scalable 3D models
                        - perfect for planning, collaboration, and creating stunning client
                        presentations that win projects.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mt-4">
                  <div className="business-service">
                    <div className="business-service-icon">
                      <img src={health} alt="" />
                    </div>

                    <div className="business-service-content">
                      <h5>Healthcare</h5>

                      <p>
                        Enable precision healthcare with advanced 3D scanning - from custom
                        prosthetics to surgical planning and patient specific anatomical modeling,
                        ensuring accuracy and better outcomes.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mt-4">
                  <div className="business-service">
                    <div className="business-service-icon">
                      <img src={vr} alt="" />
                    </div>

                    <div className="business-service-content">
                      <h5>E-commerce</h5>

                      <p>
                        Increase online conversions with realistic 3D product displays and AR
                        try-ons - enhancing engagement, reducing returns, and improving customer
                        trust.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mt-4">
                  <div className="business-service">
                    <div className="business-service-icon">
                      <img src={e_commerce} alt="" />
                    </div>

                    <div className="business-service-content">
                      <h5>VR</h5>

                      <p>
                        Fuel next-gen VR experiences with AI-generated 3D environments, realistic
                        avatars, and immersive assets - ideal for gaming, training, and simulations.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mt-4">
                  <div className="business-service">
                    <div className="business-service-icon">
                      <img src={machine} alt="" />
                    </div>

                    <div className="business-service-content">
                      <h5>Manufacturing</h5>

                      <p>
                        Optimize manufacturing workflows with instant 3D scanning for prototyping,
                        digital twins, and product visualization - reducing design cycles and
                        speeding up time to market.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="client-services" style={{ paddingBottom: 35 }}>
              <div className="container">
                <div className="row align-items-center" style={{ justifyContent: 'space-between' }}>
                  <div
                    className="col-lg-6 col-12 mb-4 order-lg-1 order-2"
                    style={{
                      display: 'flex',

                      justifyContent: 'center',

                      alignItems: 'center',
                    }}
                  >
                    <img src={mobile} alt="Mobile Preview" className="img leap-img me-md-4 mx-2" />
                  </div>

                  <div className="client-section col-lg-5 col-12 mb-4 order-lg-2 order-1">
                    <div>
                      <div className="client-section-title text-center">
                        Our Services for Clients
                      </div>

                      <h3 className="client-heading text-center">Business to Client</h3>

                      <p className="section-subtitle">
                        Experience the power of AI3D anywhere - on Android, iOS, and Web. Our
                        AI-powered 3D Scanning platform lets you instantly transform 2D images into
                        high-precision, photorealistic 3D models without the need for complex tools
                        or technical skills.
                        <br />
                        Create, customize, and export your models effortlessly for gaming, AR/VR,
                        product design, 3D printing, or personal projects.
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
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="scan_section py-5">
          <div className="container scan_container">
            <div className="row align-items-center justify-content-between">
              <div className="col-lg-5 col-12 mb-5 mb-md-0">
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

                <p className="scan_description" style={{ width: '95%', color: '#1A1A40B2' }}>
                  AI3D combines cutting-edge AI algorithms with powerful cloud infrastructure to
                  deliver studio-quality 3D scanning that's fast, accurate, and secure. Whether
                  you're creating for gaming, e-commerce, design, or enterprise use, our features
                  ensure your results are top-tier and ready for production.
                </p>
              </div>

              <div className="col-lg-6 col-md-10 col-12 mb-5 mb-md-0">
                <div className="square-wrapper">
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

                      <h5 className="scan_card_title">
                        High-Precision
                        <span className="d-none d-lg-inline">
                          <br />
                        </span>
                        Scanning
                      </h5>

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

                      <h5 className="scan_card_title">
                        AI Model
                        <span className="d-none d-lg-inline">
                          <br />
                        </span>
                        Processing
                      </h5>

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

                      <h5 className="scan_card_title">Instant Results</h5>

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

                      <h5 className="scan_card_title">Enterprise Security</h5>

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
                </div>
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

            <div className="search_container mx-auto mt-2">
              <div className="input_with_icon">
                <img src={search} alt="Search" className="input_icon" />

                <input type="text" className="search_input" placeholder="Search 3D Models" />
              </div>

              <button className="search_button">
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* ========================= Services Section End  ======================= */}

        <section className="model_section py-4 ai_3d_landing">
          <div className="container">
            <div className="row g-md-4">
              {(showAllModels ? models : models.slice(0, 6)).map((card, idx) => {
                const imgUrl = card.image
                  ? `https://app.ai3dscanning.com/storage/${card.image.replace(/^\/+/, '')}`
                  : modelFallback;

                return (
                  <div className="col-12 col-sm-6 col-lg-4" key={card.id || idx}>
                    <div className="model_card">
                      <img
                        src={imgUrl}
                        className="model_image"
                        alt={card.title}
                        onError={(e) => (e.target.src = modelFallback)}
                      />

                      <div className="model_footer">
                        <div className="model_label">
                          {card.title}
                          <span className="model_price">23K</span>
                        </div>

                        <a href="#" className="model_card_button">
                          <img src={modelButtonIcon} alt="Go" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="col-12 d-flex justify-content-end">
                <button
                  className="toggle_arrow_btn1"
                  onClick={() => setShowAllModels((prev) => !prev)}
                >
                  <img
                    src={down}
                    alt=""
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
              <div className="api_content" style={{ textAlign: 'center' }}>
                <h3 className="api_title">Business 3D API</h3>

                <p className="api_subtitle">More than quality, we develop language API</p>
              </div>

              <a href="#" className="api_button">
                Connect API
              </a>
            </div>
          </div>
        </section>

        <div className="logo_slider">
          <div className="logo_track">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={`logos-${i}`}>
                <img src={googleStartups} alt="Google" />

                <img src={googleCloud} alt="Google Cloud" />

                <img src={pitb} alt="PITB" />

                <img src={regionalPlan} alt="Regional Plan" />

                <img src={consulting} alt="Consulting" />

                <img src={veraAi} alt="Vera AI" />

                <img src={nvidia} alt="NVIDIA" />
              </React.Fragment>
            ))}
          </div>
        </div>

        <section className="video_section py-lg-4 py-1 mb-3" id="video">
          <div className="container">
            <div className="row justify-content-center g-0 px-0">
              <div className="col-12 col-lg-12 col-xxl-10">
                <div
                  className="video-wrapper position-relative ratio ratio-16x9"
                  id="videoWrapper"
                  onClick={togglePlayPause}
                >
                  <video
                    id="customVideo"
                    ref={videoRef}
                    style={{ borderRadius: 5, width: '100%', height: '100%' }}
                    loop
                  >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {!isPlaying && (
                    <img
                      id="playButton"
                      src={videoIcon}
                      alt="Play"
                      className="custom-play-btn position-absolute top-50 start-50 translate-middle"
                      style={{ cursor: 'pointer', width: '80px' }}
                    />
                  )}

                  {isPlaying && (
                    <FontAwesomeIcon
                      id="pauseButton"
                      icon={faPauseCircle}
                      className="pause-icon position-absolute top-50 start-50 translate-middle"
                      style={{ cursor: 'pointer', fontSize: '3rem', color: 'white', opacity: 0.8 }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="aithreed">
          <section className="cards pt" id="Leadership">
            <div className="container-fluid">
              {/* Header */}

              <div className="row mt-5 justify-content-center marb">
                <div className="text-center mb-lg-4 mb-md-3 mb-0">
                  <p className="mb-3 needd">Our Leadership</p>

                  <div className="faq-head">
                    <h2 className="faq-t text-black">Our Team Members</h2>

                    <img src={rainbowImg} alt="Rainbow" className="rainbow-over" />
                  </div>

                  <p className="text-muted text d-lg-block">Meet Our C-Level Executive Team</p>
                </div>

                {/* Static Cards (CEO & Advisor) */}

                <div className="team-card-container col-12 col-md-4 col-3 mb-0 mt-3">
                  <div className="team-slide">
                    <div className="img-container Hillier">
                      <img src={ArslanSir} alt="Arslan Ahmad" />
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
                </div>

                {modalData && (
                  <CustomInfoModal modalData={modalData} onClose={() => setModalData(null)} />
                )}
              </div>

              {/* Splide Slider for Team Members */}

              <div className="splide mt-4" id="team-slider" aria-label="Team Slider">
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
                        img: SamiaMam,
                        name: 'Samia Rasheed',
                        role: 'HR Associate & Social Media Manager',
                        desc: 'Supports hiring processes while managing brand voice and engagement across platforms.',
                      },
                      // Repeat for loop effect (optional)

                      {
                        img: UsamaSir,
                        name: 'Usama Ahmad',
                        role: 'Admin & Finance Manager',
                        desc: 'Manages company finances, budgeting, and administrative operations with precision and compliance.',
                      },
                      {
                        img: SajeelSir,
                        name: 'Sajeel Nisar',
                        role: 'AI Lead',
                        desc: 'Architecting and training core AI models driving 2D-to-3D transformation at AI3D.',
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
              </div>

              {/* Custom Navigation Buttons */}

              <div className="cc mt-4">
                <div className="icon-toggle-wrapper d-flex justify-content-center ">
                  <button
                    type="button"
                    id="prevBtn"
                    className="icon-toggle-label btn btn-outline-primary"
                  >
                    <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
                  </button>

                  <button
                    type="button"
                    id="nextBtn"
                    className="icon-toggle-label btn btn-outline-primary right"
                  >
                    <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
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
                  From gaming and e-commerce to healthcare, manufacturing, and construction, our
                  clients trust
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
            <section className="testimonial-section relative" style={{ padding: '50px 30px' }}>
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
            </section>

            {/* Navigation */}
            <div className="custom-nav">
              <div className="nav-btn" id="prevBtn" onClick={prev}>
                <img width="12px" src={leftic} alt="" />
              </div>
              <div className="nav-btn" id="nextBtn" onClick={next}>
                <img width="12px" src={rightic} alt="" />
              </div>
            </div>
          </section>

          <section className="difficult" style={{ marginTop: 65, marginBottom: 90 }}>
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

                {/* Card 1 */}

                <div className="col-lg-3 col-md-6 col-sm-6 col-12 response marg sepra">
                  <div className="roadmap-card text-center h-100">
                    <div className="icon-box mx-auto">
                      <div className="box">
                        <img src={topRight} alt="" />
                      </div>

                      <img src={manIcon} alt="" style={{ height: 52 }} />
                    </div>

                    <h5>Initial Development</h5>

                    <p className="all" style={{ color: 'rgba(26, 26, 64, 0.7)' }}>
                      scanning modules. This stage focuses on research, prototyping, and
                      infrastructure setup. Laying the foundation for our AI engine, mobile & web
                      applications, and core
                    </p>
                  </div>

                  <div className="posi">
                    <img src={one} alt="Bottom Base" className="bottom-base-img img-fluid" />
                  </div>
                </div>

                {/* Card 2 */}

                <div className="col-lg-3 col-md-6 col-sm-6 col-12 response marg">
                  <div className="roadmap-card text-center h-100">
                    <div className="icon-box mx-auto">
                      <div className="box">
                        <img src={topRight} alt="" />
                      </div>

                      <img src={tv} alt="" style={{ height: 52 }} />
                    </div>

                    <h5>Development Mode Release</h5>

                    <p className="all">
                      Continuous iteration based on feedback. scanning platform for internal testing
                      and selected early adopters. Launching the first functional version of our
                      AI-powered
                      <br className="d-lg-block d-block" />
                      <br className="d-lg-block d-block" />
                    </p>
                  </div>

                  <div className="posi">
                    <img src={two} alt="Bottom Base" className="bottom-base-img img-fluid" />
                  </div>
                </div>

                {/* Card 3 */}

                <div className="col-lg-3 col-md-6 col-sm-6 col-12 response marg topm">
                  <div className="roadmap-card text-center h-100">
                    <div className="icon-box mx-auto">
                      <div className="box">
                        <img src={topRight} alt="" />
                      </div>

                      <img src={beta} alt="" style={{ height: 52 }} />
                    </div>

                    <h5>Beta Release</h5>

                    <p className="all">
                      Exclusive access for our B2B and B2C waitlist clients, allowing them to test
                      features, provide input, and help shape the final product.
                      <br className="d-lg-block d-block" />
                      <br className="d-lg-block d-block" />
                    </p>
                  </div>

                  <div className="posi">
                    <img src={three} alt="Bottom Base" className="bottom-base-img img-fluid" />
                  </div>
                </div>

                {/* Card 4 */}

                <div className="col-lg-3 col-md-6 col-sm-6 col-12 response marg topm">
                  <div className="roadmap-card text-center h-100">
                    <div className="icon-box mx-auto">
                      <div className="box">
                        <img src={topRight} alt="" />
                      </div>

                      <img src={lock} alt="" style={{ height: 52 }} />
                    </div>

                    <h5>Public Release</h5>

                    <p className="all">
                      Full-scale launch for general customers, enterprises, and partners—delivering
                      our complete suite of scanning, editing, and 3D asset management features
                      <br className="d-lg-block d-block" />
                      <br className="d-lg-block d-block" />
                    </p>
                  </div>

                  <div className="posi">
                    <img src={four} alt="Bottom Base" className="bottom-base-img img-fluid" />
                  </div>
                </div>
              </div>
            </div>
          </section>

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
                  <form>
                    <div className="form-row">
                      <div className="form-input">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Enter email address*"
                          required=""
                        />
                      </div>
                      <button type="submit" className="btn btn-subscribe">
                        Subscribe
                      </button>
                    </div>
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
                        className="btn english"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img src={world} alt="World" style={{ width: 18, marginRight: 6 }} />
                        English
                        <FaChevronDown size={12} className="ms-2" />
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
                        className="btn usd"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        $USD
                        <FaChevronDown size={12} className="ms-2" />
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
                          className="btn english"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <img src={world} alt="World" style={{ width: 18, marginRight: 6 }} />
                          English
                          <FaChevronDown size={12} className="ms-2" />
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
                          className="btn usd"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          $USD
                          <FaChevronDown size={12} className="ms-2" />
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
                        <a
                          href={
                            item === 'Pricing'
                              ? '/platform/subscription'
                              : item === 'About us'
                                ? '#aboutus'
                                : '#'
                          }
                        >
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
                        <a href={item === 'FAQ' ? '#FAQs' : '#help'}>
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
                          href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@ai3dscanning.com"
                          target="_blank"
                          className="mt-1"
                          rel="noopener noreferrer"
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

      {/* Subscription Modal */}
      <LandingPageModal
        open={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        onRequireLogin={handleOpenLogin}
      />

      {showLoginModal && ( 
        <LoginPopup
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
          }}
        />
      )}
    </>
  );
};

export default LandingPage;
