import React from 'react'
import { arrowAssets, ourProcess } from './dedicatedData'
import './dedicated.css'

const DedicatedModal = ({ isOpen, onClose }) => {
  const { ArrowBack, Dedicated, elipse, ProcessBg, ArrowUp, ArrowDown, ContractLength, rec, Circle } = arrowAssets

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
          AI &amp;
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
      {/* <div className="dem-section-chart-wrapper">

          <svg className="dem-section-lines">
            <path d="M 500 150 L 500 185" />
            <path d="M 185 185 L 815 185" />
            <path d="M 185 185 L 185 215" />
            <path d="M 395 185 L 395 275" />
            <path d="M 605 185 L 605 215" />
            <path d="M 815 185 L 815 280" />

            <path d="M 185 345 L 185 425 L 815 425 L 815 392" />
            <path d="M 395 390 L 395 425" />
            <path d="M 605 345 L 605 425" />
            <path d="M 500 425 L 500 465" />

            <path d="M 500 515 L 500 555" />
            <path d="M 185 555 L 815 555" />
            <path d="M 185 555 L 185 585" />
            <path d="M 395 555 L 395 665" />
            <path d="M 605 555 L 605 585" />
            <path d="M 815 555 L 815 665" />
          </svg>
          
          <div className="dem-section-header dem-section-header-top">
                <img src={ContractLength} alt="" width={80} height={80} />
                <h2>Contract Length</h2>
          </div>

          <div className="dem-section-card dem-section-c1">
            <div className="circle-container">
              <img src={Circle} alt="circle-bg" />
              <span>1 <b>Month</b></span>
            </div>
            <img src={rec} alt="" />
            <div className="dem-section-info">
                <h3>Trial</h3>
                <p>Test the fit before <br /> committing</p>
            </div>
          </div>

          <div className="dem-section-card dem-section-c2">
              <div className="dem-section-badge"><span>3</span>Months</div>
              <div className="dem-section-info">
                  <h3>Sprint</h3>
                  <p>Ship a major feature <br /> or MVP</p>
              </div>
          </div>

          <div className="dem-section-card dem-section-c3">
              <div className="dem-section-badge"><span>6</span>Months</div>
              <div className="dem-section-info">
                  <h3>Build</h3>
                  <p>Full-product <br /> development cycle</p>
              </div>
          </div>

          <div className="dem-section-card dem-section-c4">
              <div className="dem-section-badge"><span>12</span>Months</div>
              <div className="dem-section-info">
                  <h3>Scale</h3>
                  <p>Long-term embedded <br /> partnership</p>
              </div>
          </div>

          <div className="dem-section-header dem-section-header-bottom">
              <div className="dem-section-header-icon"><i className="fa-solid fa-users-gear"></i></div>
              <h2>Available Engineers</h2>
          </div>

          <div className="dem-section-card dem-section-rev dem-section-e1">
              <div className="dem-section-badge"><i className="fa-solid fa-brain eng-icon"></i></div>
              <div className="dem-section-info">
                  <h3>AI / ML Eng.</h3>
                  <p>PyTorch, LLMs, NLP, Data</p>
              </div>
          </div>

          <div className="dem-section-card dem-section-e2">
              <div className="dem-section-badge"><i className="fa-solid fa-mobile-screen-button eng-icon"></i></div>
              <div className="dem-section-info">
                  <h3>Flutter Dev.</h3>
                  <p>Flutter, Dart, Firebase, iOS/Android</p>
              </div>
          </div>

          <div className="dem-section-card dem-section-rev dem-section-e3">
              <div className="dem-section-badge"><i className="fa-solid fa-server eng-icon"></i></div>
              <div className="dem-section-info">
                  <h3>Backend Eng.</h3>
                  <p>Python, Go, Microservices, Docker</p>
              </div>
          </div>

          <div className="dem-section-card dem-section-e4">
              <div className="dem-section-badge"><i className="fa-solid fa-cloud-arrow-up eng-icon"></i></div>
              <div className="dem-section-info">
                  <h3>DevOps Eng.</h3>
                  <p>AWS, Kubernetes, CI/CD, Terraform</p>
              </div>
          </div>

      </div> */}

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
                  <span className="dem-proc-num">{step.step}</span>
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
        <button className='browse-service-btn'>Browse Services</button>
        <button className='browse-free-call'>Book a Free Call</button>
      </div>

    </div>
  )
}

export default DedicatedModal