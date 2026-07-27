import React from 'react';
import serviceCall     from '../../assets/icon/serviceCall.svg';
import serviceRead     from '../../assets/icon/serviceRead.svg';
import servicePlane    from '../../assets/icon/servicePlane.svg';
import serviceCheck    from '../../assets/icon/serviceCheck.svg';
import serviceDelivery from '../../assets/icon/serviceDelivery.svg';
import workTogether from '../../assets/images/WorkTogether.svg';
import elipse from '../../pages/images/heading_ellipse.png';

const STEPS = [
  {
    icon: serviceCall,
    title: 'Discovery Call',
    desc: 'We understand your requirements, timeline, and goals in a free 30-minute consultation.',
  },
  {
    icon: serviceRead,
    title: 'Proposal & Matching',
    desc: 'We craft a detailed proposal and match you with the right engineers or project team.',
  },
  {
    icon: servicePlane,
    title: 'Onboarding',
    desc: 'Your team is set up in your tools within 48 hours ready to start sprinting.',
  },
  {
    icon: serviceCheck,
    title: 'Delivery & Review',
    desc: 'Regular check-ins, demos, and milestone reviews keep everything on track.',
  },
  {
    icon: serviceDelivery,
    title: 'Maintenance',
    desc: 'We keep your tools optimized, updated, and running smoothly as your team grows.',
  },
];

const WorkTogether = () => (
  <section
    className="hwt-section"
    style={{
      backgroundImage: `url(${workTogether})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
    }}
  >
    <div className="hwt-heading-wrap">
      <h2 className="hwt-title">
        How We{' '}
        <span className="hwt-arch-wrap">
          <img src={elipse} alt="elipse" className="hwt-arch" />
          Work
        </span>
        {' '}Together
      </h2>
    </div>

    <div className="hwt-timeline containers">

      {/* ── DESKTOP: two-row horizontal layout ── */}
      <div className="hwt-desktop-layout">
        <div className="hwt-icons-row">
          {STEPS.map((step, i) => (
            <React.Fragment key={i}>
              <div className="hwt-icon-cell">
                <img src={step.icon} alt={step.title} className="hwt-icon" />
              </div>
              {i < STEPS.length - 1 && <div className="hwt-connector" />}
            </React.Fragment>
          ))}
        </div>
        <div className="hwt-text-row">
          {STEPS.map((step, i) => (
            <div className="hwt-text-cell" key={i}>
              <h4 className="hwt-step-title">{step.title}</h4>
              <p className="hwt-step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── MOBILE: vertical timeline layout ── */}
      <div className="hwt-mobile-layout">
        {STEPS.map((step, i) => (
          <div className="hwt-mobile-step" key={i}>
            <div className="hwt-mobile-left">
              <div className="">
                <img src={step.icon} alt={step.title} className="hwt-mobile-icon" />
              </div>
              {i < STEPS.length - 1 && <div className="hwt-mobile-vline" />}
            </div>
            {/* Right: step label + title + desc */}
            <div className="hwt-mobile-content">
              <h4 className="hwt-mobile-step-title">{step.title}</h4>
              <p className="hwt-mobile-step-desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>
);

export default WorkTogether;