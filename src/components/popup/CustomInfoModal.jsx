import React, { useEffect } from 'react'
import './CustomInfoModal.css'
import modalTextSlideImg from '../../pages/images/text-slide.png'
import modalBulletImg from '../../pages/images/bullet-point.png'
import modalQuoteImg from '../../pages/images/quation.png'
import { FaArrowLeft, FaLinkedin } from 'react-icons/fa'

const CustomInfoModal = ({ modalData, onClose }) => {
  useEffect(() => {
    if (modalData) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [modalData]);

  if (!modalData) return null;

  return (
    <div className="profile-detail-modal" id="extraLargeModal">
      <div className="custom-modal-dialog">
        <div className="parent-modal-content">
          <div>
            <button type="button" className="close-left" onClick={onClose}>
              <FaArrowLeft size={18} />
            </button>
          </div>
          <div className="custom-modal-content">
            <div className="custom-modal-body pt-md-3 px-lg-5">
              <div className="row g-4 mt-4">
                <div className="col-12 col-lg-4 text-center">
                  <div className="styled-img-container">
                    {/* <img src={modalQuoteImg} className="quote-img" alt="Quote Icon" /> */}
                    <img src={modalData.img || modalQuoteImg} className="profile-img" alt={modalData.name} />
                  </div>
                  {modalData.linkedin && (
                    <div className="mt-3">
                      <a
                        href={modalData.linkedin}
                        className="btn btn-linkedin w-100 d-inline-flex align-items-center justify-content-center gap-2"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ backgroundColor: '#0077b5', color: 'white', borderRadius: '25px', padding: '10px' }}
                      >
                        <FaLinkedin size={18} /> LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>

                <div className="col-12 col-lg-8 text-start">
                  <h2 className="text-title" style={{ color: '#1a202c', fontWeight: 'bold' }}>
                    {modalData.name} <span style={{ color: '#df3c9c' }}>{modalData.lastName}</span>
                  </h2>
                  <p className="text-para mb-0" style={{ fontSize: '1.1rem', color: '#718096' }}>{modalData.role}</p>
                  <div className="my-2">
                    <img src={modalTextSlideImg} alt="divider" />
                  </div>

                  <div className="mt-3">
                    {Array.isArray(modalData.desc) ? (
                      modalData.desc.map((line, idx) => (
                        <p key={idx} className="discription" style={{ lineHeight: '1.8', color: '#4a5568' }}>
                          {line}
                        </p>
                      ))
                    ) : (
                      <p className="discription">{modalData.desc}</p>
                    )}
                  </div>

                  {modalData.expertise && (
                    <>
                      <h5 className="mt-4 text-title" style={{ fontWeight: '700' }}>Key Expertise:</h5>
                      <ul className="custom-list" style={{ listStyle: 'none', padding: 0 }}>
                        {modalData.expertise.map((item, idx) => (
                          <li key={idx} className="mb-2 d-flex align-items-center gap-2">
                            <img src={modalBulletImg} alt="bullet" width="15" /> {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {modalData.philosophy && (
                    <>
                      <h5 className="mt-4 text-title" style={{ fontWeight: '700' }}>Professional Philosophy:</h5>
                      <p className="discription" style={{ fontStyle: 'italic', borderLeft: '4px solid #df3c9c', paddingLeft: '15px' }}>
                        "{modalData.philosophy}"
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomInfoModal;