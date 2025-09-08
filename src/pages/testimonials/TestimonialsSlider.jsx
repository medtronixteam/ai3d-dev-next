import React, { useState, useEffect, useRef } from 'react';
import './TestimonialsSlider.css';

const TestimonialsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeNavButton, setActiveNavButton] = useState('next');
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: 'Antonio Vegan',
      alpha: 'a',
      country: 'Spain',
      text: 'It\'s been a pleasure working and collaborating with Arslan and the AI 3D Scanning team! They are an amazingly innovative team that eagerly tackle even complex projects in any sector with ease.',
    },
    {
      id: 2,     
      name: 'Neil Kemp',
      alpha: 'n',
      country: 'Australia',
      text: 'Ahmad completed my task perfectly. He was on budget, lightning fast and communicated with me when I asked a question.',
    },
    {
      id: 3,
      name: 'Zheyu X',
      alpha: 'z',
      country: 'Australia',
      text: 'Ahmad and his team are very hard workers producing for me excellent results. I can always run ideas past Ahmad to see if they can be done.',
    },
    {
      id: 4,
      name: 'Mike Torello',
      alpha: 'm',
      country: 'USA',
      text: 'The AI 3D scanning technology has revolutionized our workflow. The team\'s expertise and dedication to quality is unmatched.',
    },
    {
      id: 5,
      name: 'Rick Wright',
      alpha: 'r',
      country: 'UK',
      text: 'Exceptional service and cutting-edge technology. AI3D has transformed how we approach 3D modeling and scanning projects.',
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [testimonials.length]);

  // Pause auto-slide on hover
  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);
  };

  const goToPrevious = () => {
    setActiveNavButton('prev');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    
    // Reset auto-slide timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);
  };

  const goToNext = () => {
    setActiveNavButton('next');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    
    // Reset auto-slide timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);
  };

  const getVisibleTestimonials = () => {
    const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    const nextIndex = (currentIndex + 1) % testimonials.length;
    
    return [
      testimonials[prevIndex],
      testimonials[currentIndex],
      testimonials[nextIndex]
    ];
  };

  return (
    <div className="testimonials-section">
      <div className="testimonials-header">
        <span className="testimonials-label">Testimonials</span>
        <h2 className="testimonials-title">What Our Customers Say</h2>
        <div className="testimonials-arc"></div>
      </div>
      
      <p className="testimonials-description">
        Discover what our valued clients have to say about their experience with AI3D Scanning Solutions.
      </p>

      <div 
        className="testimonials-slider-container"
        ref={sliderRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="testimonials-slider">
          {getVisibleTestimonials().map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={`testimonial-card ${index === 1 ? 'active' : ''}`}
            >
              <div className="testimonial-avatar">
                <div className="avatar-circle">
                  <span className="avatar-text">{testimonial.alpha.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="testimonial-content">
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <span className="author-title">{testimonial.country}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-navigation">
          <button
            type="button"
            className={`nav-button prev-button ${activeNavButton === 'prev' ? 'active' : ''}`}
            onClick={goToPrevious}
          >
            <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
          </button>
          
          <button
            type="button"
            className={`nav-button next-button ${activeNavButton === 'next' ? 'active' : ''}`}
            onClick={goToNext}
          >
            <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSlider;
