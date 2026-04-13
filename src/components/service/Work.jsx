import React, { useState } from 'react';
import Bulb from '../../assets/icon/serviceBulb.svg';
import User from '../../assets/icon/serviceUser.svg';
import serviceVector from '../../assets/icon/serviceVector.svg'
import UserBG from '../../assets/icon/userMask.svg';
import BulbBG from '../../assets/icon/bulbMask.svg';
import OurServicesModal from '../../Popup/OurServicesModal';
import DedicatedModal from '../../Popup/DedicatedEngineers/DedicatedModal';
import elipse from '../../pages/images/heading_ellipse.png';


const MODELS = [
  {
    id: 'project',
    icon: Bulb,
    bgIcon: BulbBG,
    title: 'Project to Project',
    desc: 'Fixed-scope projects with clear deliverables and timelines. Perfect for businesses with defined requirements and specific goals.',
    features: [
      'Clear project scope and timeline',
      'Dedicated project manager',
      'Fixed pricing with no surprises',
      'Quality assurance included',
    ],
    btnLabel: 'View Details',
    btnVariant: 'outline',
  },
  {
    id: 'dedicated',
    icon: User,
    bgIcon: UserBG,
    title: 'Dedicated Engineers',
    desc: 'Hire skilled engineers on monthly or annual basis. Scale your team instantly with our vetted professionals who integrate directly into your workflow.',
    features: [
      'Flexible monthly or annual contracts',
      'Easy scaling up or down',
      'Pre-vetted expert engineers',
      'Direct team integration',
    ],
    btnLabel: 'Select & Continue',
    btnVariant: 'filled',
  },
];

const Work = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDedicatedModal, setShowDedicatedModal] = useState(false);

  return (
    <section className="wms-section containers">

    <div className="wms-heading-wrap">
      <h2 className="wms-title">
        How Would You{' '}
        <span className="wms-arch-wrap">
          <img src={elipse} alt="elipse" className="wms-arch"  />
          Like
        </span>
        {' '}to Work With Us?
      </h2>
      <p className="wms-subtitle">Select the model that best fits your company's needs.</p>
    </div>

    <div className="wms-cards">
      {MODELS.map((model) => (
        <div className="wms-card" key={model.id}>

          {/* scattered decorations */}
          <span className="wms-deco wms-deco-plus wms-deco-1">✦</span>
          <span className="wms-deco wms-deco-dot  wms-deco-2" />
          <span className="wms-deco wms-deco-plus wms-deco-3">✦</span>
          <span className="wms-deco wms-deco-dot  wms-deco-4" />

          {/* ghost watermark */}
          <div className="wms-card-bg-icon">
            <img src={model.bgIcon} alt="" height={140} />
          </div>

          {/* icon */}
          <div className="wms-card-icon">
            <img src={model.icon} alt={model.title} width="28" height="28"/>
          </div>

          {/* title */}
          <h3 className="wms-card-title">{model.title}</h3>

          {/* description */}
          <p className="wms-card-desc">{model.desc}</p>

          {/* divider */}
          <div className="wms-divider">
            <span className="wms-divider-line left" />
            <span className="wms-divider-label">What we Offer</span>
            <span className="wms-divider-line right" />
          </div>

          {/* features */}
          <ul className="wms-features">
            {model.features.map((f, i) => (
              <li className="wms-feature-item" key={i}>
                <img src={serviceVector} alt="" width="18" height="18" style={{ flexShrink: 0 }} />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* button */}
          <button className="wms-btn"
          onClick={() => {
            if (model.id === 'project') setShowModal(true)
            if (model.id === 'dedicated') setShowDedicatedModal(true)
          }}>
            {model.btnLabel}
          </button>
        </div>
      ))}
    </div>

    <OurServicesModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      defaultModel="Project to Project"
    />
    <DedicatedModal
      isOpen={showDedicatedModal}
      onClose={() => setShowDedicatedModal(false)}
    />

  </section>
  )
};

export default Work;