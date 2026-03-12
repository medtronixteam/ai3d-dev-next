import React, { useEffect, useState } from 'react';
import $ceo from '../assets/images/leadership/ceo.png';
import $joel from '../assets/images/leadership/joel.png';
import $osama from '../assets/images/leadership/osama.png';
import $hira from '../assets/images/leadership/hira.png';
import $shehroz from '../assets/images/leadership/Shehroz.png';
import $mudassar from '../assets/images/leadership/mudassar.png';
import $samia from '../assets/images/leadership/samia.png';
import $sajeel from '../assets/images/leadership/sajeel.png';
import CustomInfoModal from '../components/popup/CustomInfoModal';

const LeadershipSection = () => {
  const [modalData, setModalData] = useState(null);

  const team = [
    {
      name: 'Arslan',
      lastName: 'Ahmad',
      img: $ceo, 
      role: 'CEO & Product Lead',
      desc: [
        'Arslan drives the vision and product innovation at AI 3D Scanning Solutions, leading end-to-end product development from concept to deployment. With a focus on cutting-edge AI and LLM integration, he spearheads strategic partnerships oversees market positioning and ensures the platform delivers transformative value to global industries.',
        'His leadership blends deep technical understanding with a sharp business acumen to scale AI3D’s solutions across multiple sectors.',
      ],
      expertise: [
        'AI-driven product innovation',
        'Strategic partnerships',
        'Scalable platform architecture',
        'Team management',
        'Product management',
      ],
      linkedin: 'https://www.linkedin.com/in/arslan-ahmad-4b123a1b5/',
      philosophy:
        'Build tech that’s not just advanced but accessible, impactful, and scalable for the world',
    },
    {
      name: 'Dr. Joel',
      lastName: 'Hillier',
      img: $joel,
      role: 'Business Strategy Advisor & Board Member',
      desc: [
        'Dr. Hillier provides strategic guidance on business growth, market positioning, and AI development direction. With expertise spanning artificial intelligence, data-driven innovation, and commercial strategy.',
        'His role bridges technical capabilities with high-impact business outcomes, supporting scalable adoption across diverse industries',
      ],
      expertise: ['AI strategy & market alignment', 'Global business growth', 'Scaling strategies'],
      linkedin: 'https://www.linkedin.com/in/joelhillier/',
      philosophy: 'Innovation is about bridging the gap between today and tomorrow.',
    },
    {
      name: 'Hira',
      lastName: 'Aziz',
      img: $hira,
      role: 'Creative & 3dio Strategy Lead',
      desc: [
        'Hira is the creative force behind the visual identity. She transforms complex ideas into visually compelling stories.',
        'Oversees the planning, production, and delivery of high-quality multimedia content.',
      ],
      expertise: ['Creative Direction', 'Video Editing', 'Motion Graphics', 'Content Strategy'],
      linkedin: 'https://www.linkedin.com/in/hira-chaudhary-287186287/',
      philosophy: '"Great design doesn’t just capture attention it inspires connection."',
    },
    {
      name: 'Usama',
      lastName: 'Ahmad',
      img: $osama,
      role: 'HR & Finance Manager',
      desc: [
        'Usama plays a pivotal role in ensuring the company’s financial health and long-term stability.',
        'His meticulous approach to HR & financial management empowers AI3D to maintain operational efficiency.',
      ],
      expertise: [
        'Financial Planning',
        'Budget Development',
        'Risk Assessment',
        'Process Optimization',
      ],
      linkedin: 'https://www.linkedin.com/in/usama-khan-793960337/',
      philosophy: '"A strong financial foundation is the backbone of innovation."',
    },
    {
      name: 'Shehroz',
      lastName: 'Shabbir',
      img: $shehroz,
      role: 'Web Development Manager',
      desc: [
        'Shehroz is the technical backbone behind the company’s innovative platforms. Skilled in both front-end and back-end development.',
        'His work powers the AI-driven and 3D scanning technologies that define the company’s cutting-edge services.',
      ],
      expertise: [
        'Full Stack Web Development',
        'System Architecture',
        'Database Management',
        'UI/UX Implementation',
      ],
      linkedin: 'https://www.linkedin.com/in/m-shehroz-shabbir/',
      philosophy:
        '"Great technology isn’t just built — it’s crafted with precision, creativity, and purpose."',
    },
    {
      name: 'Mudassar',
      lastName: 'Farooq',
      img: $mudassar,
      role: ' Partnerships & Business Development Manager',
      desc: [
        'Mudassar focuses on identifying growth opportunities and building partnerships.',
        'Combines strategic business development with strategy and execution.',
      ],
      expertise: [
        'Business Growth Strategy',
        'Partnership Development',
        'Talent Acquisition',
        'Strategic Planning',
      ],
      linkedin: 'https://www.linkedin.com/in/m-mudassar-farooq/',
      philosophy:
        '"Success is built on strong relationships — both with clients and within the team."',
    },
    {
      name: 'Sajeel',
      lastName: 'Nisar',
      img: $sajeel,
      role: 'AI Engineering Manager',
      desc: [
        'Specializes in designing and implementing intelligent systems that power 3D scanning.',
        'Transforms complex datasets into actionable insights and automated solutions.',
      ],
      expertise: ['Artificial Intelligence', 'Computer Vision', 'Neural Networks', 'Data Modeling'],
      linkedin: 'https://www.linkedin.com/in/msajeel/',
      philosophy:
        '"The future belongs to intelligent systems — building AI that makes technology more human."',
    },
    {
      name: 'Samia',
      lastName: 'Rasheed',
      img: $samia,
      role: 'Social Media Manager & Associate HR',
      desc: [
        'Samia crafts engaging digital content and manages the company’s online presence.',
        'Her marketing insight helps bridge the gap between brand identity and internal culture.',
      ],
      expertise: [
        'Social Media Strategy',
        'Brand Awareness',
        'Internal Communication',
        'Content Creation',
      ],
      linkedin: 'https://www.linkedin.com/in/samiarasheed/',
      philosophy: '"A strong brand starts with inspired people."',
    },
  ];

  useEffect(() => {
    const initSwiper = () => {
      if (window.Swiper) {
        new window.Swiper('.ai3d_ld_v3__swiper_container', {
          loop: true,
          spaceBetween: 30,
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
      } else {
        // Fallback if script hasn't loaded yet
        setTimeout(initSwiper, 100);
      }
    };

    initSwiper();
  }, []);

  return (
    <section className="ai3d_ld_v3_main_wrapper">
      <div className="ai3d_ld_v3__inner">
        <div className="swiper ai3d_ld_v3__swiper_container">
          <div className="swiper-wrapper">
            {team.map((member, index) => (
              <div className="swiper-slide ai3d_ld_v3__slide" key={index}>
                <div className="ai3d_ld_v3__card">
                  <div className="ai3d_ld_v3__img_wrap">
                    <img src={member.img} alt={member.name} className="ai3d_ld_v3__img" />
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
            <button
              type="button"
              id="prevBtn"
              className="icon-toggle-label btn btn-outline-primary"
            >
              <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              id="nextBtn"
              className="icon-toggle-label btn btn-outline-primary right"
            >
              <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      {modalData && <CustomInfoModal modalData={modalData} onClose={() => setModalData(null)} />}

      <style>{`
        .ai3d_ld_v3_main_wrapper { padding:0px 0px 60px 0; background: transparent; font-family: 'Poppins', sans-serif; }
        .ai3d_ld_v3__inner { max-width: 1300px; margin: 0 auto; padding: 0 20px; }
        
        /* Force slides to be the same height */
        .ai3d_ld_v3__slide { height: auto !important; display: flex; }
        
        .ai3d_ld_v3__card { 
          width: 100%; 
          text-align: center; 
          transition: 0.3s; 
          padding: 10px; 
          display: flex; 
          flex-direction: column; 
          background: #fff; 
          border-radius: 12px;
        }

        .ai3d_ld_v3__img_wrap { width: 100%; height: 240px; overflow: hidden; border-radius: 10px; flex-shrink: 0; }
        .ai3d_ld_v3__img { width: 100%; height: 100%; object-fit: contain; }

        /* Content area grows to fill space, pushing button down */
        .ai3d_ld_v3__content { 
          flex-grow: 1; 
          display: flex; 
          flex-direction: column; 
          justify-content: space-between; 
          padding-top: 15px; 
        }

        .ai3d_ld_v3__name { font-size: 1.2rem; font-weight: 700; color: #333; margin-bottom: 5px; }
        .ai3d_ld_v3__highlight { color: #df3c9c; }
        
        /* Set min-height on role to keep text consistent */
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

        /* Line clamping for description + fixed height */
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
          height: 4.8em; /* Ensures 3 lines of space even if text is shorter */
        }

        .ai3d_ld_v3__more_btn { 
            background: none; border: none; color: #df3c9c; font-weight: 600; 
            font-size: 0.9rem; cursor: pointer; padding: 0; 
            display: inline-flex; align-items: center; justify-content: center;
            margin-top: auto; /* Always sticks to the bottom of the card */
            padding-bottom: 10px;
        }
      `}</style>
    </section>
  );
};

export default LeadershipSection;