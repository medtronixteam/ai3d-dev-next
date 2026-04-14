import React from 'react'
import { arrowAssets, ourProcess } from './dedicatedData'
import './dedicated.css'
import { Link } from 'react-router-dom'

const DedicatedModal = ({ isOpen, onClose }) => {
  const { ArrowBack, Dedicated, elipse, ProcessBg, ArrowUp, ArrowDown, ContractLength, Cbg, AE
    , Backend, UIUX, Flutter, DevOps, Stack
   } = arrowAssets

  if (!isOpen) return null

  return (
    <div className="ded-page">

      {/* ── Topbar ── */}
      <div className="dem-topbar">
        <span className="osm-change-btn" onClick={onClose}>
          <span className="osm-back-icon">
            <img src={ArrowBack} alt="Back" className="mt-3" />
          </span>
          Change Model
        </span>
        <div style={{ width: '1px', height: '22px', background: '#0000001A' }} />
        <div className="osm-breadcrumb">
          <span className="osm-project-icon">
            <img src={Dedicated} alt="Dedicated" width={14} height={14} />
          </span>
          Dedicated Engineers
        </div>
      </div>

      {/* ── Heading ── */}
      <div className="dem-heading-wrap">
        <h2 className="dem-title">
          AI &amp; {' '}
          <span className="dem-arch-wrap">
            <img src={elipse} alt="elipse" className="dem-arch" />
            Full-Stack{' '}
          </span>
          {' '}Engineers{' '}In Your Team
        </h2>
        <p className="dem-subtitle">
          We embed senior engineers into your team on 3–12 month contracts. No recruiting,{' '}
          <br /> no HR — they show up like your own employees.
        </p>
      </div>

      {/* yaha place karna h section */}
      <div className="dem-section-chart-wrapper d-none d-xl-flex">

            <span className="pti-deco pti-deco-5">✦</span>
            <span className="pti-deco pti-deco-6" />
            <span className="pti-deco pti-deco-7">✦</span>
            <span className="pti-deco pti-deco-8" />
            <span className="pti-deco pti-deco-9">✦</span>
            <span className="pti-deco pti-deco-10">✦</span>
            <span className="pti-deco pti-deco-11" />
            <span className="pti-deco pti-deco-12" />

          <svg className="dem-section-lines">
          <defs>
            <marker 
              id="arrow-down" 
              markerWidth="5" 
              markerHeight="5" 
              refX="0" 
              refY="2.5" 
              orient="auto-start-reverse"
            >
              <polygon points="0 0, 5 2.5, 0 5" fill="#DE399680" />
            </marker>
            <marker 
              id="arrowhead" 
              markerWidth="5" 
              markerHeight="5" 
              refX="0" 
              refY="2.5" 
              orient="auto"
            >
              <polygon points="0 0, 5 2.5, 0 5" fill="#DE399680" />
            </marker>
          </defs>

            <path d="M 602 130 L 602 185" />
            <path d="M 150 185 L 1055 185" />
            <path d="M 150 185 L 150 215"  markerEnd="url(#arrowhead)" />
            <path d="M 400 185 L 400 275" markerEnd="url(#arrowhead)" />
            <path d="M 735 185 L 735 215" markerEnd="url(#arrowhead)" />
            <path d="M 1055 185 L 1055 280" markerEnd="url(#arrowhead)" />

            <path d="M 150 345 L 150 425" markerStart="url(#arrow-down)" />
            <path d="M 150 425 L 1055 425" />
            <path d="M 1055 425 L 1055 392" markerEnd="url(#arrowhead)" />
            <path d="M 400 390 L 400 425" markerStart="url(#arrow-down)" />
            <path d="M 735 345 L 735 425" markerStart="url(#arrow-down)"  />
            <path d="M 602 425 L 602 475"  />

            <path d="M 602 570 L 602 630" />
            <path d="M 420 635 L 700 635" />
            <path d="M 420 635 L 420 745" markerEnd="url(#arrowhead)" />
            <path d="M 700 635 L 700 700" markerEnd="url(#arrowhead)" />
            <path d="M 280 505 L 925 505" />
            <path d="M 280 505 L 280 840" markerEnd="url(#arrowhead)" />
            <path d="M 100 635 L 280 635" />
            <path d="M 100 635 L 100 745" markerEnd="url(#arrowhead)" />
            <path d="M 925 505 L 925 840" markerEnd="url(#arrowhead)" />
            <path d="M 925 635 L 1100 635" />
            <path d="M 1100 635 L 1100 745" markerEnd="url(#arrowhead)" />

          </svg>
          
          <div className="dem-section-header dem-section-header-top">
                <img src={ContractLength} alt="" width={80} height={80} />
                <h2>Contract Length</h2>
          </div>

          <div className="dem-section-card dem-section-c1">
            <div className="dem-circle-container">
              <img src={Cbg} alt="" width={90} height={90} />
              <div className='dem-section-badge'>
                <span>1</span>
                <span className='dem-section-badge-span'>Month</span>
              </div>
            </div>
            <div className="dem-section-info">
              <h3>Trial</h3>
              <p>Test the fit before <br /> committing</p>
            </div>
          </div>

          <div className="dem-section-card dem-section-c2">
            <div className="dem-circle-container">
              <img src={Cbg} alt="" width={90} height={90} />
              <div className='dem-section-badge'>
                <span>3</span>
                <span className='dem-section-badge-span'>Months</span>
              </div>
            </div>
            <div className="dem-section-info">
              <h3>Sprint</h3>
              <p>Ship a major feature <br /> or MVP.</p>
            </div>
          </div>

          <div className="dem-section-card dem-section-c3">
            <div className="dem-circle-container">
              <img src={Cbg} alt="" width={90} height={90} />
              <div className='dem-section-badge'>
                <span>6</span>
                <span className='dem-section-badge-span'>Months</span>
              </div>
            </div>
            <div className="dem-section-info">
              <h3>Build</h3>
              <p>Full product <br /> development cycle.</p>
            </div>
          </div>

          <div className="dem-section-card dem-section-c4">
            <div className="dem-circle-container">
              <img src={Cbg} alt="" width={90} height={90} />
              <div className='dem-section-badge'>
                <span>12</span>
                <span className='dem-section-badge-span'>Months</span>
              </div>
            </div>
            <div className="dem-section-info">
              <h3>Scale</h3>
              <p>Long-term embedded <br /> partnership</p>
            </div>
          </div>

          <div className="dem-section-header dem-section-header-bottom">
              <img src={AE} alt="" width={80} height={80} />
              <h2>Available Engineers</h2>
          </div>

          <div className="dem-section-card dem-section-e1">
            <div className="dem-circle-container">
              <img src={Cbg} alt="" width={90} height={90} />
              <div className='dem-section-badge'>
                <img src={Backend} alt="" width={30} height={30} />
              </div>
            </div>
            <div className="dem-section-info">
              <h3>AI / ML Eng.</h3>
              <p>PyTorch, LLMs, MLOps, <br /> Python</p>
            </div>
          </div>

          <div className="dem-section-card dem-section-e2">
            <div className="dem-circle-container">
              <img src={Cbg} alt="" width={90} height={90} />
              <div className='dem-section-badge'>
                <img src={Stack} alt="" width={30} height={30} />
              </div>
            </div>
            <div className="dem-section-info">
              <h3>Full Stack Eng.</h3>
              <p>React, Node.js, <br /> PostgreSQL, AWS</p>
            </div>
          </div>

          <div className="dem-section-card dem-section-e3">
            <div className="dem-circle-container">
              <img src={Cbg} alt="" width={90} height={90} />
              <div className='dem-section-badge'>
                <img src={Flutter} alt="" width={30} height={30} />
              </div>
            </div>
            <div className="dem-section-info">
              <h3>Flutter Dev.</h3>
              <p>Flutter, Dart, Firebase, <br /> Riverpod</p>
            </div>
          </div>

          <div className="dem-section-card dem-section-e4">
            <div className="dem-circle-container">
              <img src={Cbg} alt="" width={90} height={90} />
              <div className='dem-section-badge'>
                <img src={Backend} alt="" width={30} height={30} />
              </div>
            </div>
            <div className="dem-section-info">
              <h3>Backend Eng.</h3>
              <p>Python, Go, <br /> Microservices, Docker</p>
            </div>
          </div>

          <div className="dem-section-card dem-section-e5">
            <div className="dem-circle-container">
              <img src={Cbg} alt="" width={90} height={90} />
              <div className='dem-section-badge'>
                <img src={UIUX} alt="" width={30} height={30} />
              </div>
            </div>
            <div className="dem-section-info">
              <h3>Frontend Eng.</h3>
              <p>React, TypeScript, <br /> Next.js, TailwindCSS</p>
            </div>
          </div>

          <div className="dem-section-card dem-section-e6">
            <div className="dem-circle-container">
              <img src={Cbg} alt="" width={90} height={90} />
              <div className='dem-section-badge'>
                <img src={DevOps} alt="" width={30} height={30} />
              </div>
            </div>
            <div className="dem-section-info">
              <h3>DevOps Eng.</h3>
              <p>AWS, Kubernetes, <br /> CI/CD, Terraform</p>
            </div>
          </div>

      </div>

      {/* ── Our Process ── */}
      <h3 className="dem-process-title">Our Process</h3>
      <div className="dem-process-section">
        <img src={ProcessBg} alt="" className="dem-process-bg" aria-hidden="true" />

        <div className="dem-process-trackk">
          {ourProcess.map((step, index) => (
            <React.Fragment key={step.step}>

              <div className={`dem-proc-card ${index % 2 === 0 ? 'em-proc-card--top' : 'em-proc-card--bottom'}`}>
                {/* Icon + number badge */}
                <div className="dem-proc-icon-row">
                  <div className="">
                    <img src={step.icon} alt={step.title} className="dem-proc-icon" />
                  </div>
                  <span className="dem-proc-num d-none d-lg-flex">{step.step}</span>
                </div>
                <h4 className="dem-proc-label">{step.title}</h4>
                <p className="dem-proc-desc">{step.description}</p>
              </div>

              {index < ourProcess.length - 1 && (
                <div className={`dem-proc-arrow-wrap ${index % 2 === 0 ? 'arrow-topp' : 'arrow-bottomm'}`}>
                  <img
                    src={index % 2 === 0 ? ArrowUp : ArrowDown}
                    alt=""
                    className="em-proc-arrow"
                    aria-hidden="true"
                  />
                </div>
              )}

            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-center mx-auto mt-4 gap-3">
        <Link to="https://calendly.com/arslan-medtronix/30min" className='browse-service-btn'>Schedule Meeting</Link>
        <Link to="/book-demo" className='browse-free-call'>Book a Demo</Link>
      </div>

    </div>
  )
}

export default DedicatedModal