import React, { useEffect, useRef, useState } from 'react';
import './RoadmapSection.css';
import snakeImg from '../assets/images/snakeImg.png';
import arrowStart from '../assets/images/arrowStart.png';
import targetEnd from '../assets/images/targetEnd.png';
import manIcon from '../assets/images/manIcon.png';
import Desktop from '../assets/images/desktop.png';
import BetaRelease from '../assets/images/beta-release.png';
import Public from '../assets/images/Public.png';

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

    const sectionRef        = useRef(null);
    const containerRef      = useRef(null);
    const nodesRef          = useRef([]);
    const autoAdvanceTimer  = useRef(null); // ← auto-advance timer

    const [activeIndex, setActiveIndex] = useState(-1);
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= 900 : false
    );

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 900);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ─── INTERSECTION OBSERVER (section + mobile nodes) ───────────────────────
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');

                        const snakePath = entry.target.querySelector('.snake-svg path');
                        if (snakePath) setTimeout(() => { snakePath.style.strokeDashoffset = '0'; }, 300);

                        const startArrow = entry.target.querySelector('.start-arrow');
                        if (startArrow) setTimeout(() => startArrow.classList.add('pulse'), 400);

                        const endTarget = entry.target.querySelector('.end-target');
                        if (endTarget) setTimeout(() => endTarget.classList.add('pulse-slow'), 500);

                        if (isMobile) {
                            nodesRef.current.forEach((node, i) => {
                                if (node) setTimeout(() => node.classList.add('animate-in'), i * 100);
                            });
                        }
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, [isMobile]);

    // ─── DESKTOP SCROLL ───────────────────────────────────────────────────────
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

                if (rect.top > startOffset + 50) {
                    setActiveIndex(-1);
                    return;
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

            return () => {
                scrollContainer.removeEventListener('scroll', handleScroll);
            };
        }
    }, [isMobile]);

    // ─── AUTO-ADVANCE: activeIndex change hone par 2 sec baad next step ──────
    useEffect(() => {
        if (!isMobile) {
            if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);

            // Sirf tab timer lagao jab section visible ho aur last step nahi aaya
            if (activeIndex >= 0 && activeIndex < roadmapData.length - 1) {
                autoAdvanceTimer.current = setTimeout(() => {
                    setActiveIndex((prev) => {
                        if (prev < roadmapData.length - 1) return prev + 1;
                        return prev;
                    });
                }, 2000);
            }

            return () => {
                if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
            };
        }
    }, [activeIndex, isMobile]);

    // ─── activeIndex → node classes ───────────────────────────────────────────
    useEffect(() => {
        if (!isMobile) {
            nodesRef.current.forEach((node, index) => {
                if (node) {
                    if (index <= activeIndex) node.classList.add('animate-in');
                    else node.classList.remove('animate-in');
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
                                                <div className={`node-anchor ${item.pos === 'up' ? 'top' : 'bottom'}`}></div>
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