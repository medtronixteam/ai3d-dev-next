import React, { useEffect, useRef } from 'react';
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

    const sectionRef = useRef(null);
    const nodesRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Add animation class to the main section
                        entry.target.classList.add('animate-in');
                        
                        // Animate nodes with staggered delay
                        nodesRef.current.forEach((node, index) => {
                            if (node) {
                                setTimeout(() => {
                                    node.classList.add('animate-in');
                                }, index * 200); // Stagger animation
                            }
                        });
                        
                        // Start snake path animation
                        const snakePath = entry.target.querySelector('.snake-svg path');
                        if (snakePath) {
                            setTimeout(() => {
                                snakePath.style.strokeDashoffset = '0';
                            }, 300);
                        }
                        
                        // Animate start arrow
                        const startArrow = entry.target.querySelector('.start-arrow');
                        if (startArrow) {
                            setTimeout(() => {
                                startArrow.classList.add('pulse');
                            }, 400);
                        }
                        
                        // Animate end target
                        const endTarget = entry.target.querySelector('.end-target');
                        if (endTarget) {
                            setTimeout(() => {
                                endTarget.classList.add('pulse-slow');
                            }, 500);
                        }
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section className="roadmap-section" ref={sectionRef}>
            <div className="container">
                {/* <div className="header-wrapper">
                    <h2 className="title">Our Roadmap</h2>
                    {elipse && (
                        <img src={elipse} className="elipse-bg" alt="" />
                    )}
                </div> */}

                <div className="roadmap-main">
                    {/* Desktop Graphics: Path, Start Arrow, End Target */}
                    <div className="desktop-only-assets">
                        {snakeImg ? (
                            <img
                                src={snakeImg}
                                className="snake-img"
                                alt="road path"
                            />
                        ) : (
                            <svg
                                className="snake-svg"
                                viewBox="0 0 1200 400"
                                preserveAspectRatio="none"
                            >
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
                            <img
                                src={targetEnd}
                                className="end-target"
                                alt=""
                            />
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
                                    '--delay': `${index * 0.1}s`
                                }}
                                ref={(el) => (nodesRef.current[index] = el)}
                            >
                                {/* Logic for Desktop vs Mobile is handled in CSS */}
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
                                        <span className="mobile-step">
                                            Step 0{index + 1}
                                        </span>
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
    );
};

export default RoadmapSection;