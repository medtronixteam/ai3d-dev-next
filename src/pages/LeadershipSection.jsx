import './LeadershipSection.css';
import React, { useEffect, useState, useRef } from 'react';
import $ceo from '../assets/images/leardership/ceo.png';
import $joel from '../assets/images/leardership/joel.png';
import $osama from '../assets/images/leardership/osama.png';
import $hira from '../assets/images/leardership/hira.png';
import $shehroz from '../assets/images/leardership/Shehroz.png';
import $mudassar from '../assets/images/leardership/mudassar.png';
import $samia from '../assets/images/leardership/samia.png';
import $ozain from '../assets/images/ozain_fixed.png';
// import $ryan from '../assets/images/leardership/ryan.png';
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
    // {
    //   name: 'Rayan',
    //   lastName: 'Babur',
    //   img: $ryan,
    //   role: 'Ai Research lead',
    //   desc: [
    //     'Rayan leads the research initiatives at AI 3D Scanning, focusing on the latest advancements in computer vision and neural rendering. He explores new algorithms to enhance 3D reconstruction accuracy and processing speed.',
    //     'His work ensures the platform stays at the forefront of AI technology by integrating state-of-the-art research into production.',
    //   ],
    //   expertise: [
    //     'Neural Rendering',
    //     'Computer Vision',
    //     'Deep Learning',
    //     'Algorithm Optimization',
    //     'Research Strategy',
    //   ],
    //   linkedin: 'https://www.linkedin.com/in/rayan-babur/',
    //   philosophy: 'Innovation is the result of persistent curiosity and rigorous experimentation.',
    // },
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
      name: 'Ozain',
      lastName: 'Ahmad',
      img: $ozain,
      role: 'Junior Business Developer',
      desc: [
        'Ozain contributes to business growth and strategic partnerships at AI 3D Scanning Solutions.',
        'His focus is on strategic outreach, client communication, and supporting long-term business partnerships across industries.',
      ],
      expertise: [
        'Business Development',
        'Market Research',
        'Client Relations',
        'Lead Generation',
        'Strategic Partnerships',
      ],
      linkedin: 'https://www.linkedin.com/',
      philosophy: 'Driven by curiosity and dedicated to creating meaningful business connections and growth.',
    },
  ];

  useEffect(() => {
    let observer = null;

    const initSwiper = () => {
      if (!window.Swiper) return;

      if (swiperRef.current) {
        try {
          swiperRef.current.destroy(true, true);
        } catch (e) {
          // ignore
        }
      }

      swiperRef.current = new window.Swiper('.ai3d_ld_v3__swiper_container', {
        loop: true,
        spaceBetween: 30,
        speed: 700,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: '#nextBtn',
          prevEl: '#prevBtn',
        },
        breakpoints: {
          320: { slidesPerView: 1, slidesPerGroup: 1 },
          768: { slidesPerView: 2, slidesPerGroup: 1 },
          1024: { slidesPerView: 3, slidesPerGroup: 1 },
          1280: { slidesPerView: 4, slidesPerGroup: 1 },
        },
      });

      // Initially stop autoplay
      if (swiperRef.current.autoplay) {
        swiperRef.current.autoplay.stop();
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                if (swiperRef.current && swiperRef.current.autoplay) {
                  swiperRef.current.autoplay.start();
                }
              }, 1000);
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
    };

    if (!document.getElementById('swiper-bundle-css')) {
      const link = document.createElement('link');
      link.id = 'swiper-bundle-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
      document.head.appendChild(link);
    }

    if (window.Swiper) {
      initSwiper();
    } else {
      let script = document.getElementById('swiper-bundle-js');
      if (!script) {
        script = document.createElement('script');
        script.id = 'swiper-bundle-js';
        script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener('load', initSwiper);
    }

    return () => {
      if (observer && sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      if (swiperRef.current) {
        try {
          swiperRef.current.destroy(true, true);
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  return (
    <section className="ai3d_ld_v3_main_wrapper" ref={sectionRef}>
      <div className="ai3d_ld_v3__inner">

        <div className="swiper ai3d_ld_v3__swiper_container">
          <div className="swiper-wrapper">
            {[...teamMembers, ...teamMembers].map((member, index) => (
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

        <div className="cc mt-4 d-flex justify-content-center">
          <div className="icon-toggle-wrapper d-flex align-items-center justify-content-center">
            <button type="button" id="prevBtn" className="icon-toggle-label left-btn" aria-label="Previous team member">
              <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
            </button>
            <button type="button" id="nextBtn" className="icon-toggle-label right-btn right" aria-label="Next team member">
              <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>

      </div>

      {modalData && <CustomInfoModal modalData={modalData} onClose={() => setModalData(null)} />}

      

    </section>
  );
};

export default LeadershipSection;