import React, { useState, useEffect } from 'react'
import './CustomInfoModal.css'
import modalTextSlideImg from '../../pages/images/text-slide.png'
import modalBulletImg from '../../pages/images/bullet-point.png'
import modalQuoteImg from '../../pages/images/quation.png'
import { FaLinkedin } from 'react-icons/fa'

const CustomInfoModal = ({ modalData, onClose }) => {
   useEffect(() => {
  if (modalData) {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden'; // <html>
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
            <button
              type="button"
              className="close-left"
              onClick={onClose}
            >
              <i className="bx bx-arrow-back" />
            </button>
          </div>
          <div className="custom-modal-content">
            <div className="custom-modal-body pt-md-3 px-lg-5">
              <div className="row g-4 mt-4">
                <div className="col-12 col-lg-4 text-center">
                  <div className="styled-img-container">
                    <img src={modalQuoteImg} className="quote-img" alt="Quote Icon" />
                    <img src={modalData.Image || modalQuoteImg} className="profile-img" alt={modalData.name} />
                  </div>
                  <div className="mt-3">
                    <a
                      href={modalData.linkedin || '#'}
                      className="btn btn-linkedin w-100 d-inline-flex align-items-center justify-content-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin size={18} /> LinkedIn
                    </a>
                  </div>
                </div>

                <div className="col-12 col-lg-8">
                  <h2 className="text-title">{modalData.name}</h2>
                  <p className="text-para mb-0">{modalData.title}</p>
                  <div>
                    <img src={modalTextSlideImg} alt="" />
                  </div>

                  {modalData.desc && modalData.desc.map((line, idx) => (
                    <p key={idx} className="discription">
                      {line}
                    </p>
                  ))}

                  <h5 className="mt-4 text-title">Key Expertise:</h5>
                  <ul className="custom-list">
                    {modalData.expertise && modalData.expertise.map((item, idx) => (
                      <li key={idx}>
                        <img src={modalBulletImg} alt="" /> {item}
                      </li>
                    ))}
                  </ul>

                  <h5 className="mt-4 text-title">Professional Philosophy:</h5>
                  <p className="discription">{modalData.philosophy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomInfoModal