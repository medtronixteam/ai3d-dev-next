import React, { useEffect, useState, useRef } from 'react';
import $ceo from '../assets/images/leardership/ceo.png';
import $joel from '../assets/images/leardership/joel.png';
import $osama from '../assets/images/leardership/osama.png';
import $hira from '../assets/images/leardership/hira.png';
import $shehroz from '../assets/images/leardership/Shehroz.png';
import $mudassar from '../assets/images/leardership/mudassar.png';
import $samia from '../assets/images/leardership/samia.png';
import $ryan from '../assets/images/leardership/ryan.png';
import $assam from '../assets/images/leardership/Assam.png';
import CustomInfoModal from '../components/popup/CustomInfoModal';
import HS from '../assets/service/HS.svg'
import La from '../assets/service/La.svg'

const LeadershipSection = () => {
  const [modalData, setModalData] = useState(null);
  const sectionRef = useRef(null);
  const swiperRef = useRef(null);

  const teamMembers = [
    {
      name: 'Arslan',
      lastName: 'Ahmad',
      img: $ceo,
      img2: HS,
      role: 'CEO & Product Lead',
      desc: [
        'Arslan drives the vision and product innovation at AI 3D Scanning Solutions, leading end-to-end product development from concept to deployment. With a focus on cutting-edge AI and LLM integration, he spearheads strategic partnerships oversees market positioning and ensures the platform delivers transformative value to global industries.',
        'His leadership blends deep technical understanding with a sharp business acumen to scale AI3D solutions across multiple sectors.',
      ],
      expertise: [
        'AI-driven product innovation',
        'Strategic partnerships',
        'Scalable platform architecture',
        'Team management',
        'Product management',
      ],
      linkedin: 'https://www.linkedin.com/in/arslan-ahmad-4b123a1b5/',
      philosophy: 'Build tech that is not just advanced but accessible, impactful, and scalable for the world',
    },
    {
      name: 'Dr Joel',
      lastName: 'Hillier',
      img: $joel,
      role: 'US Advisor & Partner',
      desc: [
        'Dr. Joel Hillier brings extensive expertise as a Strategic Advisor and Partner, guiding AI 3D Scanning Solutions in expanding its global reach, strategic vision, and innovation footprint.',
        'He works closely with leadership to foster international growth and commercial success.',
      ],
      expertise: [
        'Strategic Advisory',
        'Global Business Development',
        'Partnership Strategy',
        'Innovation Leadership',
      ],
      linkedin: 'https://www.linkedin.com/in/joelhillier',
      philosophy: 'Empowering technological innovation through strategic leadership and global collaboration.',
    },
    {
      name: 'Hira',
      lastName: 'Aziz',
      img: $hira,
      img2: La,
      role: 'Creative & 3dio Strategy Lead',
      desc: [
        'Hira is the creative force behind the visual identity. She transforms complex ideas into visually compelling stories.',
        'Oversees the planning, production, and delivery of high-quality multimedia content.',
      ],
      expertise: ['Creative Direction', 'Video Editing', 'Motion Graphics', 'Content Strategy'],
      linkedin: 'https://www.linkedin.com/in/hira-chaudhary-287186287/',
      philosophy: 'Great design does not just capture attention it inspires connection.',
    },
    {
      name: 'Usama',
      lastName: 'Ahmad',
      img: $osama,
      role: 'HR & Finance Manager',
      desc: [
        'Usama plays a pivotal role in ensuring the company financial health and long-term stability.',
        'His meticulous approach to HR & financial management empowers AI3D to maintain operational efficiency.',
      ],
      expertise: [
        'Financial Planning',
        'Budget Development',
        'Risk Assessment',
        'Process Optimization',
      ],
      linkedin: 'https://www.linkedin.com/in/usama-khan-793960337/',
      philosophy: 'A strong financial foundation is the backbone of innovation.',
    },
    {
      name: 'Shehroz',
      lastName: 'Shabbir',
      img: $shehroz,
      role: 'Web Team Manager',
      desc: [
        'Shehroz is the technical backbone behind the company innovative platforms. Skilled in both front-end and back-end development.',
        'His work powers the AI-driven and 3D scanning technologies that define the company cutting-edge services.',
      ],
      expertise: [
        'Full Stack Web Development',
        'System Architecture',
        'Database Management',
        'UI/UX Implementation',
      ],
      linkedin: 'https://www.linkedin.com/in/m-shehroz-shabbir/',
      philosophy: 'Great technology is not just built it is crafted with precision, creativity, and purpose.',
    },
    {
      name: 'Samia',
      lastName: 'Rasheed',
      img: $samia,
      role: 'Social Media Manager & Associate HR',
      desc: [
        'Samia crafts engaging digital content and manages the company online presence.',
        'Her marketing insight helps bridge the gap between brand identity and internal culture.',
      ],
      expertise: [
        'Social Media Strategy',
        'Brand Awareness',
        'Internal Communication',
        'Content Creation',
      ],
      linkedin: 'https://www.linkedin.com/in/samiarasheed/',
      philosophy: 'A strong brand starts with inspired people.',
    },
    {
      name: 'Rayan',
      lastName: 'Babur',
      img: $ryan,
      role: 'Ai Research lead',
      desc: [
        'Rayan leads the research initiatives at AI 3D Scanning, focusing on the latest advancements in computer vision and neural rendering. He explores new algorithms to enhance 3D reconstruction accuracy and processing speed.',
        'His work ensures the platform stays at the forefront of AI technology by integrating state-of-the-art research into production.',
      ],
      expertise: [
        'Neural Rendering',
        'Computer Vision',
        'Deep Learning',
        'Algorithm Optimization',
        'Research Strategy',
      ],
      linkedin: 'https://www.linkedin.com/in/rayan-babur/',
      philosophy: 'Innovation is the result of persistent curiosity and rigorous experimentation.',
    },
    {
      name: 'Assam',
      lastName: 'Memon',
      img: $assam,
      role: 'Growth Advisor',
      desc: [
        'Assam Memon serves as a Growth Advisor at AI 3D Scanning Solutions, where he focuses on driving strategic expansion and identifying new market opportunities.',
        'He brings a wealth of knowledge in business development and strategic planning to help scale AI3D’s solutions globally.',
      ],
      expertise: [
        'Strategic Growth',
        'Business Development',
        'Market Expansion',
        'Strategic Partnerships',
      ],
      linkedin: 'https://www.linkedin.com/in/assam-memon/',
      philosophy: 'Growth is not just about numbers; it is about creating sustainable value through strategic innovation.',
    },
  ];

  useEffect(() => {
    if (!document.getElementById('swiper-bundle-css')) {
      const link = document.createElement('link');
      link.id = 'swiper-bundle-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
      document.head.appendChild(link);
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Swiper) {
        swiperRef.current = new window.Swiper('.ai3d_ld_v3__swiper_container', {
          loop: true,
          spaceBetween: 30,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          navigation: {
            nextEl: '#nextBtn',
            prevEl: '#prevBtn',
          },
          breakpoints: {
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          },
        });

        // Initially stop autoplay
        swiperRef.current.autoplay.stop();

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // Wait 2 seconds after entering view before starting autoplay
                setTimeout(() => {
                  if (swiperRef.current && swiperRef.current.autoplay) {
                    swiperRef.current.autoplay.start();
                  }
                }, 2000);
              } else {
                if (swiperRef.current && swiperRef.current.autoplay) {
                  swiperRef.current.autoplay.stop();
                }
              }
            });
          },
          { threshold: 0.1 }
        );

        if (sectionRef.current) {
          observer.observe(sectionRef.current);
        }
      }
    };
  }, []);

  return (
    <section className="ai3d_ld_v3_main_wrapper" ref={sectionRef}>
      <div className="ai3d_ld_v3__inner">

        <div className="swiper ai3d_ld_v3__swiper_container">
          <div className="swiper-wrapper">
            {teamMembers.map((member, index) => (
              <div className="swiper-slide ai3d_ld_v3__slide" key={index}>
                <div className="ai3d_ld_v3__card">
                  <div className="ai3d_ld_v3__img_wrap">
                    <img src={member.img} alt={member.name} className="ai3d_ld_v3__img" />
                    {member.img2 && <img src={member.img2} alt={member.name} className="ai3d_ld_v3__badge" />}
                  </div>
                  <div className="ai3d_ld_v3__content">
                    <div className="ai3d_ld_v3__text_top">
                      <h3 className="ai3d_ld_v3__name">
                        {member.name} <span className="ai3d_ld_v3__highlight">{member.lastName}</span>
                      </h3>
                      <p className="ai3d_ld_v3__role">{member.role}</p>
                      <p className="ai3d_ld_v3__desc">{member.desc[0]}</p>
                    </div>
                    <button onClick={() => setModalData(member)} className="ai3d_ld_v3__more_btn">
                      Learn More <i className="fa fa-long-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cc mt-4">
          <div className="icon-toggle-wrapper d-flex justify-content-center ">
            <button type="button" id="prevBtn" className="icon-toggle-label btn btn-outline-primary" aria-label="Previous team member">
              <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
            </button>
            <button type="button" id="nextBtn" className="icon-toggle-label btn btn-outline-primary right" aria-label="Next team member">
              <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>

      </div>

      {modalData && <CustomInfoModal modalData={modalData} onClose={() => setModalData(null)} />}

      <style>{`
  .ai3d_ld_v3_main_wrapper {
    padding: 0 0 60px 0;
    background: transparent;
    font-family: 'Poppins', sans-serif;
  }

  .ai3d_ld_v3__inner {
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* Card (clean - no bg, no border, no shadow) */
  .ai3d_ld_v3__card {
    width: 100%;
    text-align: center;
    padding: 10px;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    background: transparent;
    transition: transform 0.35s ease, opacity 0.35s ease;
    animation: fadeUp 0.6s ease forwards;
    opacity: 0;
  }

  .ai3d_ld_v3__card:hover {
    transform: translateY(-4px);
  }

  /* Image */
  .ai3d_ld_v3__img_wrap {
    width: 100%;
    height: 240px;
    overflow: hidden;
    border-radius: 10px;
    flex-shrink: 0;
    position: relative;
  }

  .ai3d_ld_v3__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.4s ease;
  }

  .ai3d_ld_v3__badge {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .ai3d_ld_v3__card:hover .ai3d_ld_v3__img {
    transform: scale(1.05);
  }

  /* Content */
  .ai3d_ld_v3__content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .ai3d_ld_v3__name {
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 5px;
  }

  .ai3d_ld_v3__highlight {
    color: #df3c9c;
  }

  .ai3d_ld_v3__role {
    font-size: 0.85rem;
    color: #718096;
    margin-bottom: 12px;
    font-weight: 500;
    text-transform: uppercase;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ai3d_ld_v3__desc {
    font-size: 0.88rem;
    color: #4a5568;
    line-height: 1.6;
    margin-bottom: 15px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 4.8em;
  }

  .ai3d_ld_v3__more_btn {
    background: none;
    border: none;
    color: #df3c9c;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: auto;
    padding-bottom: 10px;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1024px) {
    .ai3d_ld_v3__img_wrap {
      height: 220px;
    }
  }

  @media (max-width: 768px) {
    .ai3d_ld_v3__img_wrap {
      height: 200px;
    }
    .ai3d_ld_v3__name {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 480px) {
    .ai3d_ld_v3__img_wrap {
      height: 180px;
    }
    .ai3d_ld_v3__desc {
      font-size: 0.85rem;
    }
  }
`}</style>

    </section>
  );
};

export default LeadershipSection;