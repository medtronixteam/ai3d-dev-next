import React from 'react';
import './projectsDetail.css';
import Ihsan from '../assets/service/Ihsan.svg'
import IhsanAI        from '../assets/icon/ihsanAI.svg';
import Chesteel        from '../assets/icon/chesteel.svg';
import GenerationTool  from '../assets/icon/GenerationTool.svg';
import Fitness         from '../assets/icon/fitness.svg';
import HotelManagement from '../assets/icon/HotelManagement.svg';
import Blablab         from '../assets/icon/Blablab.svg';
import Challenges from '../assets/service/challenges.svg'
import result from '../assets/service/result.svg'
import solutions from '../assets/service/solutions.svg'
import AIDevelopment from '../assets/service/AIDevelopment.svg';
import Diagonal from '../assets/service/Diagonal.svg'
import Screen from '../assets/service/Screen.svg'
import { Link } from 'react-router-dom';

/* ─── project detail data ─────────────────────────────────── */
const PROJECT_DETAILS = [
  {
    tag: 'Web App',
    title: 'Ihsan AI',
    subtitle: 'AI Development & Solutions',
    tagLabel: 'Ihsan AI',
    image: Ihsan,
    url: 'https://ihsanai.com', 
    challenge: 'Businesses struggled to manage customer communication across multiple platforms like WhatsApp, SMS, and social media separately. This caused slow responses, inconsistent support, and missed sales opportunities.',
    solution: 'Developed Ihsan CRM as a unified AI-powered platform integrating WhatsApp, SMS, Facebook, Instagram, and Web AI. Enabled personalized bots and automation for sales and customer support across all channels.',
    result: 'Improved customer engagement through fast and consistent multi-channel communication. Increased sales efficiency and enhanced overall customer experience with automated support.',
    stats: [
      { sign: "+", value: '60%', label: 'Average Order Value' },
      { sign: "$", value: '40k', label: 'Additional ARR' },
      { sign: "2", value: ' wks', label: 'Integration Time' },
    ],
  },
  {
    tag: 'Web & Mobile App',
    title: 'Chesteei',
    subtitle: 'Productivity & Social Media',
    tagLabel: 'Chesteei',
    url: 'https://chesteei.com',  
    image: Chesteel,
    challenge: 'Managing organizational tasks, HR operations, and social media scheduling separately often caused delays and inefficiencies. Teams faced difficulty in coordination, tracking performance, and maintaining consistent social media activity.',
    solution: 'Developed Cheestie as an all-in-one web application to manage tasks, HR operations, and social media scheduling. Provided a centralized system with an intuitive interface for better planning and coordination.',
    result: 'Improved team productivity and streamlined daily operations across departments. Enhanced efficiency in task management and increased consistency in social media engagement.',
    stats: [
      { sign: "+", value: '45%', label: 'Average Order Value' },
      { sign: "$", value: '50k', label: 'Additional ARR' },
      { sign: "3", value: ' wks', label: 'Integration Time' },
    ],
  },
  {
    tag: 'Web App',
    title: 'AI Questions Generation Tool',
    subtitle: 'AI-Powered Education',
    tagLabel: 'GenTool AI',
    image: GenerationTool,
    url: 'https://gentool.ai',
    challenge: 'Creating high-quality, context-specific questions manually was time-consuming and inconsistent. Educators and trainers faced difficulty generating adaptive questions for different learning needs.',
    solution: 'Developed an AI-powered tool that automatically generates context-aware and precise questions. Enabled users to input content and get tailored questions for education, training, and research.',
    result: 'Reduced time and effort required for question creation significantly. Improved quality, relevance, and consistency of generated questions across different use cases.',
    stats: [
      { sign: "+", value: '78%', label: 'Average Order Value' },
      { sign: "$", value: '70k', label: 'Additional ARR' },
      { sign: "3", value: ' wks', label: 'Integration Time' },
    ],
  },
  {
    tag: 'Web App',
    title: 'Hotel Management Software',
    subtitle: 'Hospitality Tech',
    tagLabel: 'HotelMS',
    image: HotelManagement,
    url: 'https://hotel/management.com',
    challenge: 'Manual handling of reservations, check-ins, and billing led to errors and delays. Lack of proper staff coordination created communication gaps and inefficiencies.',
    solution: 'Developed a system to automate reservations, check-ins, and billing processes. Integrated tools to improve staff communication and task management.',
    result: 'Improved operational efficiency and reduced manual errors. Enhanced guest experience with faster and smoother services.',
    stats: [
      { sign: "+", value: '60%', label: 'Average Order Value' },
      { sign: "$", value: '60k', label: 'Additional ARR' },
      { sign: "2", value: ' wks', label: 'Integration Time' },
    ],
  },
  {
    tag: 'Mobile App',
    title: 'Fitness Products E-Commerce',
    subtitle: 'Health & Retail',
    tagLabel: 'FitShop',
    image: Fitness,
    url: 'https://fitshop.com',
    challenge: 'Customers faced difficulty in finding and purchasing fitness products from scattered and unreliable platforms. Manual order tracking and insecure payment systems reduced trust and convenience.',
    solution: 'Developed a fitness ecommerce web app with a centralized product catalog and smooth checkout system. Integrated secure payment methods and real-time order tracking for better user experience.',
    result: 'Improved shopping convenience with a fast and user-friendly platform. Increased customer trust and satisfaction through secure payments and transparent order management.',
    stats: [
      { sign: "+", value: '38%', label: 'Average Order Value' },
      { sign: "$", value: '40k', label: 'Additional ARR' },
      { sign: "3", value: ' wks', label: 'Integration Time' },
    ],
  },
  {
    tag: 'Mobile App',
    title: 'Blablab',
    subtitle: 'Social Engagement Platform',
    tagLabel: 'Blablab',
    image: Blablab,
    url: 'https://blablab.com',
    challenge: 'Traditional platforms lacked real-time interaction and meaningful user engagement. It was difficult to understand audience behavior without proper data insights.',
    solution: 'Developed BlabLab to provide interactive content and data-driven communication tools. Added analytics and engagement features to improve audience interaction.',
    result: 'Improved user engagement through interactive and personalized experiences. Helped businesses build stronger and more meaningful connections with their audience.',
    stats: [
      { sign: "+", value: '48%', label: 'Average Order Value' },
      { sign: "$", value: '50k', label: 'Additional ARR' },
      { sign: "3", value: ' wks', label: 'Integration Time' },
    ],
  },
];

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const ProjectsDetail = ({ projectIndex, onClose }) => {
  const project = PROJECT_DETAILS[projectIndex];
  if (!project) return null;

  return (
    <div className="pdm-overlay" onClick={onClose}>
      <div className="pdm-modal" onClick={e => e.stopPropagation()}>

        {/* close button */}
        <button className="pdm-close" onClick={onClose}>
          <CloseIcon />
        </button>

        {/* left  */}
        <div className="pdm-left">
            <div className="pdm-img-wrap">
                <img src={project.image} alt={project.title} className="pdm-img" />

                {/* <img src={Screen} alt="screen" className="pdm-screen-icon" /> */}
            </div>

            {/* <div className="pdm-thumbnails">
                <img src={project.image} alt="" />
                <img src={project.image} alt="" />
                <img src={project.image} alt="" />
            </div> */}
        </div>

        {/* right */}
        <div className="pdm-right">

          {/* header */}
          <div className="osm-service-header">
            <div className="osm-service-icon-wrap">
                <img src={AIDevelopment} alt={AIDevelopment} className="osm-service-icon" />
            </div>
            <div className="pdm-header">
                <p className="pdm-subtitle">{project.subtitle}</p>
                <h2 className="pdm-title">{project.title}</h2>
            </div>
          </div>

          <div className="pdm-sections">

            <div className="pdm-section">
              <div className="pdm-section-label">
                <img src={Challenges} alt="challenge" width={18} height={18} />
                <span>Challenge</span>
              </div>
              <p className="pdm-section-text">{project.challenge}</p>
            </div>

            <div className="pdm-section">
              <div className="pdm-section-label">
                <img src={solutions} alt="challenge" width={18} height={18} />
                <span>Solution</span>
              </div>
              <p className="pdm-section-text">{project.solution}</p>
            </div>

            <div className="pdm-section">
              <div className="pdm-section-label">
                <img src={result} alt="challenge" width={18} height={18} />
                <span>Result</span>
              </div>
              <p className="pdm-section-text">{project.result}</p>
            </div>

          </div>

          {/* stats */}
          <div className="pdm-stats">
            {project.stats.map((s, i) => (
              <div className="pdm-stat-card" key={i}>
                <span className="pdm-stat-value"><span className='pdm-stat-sign'>{s.sign}</span>{s.value}</span>
                <span className="pdm-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="view-project-section">
            <span>View Project at </span>
            <span className='arrow-diagonal-move'><img src={Diagonal} alt="diagonal" width={12} height={12} /></span>
            <Link to={project.url} target='_blank' className='view-project-section-link'>
              {project.url}
            </Link>
            </div>

        </div>

      </div>
    </div>
  );
};

export default ProjectsDetail;
export { PROJECT_DETAILS };