import React, { useState } from 'react';
import './ourServices.css';
import { SERVICES, ArrowBack, Project, ProcessBg, ourProcess, ArrowDown, ArrowUp } from './servicesData';
import elipse from '../pages/images/heading_ellipse.png';
import Mv from '../assets/service/Mv.svg'

/* ── avatar */
const MEMBER_DATA = [
  { src: null, letter: 'A' },
  { src: 'https://randomuser.me/api/portraits/men/32.jpg', letter: 'B' },
  { src: 'https://randomuser.me/api/portraits/women/44.jpg', letter: 'C' },
  { src: null, letter: 'D' },
];

const Avatar = ({ src, letter, color }) => (
  src
    ? <img className="osm-avatar osm-avatar-img" src={src} alt={letter} />
    : <div className="osm-avatar osm-avatar-initial" style={{ background: color }}>{letter}</div>
);

const AVATAR_COLORS = ['#de3996', '#a052b5', '#ff85ca', '#7c3aed', '#059669', '#0ea5e9'];

const STEP_POSITIONS = [
  { left: '3%',   top: '45%' },  
  { left: '36%',  top: '35.5%' },   
  { left: '69%',  top: '27%'  },  
  { left: '36%',  top: '70%' }, 
  { left: '69%',  top: '82%' },  
];

const OurServicesModal = ({ isOpen, onClose, defaultModel = 'Project to Project' }) => {
  const [activeId, setActiveId] = useState(SERVICES[0].id);

  if (!isOpen) return null;

  const active = SERVICES.find((s) => s.id === activeId);

  return (
    <div className="osm-page">

      <div className="osm-topbar">
        <span className="osm-change-btn" onClick={onClose}>
           <span className="osm-back-icon"><img src={ArrowBack} alt="Back" className='mt-3' /></span>
          Change Model
        </span>
         <div style={{ width: '1px', height: '22px', background: '#0000001A' }} />
        <div className="osm-breadcrumb">
          <span className="osm-project-icon"><img src={Project} alt="Back" width={14} height={14} /></span>
          {defaultModel}
        </div>
      </div>

      {/* ── Heading ─────────────────────────────────────── */}
      <div className="osm-heading-wrap">
        <h2 className="osm-title">
          Our 7{' '}
          <span className="osm-arch-wrap">
            <img src={elipse} alt="elipse" className="osm-arch"  />
            Service
          </span>
          {' '}Areas
        </h2>
        <p className="osm-subtitle">7 specialized service areas, each backed by a dedicated <br /> expert team.</p>
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="osm-body position-relative">

          <span className="wms-deco wms-deco-plus wms-deco-1">✦</span>
          <span className="wms-deco wms-deco-dot  wms-deco-2" />
          <span className="wms-deco wms-deco-plus wms-deco-3">✦</span>
          <span className="wms-deco wms-deco-dot  wms-deco-4" />

        {/* sidebar */}
        <aside className="osm-sidebar">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              className={`osm-sidebar-item ${activeId === s.id ? 'osm-sidebar-item--active' : ''}`}
              onClick={() => setActiveId(s.id)}
            >
              <img src={s.icon} alt={s.label} className="osm-sidebar-icon" />
              <span>{s.label}</span>
              {activeId === s.id && (
                 <img src={Mv}  className="osm-sidebar-arrow" width={15} height={15} />
              )}
            </button>
          ))}
        </aside>

        {/* content */}
            <div className="osm-content">
                <div className="osm-content-bg">
                    <img src={active.bgIcon} alt="" className="osm-content-bg-img" />
                </div>

                <div className="osm-service-header">
                    <div className="osm-service-icon-wrap">
                    <img src={active.icon} alt={active.heading} className="osm-service-icon" />
                    </div>
                    <h3 className="osm-service-heading">{active.heading}</h3>
                </div>

                <p className="osm-service-intro">{active.intro}</p>

                <ul className="osm-bullets">
                    {active.bullets.map((b, i) => (
                    <li key={i} className="osm-bullet-item">
                        <span className="osm-bullet-dot" />
                        {b}
                    </li>
                    ))}
                </ul>

                <div className="osm-tech-wrap">
                    <p className="osm-tech-label">Tech Stack</p>
                    <div className="osm-tech-pills">
                    {active.techStack.map((t, i) => (
                        <span key={i} className="osm-tech-pill">{t}</span>
                    ))}
                    </div>
                </div>

                <div className="osm-members-wrap">
                    <div className="osm-avatars">
                    {Array.from({ length: Math.min(active.members, 4) }).map((_, i) => (
                      <Avatar
                        key={i}
                        src={MEMBER_DATA[i]?.src}
                        letter={MEMBER_DATA[i]?.letter || String.fromCharCode(65 + i)}
                        color={AVATAR_COLORS[i % AVATAR_COLORS.length]}
                      />
                    ))}
                    </div>
                    <span className="osm-members-count">{active.members} members</span>
                </div>
                
            </div>

            {/* <div className="osm-process-section">
                <h4 className="osm-process-title">Our Process</h4>

                {PROCESS_STEPS.map((step, i) => (
                    <div
                        key={i}
                        className="osm-proc-card"
                        style={{
                        left: STEP_POSITIONS[i].left,
                        top:  STEP_POSITIONS[i].top,
                        }}
                    >
                        <img src={step.num} alt="" className="osm-proc-num" />
                        <img src={step.icon} alt={step.label} className="osm-proc-icon" />
                        <p className="osm-proc-label">{step.label}</p>
                        <p className="osm-proc-desc">{step.desc}</p>
                  </div>
                ))}

            </div> */}
      </div>

      {/* ── Our Process ── */}
        <section>
          <h3 className="dem-process-title">Our Process</h3>
              <div className="dem-process-section">
                <img src={ProcessBg} alt="" className="dem-process-bg" aria-hidden="true" />
        
                <div className="dem-process-track">
                  {ourProcess.map((step, index) => (
                    <React.Fragment key={step.step}>
        
                      <div className={`dem-proc-card ${index % 2 === 0 ? 'dem-proc-card--top' : 'dem-proc-card--bottom'}`}>
                        <div className="dem-proc-icon-row">
                          <div className="">
                            <img src={step.icon} alt={step.title} className="dem-proc-icon" />
                          </div>
                          <span className="dem-proc-num d-none d-md-block">{step.step}</span>
                        </div>
                        <h4 className="dem-proc-label">{step.title}</h4>
                        <p className="dem-proc-desc">{step.description}</p>
                      </div>
        
                      {index < ourProcess.length - 1 && (
                        <div className={`dem-proc-arrow-wrap ${index % 2 === 0 ? 'arrow-top' : 'arrow-bottom'}`}>
                          <img
                            src={index % 2 === 0 ? ArrowUp : ArrowDown}
                            alt=""
                            className="dem-proc-arrow"
                            aria-hidden="true"
                          />
                        </div>
                      )}
        
                    </React.Fragment>
                  ))}
                </div>
              </div>
        
              <div className="d-flex align-items-center justify-content-center mx-auto mt-4 gap-3">
                <button className='browse-service-btn'>Start a Project</button>
                <button className='browse-free-call'>Book a Free Call</button>
              </div>
        </section>


    </div>
  );
};

export default OurServicesModal;