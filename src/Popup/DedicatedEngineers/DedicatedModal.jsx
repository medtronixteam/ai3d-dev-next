import React from 'react'
import { arrowAssets, ourProcess } from './dedicatedData'
import './dedicated.css'

const DedicatedModal = ({ isOpen, onClose }) => {
  const { ArrowBack, Dedicated, elipse, ProcessBg, ArrowUp, ArrowDown } = arrowAssets

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

      {/* ── Our Process ── */}
      <h3 className="dem-process-title">Our Process</h3>
      <div className="dem-process-section">
        <img src={ProcessBg} alt="" className="dem-process-bg" aria-hidden="true" />

        <div className="dem-process-track">
          {ourProcess.map((step, index) => (
            <React.Fragment key={step.step}>

              <div className="dem-proc-card">
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
        <button className='browse-service-btn'>Browse Services</button>
        <button className='browse-free-call'>Book a Free Call</button>
      </div>

    </div>
  )
}

export default DedicatedModal