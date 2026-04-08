import React from 'react';
import './projectsDetail.css';

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
    image: IhsanAI,
    challenge: 'RetailCore was losing 22% of potential revenue due to generic product pages with no personalization. Their in-house team had no ML expertise.',
    solution: 'Built a custom ML recommendation engine using collaborative filtering + NLP. Integrated with their existing e-commerce stack via REST API in under 3 weeks.',
    result: '38% increase in average order value, 2.1x click-through rate on recommended products, and $1.2M additional ARR in Q1 alone.',
    stats: [
      { sign: "+", value: '38%', label: 'Average Order Value' },
      { sign: "$", value: '1.2M', label: 'Additional ARR' },
      { sign: "3", value: ' wks', label: 'Integration Time' },
    ],
  },
  {
    tag: 'Web & Mobile App',
    title: 'Chesteei',
    subtitle: 'Productivity & Social Media',
    tagLabel: 'Chesteei',
    image: Chesteel,
    challenge: 'Teams were juggling 4–5 separate tools for task management, scheduling, and social media, leading to missed deadlines and fragmented workflows.',
    solution: 'Designed and built an all-in-one platform that unifies task boards, calendar scheduling, and social media post planning with a clean, intuitive UI.',
    result: '60% reduction in tool-switching overhead, 3x faster post scheduling, and a 45% improvement in on-time task delivery across pilot teams.',
    stats: [
      { value: '60%', label: 'Less Tool Switching' },
      { value: '3x', label: 'Faster Scheduling' },
      { value: '45%', label: 'On-Time Delivery Boost' },
    ],
  },
  {
    tag: 'Web App',
    title: 'AI Questions Generation Tool',
    subtitle: 'AI-Powered Education',
    tagLabel: 'GenTool AI',
    image: GenerationTool,
    challenge: 'Educators spent 6–8 hours per week manually writing quiz questions, often with inconsistent difficulty levels and poor curriculum alignment.',
    solution: 'Built an NLP-powered question generation engine that analyzes any text input and produces MCQs, short-answer, and true/false questions with difficulty tagging.',
    result: 'Reduced question creation time by 80%, with 92% instructor satisfaction rate and adoption across 500+ educational institutions in the first quarter.',
    stats: [
      { value: '80%', label: 'Time Saved' },
      { value: '92%', label: 'Satisfaction Rate' },
      { value: '500+', label: 'Institutions Onboarded' },
    ],
  },
  {
    tag: 'Web App',
    title: 'Hotel Management Software',
    subtitle: 'Hospitality Tech',
    tagLabel: 'HotelMS',
    image: HotelManagement,
    challenge: 'A mid-sized hotel chain was managing reservations across 3 disconnected systems, causing double bookings, billing errors, and slow check-ins.',
    solution: 'Developed a unified hotel management platform covering reservations, check-ins, billing, housekeeping status, and staff coordination in a single dashboard.',
    result: 'Zero double-bookings post-launch, 35% faster check-in process, and a 28% reduction in billing disputes within the first two months.',
    stats: [
      { value: '0', label: 'Double Bookings' },
      { value: '35%', label: 'Faster Check-in' },
      { value: '28%', label: 'Fewer Billing Disputes' },
    ],
  },
  {
    tag: 'Mobile App',
    title: 'Fitness Products E-Commerce',
    subtitle: 'Health & Retail',
    tagLabel: 'FitShop',
    image: Fitness,
    challenge: 'A fitness brand had a poor mobile shopping experience — slow load times, high cart abandonment (72%), and no personalized product recommendations.',
    solution: 'Built a performant React Native e-commerce app with optimized image loading, smart filters, a personalized recommendation engine, and a streamlined checkout.',
    result: 'Cart abandonment dropped to 31%, average session time increased by 2.4x, and monthly revenue grew 55% within the first 60 days of launch.',
    stats: [
      { value: '31%', label: 'Cart Abandonment' },
      { value: '2.4x', label: 'Avg Session Time' },
      { value: '+55%', label: 'Revenue Growth' },
    ],
  },
  {
    tag: 'Mobile App',
    title: 'Blablab',
    subtitle: 'Social Engagement Platform',
    tagLabel: 'Blablab',
    image: Blablab,
    challenge: 'Content creators struggled to keep audiences engaged between posts. Existing tools lacked real-time interaction features and had high latency in data calls.',
    solution: 'Built a mobile-first engagement app with live polls, reaction streams, interactive Q&As, and an optimized WebSocket architecture for real-time data delivery.',
    result: 'Average audience engagement per session rose 3x, data call latency dropped by 70%, and the app reached 50K active users within 45 days of launch.',
    stats: [
      { value: '3x', label: 'Engagement Per Session' },
      { value: '70%', label: 'Lower Latency' },
      { value: '50K', label: 'Users in 45 Days' },
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

                <img src={Screen} alt="screen" className="pdm-screen-icon" />
            </div>

            <div className="pdm-thumbnails">
                <img src={project.image} alt="" />
                <img src={project.image} alt="" />
                <img src={project.image} alt="" />
            </div>
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
             <Link to='https://furniture-frontend.ai3dscanning.com/' target='_blank' className='view-project-section-link'>www.furniture4you.com</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectsDetail;
export { PROJECT_DETAILS };