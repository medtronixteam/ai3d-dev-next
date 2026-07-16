import React, { useState, useEffect } from 'react';
import bgImage from '../assets/images/bg.png';
import client1 from '../assets/images/client1.png';
import client2 from '../assets/images/client2.jpg';
import FrameWiseImg from '../assets/images/FrameWise-Logo.png';
import './testimonial.css';

const TestimonialSlider = () => {
  const [activeIndex, setActiveIndex] = useState(3);

  const testimonials = [
    {
      img: FrameWiseImg,
      name: 'Victoria Akyea',
      role: 'USA',
      top: '15%',
      left: '15.5%',
      size: '65px',
      text: 'It’s been a pleasure working and collaborating with Arslan and the AI 3D Scanning team! They are an amazingly innovative team that eagerly tackle even complex  projects in any sector with ease. We were amazed at the speed of execution they can deliver, and so appreciated their professionalism and expertise in helping us accomplish our vision. Truly honored to partner with a company that has such a bold and pioneering vision.',
    },
    {
      img: client1,
      name: 'Antonio Vegan',
      role: 'Spain',
      top: '58%',
      left: '28%',
      size: '80px',
      text: 'I HIGHLY recommend Medtronix for AI development services, especially working with Islaava and his team. Their CODE expertise and thorough DOCUMENTATION truly EXCEEDED my expectations, coupled with Islaava’s deep understanding and quick responsiveness. It was an AMAZING experience with great outcomes!',
    },
    {
      img: null,
      name: 'Ganeshkumar',
      role: 'Singapore',
      top: '10%',
      left: '39.2%',
      size: '60px',
      text: 'Really an awesome person to work with, fast replies , quality work and hardworking ',
    },
    {
      img: null,
      name: 'Shakesfuture',
      role: 'United States',
      top: '28%',
      left: '50.5%',
      size: '90px',
      text: '5 stars all around. great guy to work with. will work with again',
    },
    {
      img: null,
      name: 'Neil Kemp',
      role: 'Australia',
      top: '17%',
      left: '63.5%',
      size: '80px',
       text: 'Ahmad completed my task perfectly. He was on budget, lightning fast and communicated with me when I asked a question. When he finished the task he sent me a video of the program working and a walk through comprehensive video on how to install and run the new program. I could not be any happier with the service. Neil. Sydney, Australia.',
    },
    {
      img: null,
      name: 'Zheyu X',
      role: 'Australia',
      top: '58%',
      left: '74.3%',
      size: '65px',
      text: 'Ahmad and his team are very hard workers producing for me excellent results. I can always run ideas past Ahmad to see if they can be done. Most times they can be done. He is very proffessional and i will be using many many more times. Thank you for all the hard work. I am super impressed with what you have delivered.',
    },
    {
      img: client2,
      name: 'Edwin Koort',
      role: 'Australia',
      top: '20%',
      left: '84.5%',
      size: '75px',
      text: 'I hired this company to design my website, and I was completely satisfied. From the beginning, they showed a high level of professionalism, listened to my needs, and offered tailored solutions.The final design was modern, functional, and fully responsive. The process was transparent, with timely deliveries and great communication. Plus, the post-launch support has been outstanding.',
    },
  ];

  
  const getCountryColor = (role) => {
    const colors = {
      'USA': '#3b82f6', 
      'Singapore': '#ef4444',
      'United States': '#6366f1', 
      'Australia': '#10b981', 
      'Spain': '#f59e0b', 
    };
    return colors[role] || '#df3c9c';
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="testimonial-section">
      <div className="container">
        <div className="snake-container" style={{ backgroundImage: `url(${bgImage})` }}>
          {testimonials.map((item, index) => {
            const isActive = activeIndex === index;
            const hasImage = item.img !== null;

            return (
              <div
                key={index}
                className={`user-avatar ${isActive ? 'active' : ''}`}
                style={{
                  top: item.top,
                  left: item.left,
                  width: item.size,
                  height: item.size,
                  backgroundColor: !hasImage ? getCountryColor(item.role) : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: `calc(${item.size} / 2.5)`,
                  fontWeight: 'bold'
                }}
                onClick={() => setActiveIndex(index)}
              >
                {hasImage ? (
                  <img src={item.img} alt={item.name} />
                ) : (
                  <span>{getInitials(item.name)}</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="testimonial-content-wrapper">
          <button type="button" className="nav-btn" aria-label="Previous testimonial" onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}>❮</button>
          <div className="testimonial-text">
            <h4 style={{ color: '#df3c9c', marginBottom: '5px' }}>{testimonials[activeIndex].name}</h4>
            <p className="fade-in" key={activeIndex}>"{testimonials[activeIndex].text}"</p>
          </div>
          <button type="button" className="nav-btn" aria-label="Next testimonial" onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}>❯</button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;