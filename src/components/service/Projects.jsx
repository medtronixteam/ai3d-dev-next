import React, { useState } from 'react';
import IhsanAI        from '../../assets/icon/ihsanAI.svg';
import Chesteel        from '../../assets/icon/chesteel.svg';
import GenerationTool  from '../../assets/icon/GenerationTool.svg';
import Fitness         from '../../assets/icon/fitness.svg';
import HotelManagement from '../../assets/icon/HotelManagement.svg';
import Blablab         from '../../assets/icon/Blablab.svg';
import ProjectsDetail from '../../Popup/ProjectsDetail';
import elipse from '../../pages/images/heading_ellipse.png';

const PROJECTS = [
  {
    tag: 'Web App',
    title: 'Ihsan AI',
    desc: 'Meet The Future Of Digital AI. Platform which creates personalized bots, makes sales and automates customer care.',
    image: IhsanAI,
  },
  {
    tag: 'Web & Mobile App',
    title: 'Chesteei',
    desc: 'Chesteei is a social app for managing tasks, scheduling, and seamlessly planning social media posts to boost productivity and engagement.',
    image: Chesteel,
  },
  {
    tag: 'Web App',
    title: 'AI Questions Generation Tool',
    desc: 'Discover answers to common queries about artificial intelligence, its applications, and how it can transform industries.',
    image: GenerationTool,
  },
  {
    tag: 'Web App',
    title: 'Hotel Management Software',
    desc: 'Hotel management software optimizes reservations, check-ins, billing, and staff coordination for improved efficiency and customer service.',
    image: HotelManagement,
  },
  {
    tag: 'Mobile App',
    title: 'Fitness products E commerce',
    desc: 'The Fitness Product Ecommerce Web App allows users to browse, purchase, and manage fitness products online for a seamless shopping experience.',
    image: Fitness,
  },
  {
    tag: 'Mobile App',
    title: 'Blablab',
    desc: 'BlabLab is an app for engaging audiences with interactive content and efficient data calls, enhancing connectivity and user interaction.',
    image: Blablab,
  },
];

const Projects = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal  = (index) => setSelectedIndex(index);
  const closeModal = ()      => setSelectedIndex(null);

  return (
    <section className="pti-section">

      {/* heading */}
      <div className="pti-heading-wrap">
        <h2 className="pti-title">
          Projects That{' '}
          <span className="pti-arch-wrap">
            <img src={elipse} alt="elipse" className="pti-arch"  />
            Inspire
          </span>
        </h2>
        <p className="pti-subtitle">A glimpse into projects we've delivered across industries.</p>
      </div>

      <div className="pti-grid">
        {PROJECTS.map((p, i) => (
          <div
            className="pti-card"
            key={i}
            onClick={() => openModal(i)}
            style={{ cursor: 'pointer' }}
          >
            <span className="pti-deco pti-deco-1">✦</span>
            <span className="pti-deco pti-deco-2" />
            <span className="pti-deco pti-deco-3">✦</span>
            <span className="pti-deco pti-deco-4" />

            <span className="pti-tag">{p.tag}</span>

            <h3 className="pti-card-title">{p.title}</h3>

            <p className="pti-card-desc">{p.desc}</p>

            <div className="pti-img-wrap">
              <img src={p.image} alt={p.title} className="pti-img" />
            </div>
          </div>
        ))}
      </div>

      <div className="pti-footer">
        <a href="#" className="pti-view-all">
          View All Projects
          <span className="pti-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#de3996" strokeWidth="1.5"/>
              <path d="M8 10h5M11 8l2 2-2 2" stroke="#de3996" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </a>
      </div>

      {selectedIndex !== null && (
        <ProjectsDetail
          projectIndex={selectedIndex}
          onClose={closeModal}
        />
      )}

    </section>
  );
};

export default Projects;