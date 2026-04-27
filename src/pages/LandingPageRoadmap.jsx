import React, { useEffect, useRef, useState, useCallback } from 'react';
import './RoadmapSection.css';
import snakeImg from '../assets/images/snakeImg.png';
import arrowStart from '../assets/images/arrowStart.png';
import targetEnd from '../assets/images/targetEnd.png';
import manIcon from '../assets/images/manIcon.png';
import Desktop from '../assets/images/desktop.png';
import BetaRelease from '../assets/images/beta-release.png';
import Public from '../assets/images/Public.png';

const AUTO_ANIMATE_DELAY = 3000; // section visible hone ke 3 sec baad

const RoadmapSection = ({ elipse }) => {
    const roadmapData = [
        {
            title: 'Initial Development',
            desc: 'Laying the foundation for our AI engine, mobile & web applications, and core scanning modules. This stage focuses on research, prototyping, and infrastructure setup.',
            icon: manIcon,
            pos: 'up',
            left: '13.5%',
            top: '22%',
        },
        {
            title: 'Development Mode Release',
            desc: 'Launching the first functional version of our AI-powered scanning platform for internal testing and selected early adopters. Continuous iteration based on feedback.',
            icon: Desktop,
            pos: 'down',
            left: '36%',
            top: '9%',
        },
        {
            title: 'Beta Release',
            desc: 'Exclusive access for our B2B and B2C waitlist clients, allowing them to test features, provide input, and help shape the final product',
            icon: BetaRelease,
            pos: 'up',
            left: '58.5%',
            top: '22%',
        },
        {
            title: 'Public Release',
            desc: 'Full-scale launch for general customers, enterprises, and partners delivering our complete suite of scanning, editing, and 3D asset management features.',
            icon: Public,
            pos: 'down',
            left: '80.8%',
            top: '9%',
        },
    ];

    const sectionRef       = useRef(null);
    const containerRef     = useRef(null);
    const nodesRef         = useRef([]);
    const autoAnimateTimer = useRef(null);
    const scrollTookOver   = useRef(false); // scroll ne control liya ya nahi

    const [activeIndex, setActiveIndex] = useState(-1);
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= 900 : false
    );

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 900);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ─── Sab nodes animate karne ka kaam ──────────────────────────────────────
    const animateAllNodes = useCallback(() => {
        if (scrollTookOver.current) return; // scroll chal raha hai, mat chalao

        if (sectionRef.current) {
            sectionRef.current.classList.add('animate-in');

            const snakePath = sectionRef.current.querySelector('.snake-svg path');
            if (snakePath) {
                setTimeout(() => { snakePath.style.strokeDashoffset = '0'; }, 300);
            }
            const startArrow = sectionRef.current.querySelector('.start-arrow');
            if (startArrow) {
                setTimeout(() => startArrow.classList.add('pulse'), 400);
            }
            const endTarget = sectionRef.current.querySelector('.end-target');
            if (endTarget) {
                setTimeout(() => endTarget.classList.add('pulse-slow'), 500);
            }
        }

        // Nodes ek ek kar ke 300ms stagger se show karo
        nodesRef.current.forEach((node, index) => {
            if (node) {
                setTimeout(() => {
                    node.classList.add('animate-in');
                }, 300 + index * 300);
            }
        });
    }, []);

    // ─── INTERSECTION OBSERVER ────────────────────────────────────────────────
    // Section screen mein aaye TAB timer shuru karo (page load pe nahi)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');

                        const snakePath = entry.target.querySelector('.snake-svg path');
                        if (snakePath) {
                            setTimeout(() => { snakePath.style.strokeDashoffset = '0'; }, 300);
                        }
                        const startArrow = entry.target.querySelector('.start-arrow');
                        if (startArrow) {
                            setTimeout(() => startArrow.classList.add('pulse'), 400);
                        }
                        const endTarget = entry.target.querySelector('.end-target');
                        if (endTarget) {
                            setTimeout(() => endTarget.classList.add('pulse-slow'), 500);
                        }

                        if (isMobile) {
                            // Mobile: seedha animate karo, koi sticky scroll nahi hota
                            nodesRef.current.forEach((node, index) => {
                                if (node) {
                                    setTimeout(() => {
                                        node.classList.add('animate-in');
                                    }, index * 100);
                                }
                            });
                            scrollTookOver.current = true;
                        } else {
                            // Desktop: section screen mein aaya, ab 3 sec ka timer shuru karo
                            clearTimeout(autoAnimateTimer.current);
                            autoAnimateTimer.current = setTimeout(() => {
                                animateAllNodes();
                            }, AUTO_ANIMATE_DELAY);
                        }
                    } else {
                        // Section screen se bahar gayi — timer cancel karo
                        clearTimeout(autoAnimateTimer.current);
                        scrollTookOver.current = false;
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            clearTimeout(autoAnimateTimer.current);
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, [isMobile, animateAllNodes]);

    // ─── DESKTOP SCROLL ───────────────────────────────────────────────────────
    // Jab user sticky zone mein ghuse → timer cancel, scroll apna kaam kare
    useEffect(() => {
        if (!isMobile) {
            const getScrollParent = (node) => {
                if (node == null) return null;
                if (node.scrollHeight > node.clientHeight) {
                    const overflowY = window.getComputedStyle(node).overflowY;
                    if (overflowY === 'auto' || overflowY === 'scroll') return node;
                }
                return getScrollParent(node.parentNode);
            };

            const scrollContainer = getScrollParent(containerRef.current) || window;

            const handleScroll = () => {
                if (!containerRef.current || !sectionRef.current) return;

                const rect = containerRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const startOffset = windowHeight * 0.15;
                const scrollableDistance = rect.height - windowHeight;

                // Section sticky zone se bahar — sirf activeIndex reset karo
                if (rect.top > startOffset + 50) {
                    setActiveIndex(-1);
                    return;
                }

                // User sticky zone mein aa gaya — timer cancel, scroll control le lo
                if (!scrollTookOver.current) {
                    clearTimeout(autoAnimateTimer.current);
                    scrollTookOver.current = true;
                }

                let currentProgress = (startOffset - rect.top) / scrollableDistance;
                currentProgress = Math.max(0, Math.min(1, currentProgress));

                let newIndex = -1;
                if (currentProgress >= 0)   newIndex = 0;
                if (currentProgress > 0.15) newIndex = 1;
                if (currentProgress > 0.35) newIndex = 2;
                if (currentProgress > 0.55) newIndex = 3;

                setActiveIndex(newIndex);
            };

            scrollContainer.addEventListener('scroll', handleScroll);
            handleScroll();
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, [isMobile]);

    // ─── SYNC activeIndex → node classes (original scroll animation logic) ────
    useEffect(() => {
        if (!isMobile) {
            nodesRef.current.forEach((node, index) => {
                if (node) {
                    if (index <= activeIndex) {
                        node.classList.add('animate-in');
                    } else {
                        node.classList.remove('animate-in');
                    }
                }
            });
        }
    }, [activeIndex, isMobile]);

    return (
        <div
            ref={containerRef}
            className="roadmap-sticky-wrapper"
            style={{ height: isMobile ? 'auto' : '400vh', position: 'relative' }}
        >
            <div
                className="roadmap-sticky-content"
                style={{
                    position: isMobile ? 'static' : 'sticky',
                    top: isMobile ? 'auto' : '15vh',
                    height: isMobile ? 'auto' : '70vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <section className="roadmap-section" ref={sectionRef}>
                    <div className="container">
                        <div className="roadmap-main">

                            <div className="desktop-only-assets">
                                {snakeImg ? (
                                    <img src={snakeImg} className="snake-img" alt="road path" />
                                ) : (
                                    <svg className="snake-svg" viewBox="0 0 1200 400" preserveAspectRatio="none">
                                        <path
                                            d="M0,200 L100,200 C130,200 130,60 250,60 C370,60 370,340 500,340 C630,340 630,60 750,60 C870,60 870,340 1000,340 C1130,340 1130,200 1200,200"
                                            fill="none"
                                            stroke="#e6e6e6"
                                            strokeWidth="3"
                                            strokeDasharray="6,8"
                                        />
                                    </svg>
                                )}
                                <img src={arrowStart} className="start-arrow" alt="" />
                                <div className="end-target-wrap">
                                    <img src={targetEnd} className="end-target" alt="" />
                                    <div className="end-target-arrow"></div>
                                </div>
                            </div>

                            <div className="nodes-container">
                                {roadmapData.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`roadmap-node ${item.pos}`}
                                        style={{
                                            '--left': item.left,
                                            '--top': item.top,
                                            '--delay': isMobile ? `${index * 0.1}s` : '0s',
                                        }}
                                        ref={(el) => (nodesRef.current[index] = el)}
                                    >
                                        <div className="node-wrapper-inner">
                                            <div className="icon-wrap">
                                                <div className="icon-box">
                                                    <img src={item.icon} alt="" />
                                                </div>
                                            </div>

                                            <div className="connector-line">
                                                <div
                                                    className={`node-anchor ${item.pos === 'up' ? 'top' : 'bottom'}`}
                                                ></div>
                                            </div>

                                            <div className="text-content">
                                                <span className="mobile-step">Step 0{index + 1}</span>
                                                <h6>{item.title}</h6>
                                                <p>{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RoadmapSection;