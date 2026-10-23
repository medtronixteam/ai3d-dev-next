import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import ThemeToggle from '../../layouts/main-layout/sidebar/ThemeToggle';
import { FiTool, FiCpu, FiBox, FiShoppingBag, FiSettings, FiActivity } from 'react-icons/fi';
import { FaGamepad } from 'react-icons/fa';
import { GiVrHeadset, GiFactory } from 'react-icons/gi';
import { MdStore, MdMonitorHeart } from 'react-icons/md';
import Starfield from '../../components/effects/Starfield';
import { useLocation } from 'react-router-dom';

const CATEGORIES = [
  { label: 'Construction', type: 'construction', icon: FiTool },
  { label: 'Gaming', type: 'gaming', icon: FaGamepad },
  { label: 'VR', type: 'vr', icon: GiVrHeadset },
  { label: 'Retail', type: 'retail', icon: MdStore },
  { label: 'Manufacturing', type: 'manufacturing', icon: GiFactory },
  { label: 'Health', type: 'health', icon: MdMonitorHeart },
];

const SimplePage = () => {
  const { token } = useAuth();
  const [selectedType, setSelectedType] = useState(CATEGORIES[0].type);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalModel, setModalModel] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [stars, setStars] = useState([]);
  const containerRef = useRef(null);


  const location = useLocation();


  useEffect(() => {
    const currentPath = location.pathname;
    const hasReloaded = sessionStorage.getItem('hasReloaded');

    // Reload only once when visiting home "/"
    if (currentPath === '/' && hasReloaded !== 'true') {
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }

    // If user goes to any other route, reset the reload flag
    if (currentPath !== '/') {
      sessionStorage.removeItem('hasReloaded');
    }
  }, [location.pathname]);
  useEffect(() => {
    const numStars = 60;
    const container = containerRef.current;

    if (!container) return;

    container.innerHTML = ''; // Clear any existing stars

    for (let i = 0; i < numStars; i++) {
      const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      star.setAttribute('width', '18');
      star.setAttribute('height', '18');
      star.setAttribute('viewBox', '0 0 24 24');
      star.style.position = 'absolute';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.opacity = `${0.5 + Math.random() * 0.5}`;
      star.style.filter = 'drop-shadow(0 0 6px #fff8)';
      star.style.animation = `star-twinkle ${1.5 + Math.random() * 2}s ease-in-out infinite, star-float ${2 + Math.random() * 3}s ease-in-out infinite`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      star.innerHTML = `
           <polygon points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18 5.5,22 7,14.5 2,9.5 9,9" fill="#fff"/>
         `;
      container.appendChild(star);
    }
  }, []);

  // Helper to get full video URL
  const getFullVideoUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `https://dev-backend.ai3dscanning.com/storage/${url.replace(/^\/+/, '')}`;
  };

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError('');
    axios.get(`${baseURL}/model/${selectedType}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setModels(res.models.data || []))
      .catch(() => setError('Failed to load models.'))
      .finally(() => setLoading(false));
  }, [selectedType, token]);

  return (
    <>
      <div className="gradient-grain"></div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 2rem 0 2rem' }}>
        <ThemeToggle />
      </div>
      {/* =================== Hero Section ============= */}
      <section className="hero-section p-5">
        {/* <div className="starfield-container"></div> */}
        <div ref={containerRef} className="starfield-container"></div>;
        <div className="container">
          <div className="row justify-content-center align-items-center text-center">
            <div className="col-md-7">

              <p>AI- powered scanning with real-time previews.</p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-7 search-container">
              <div className="search-box">
                <div className="search-icon">
                  <i className="bx bx-search" />
                </div>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search 3D Models"
                />
                <div className="arrow-icon">
                  <i className="fa fa-arrow-right" />
                </div>
              </div>
            </div>
          </div>
          {/* =================== model card section ============= */}
          <div className="row justify-content-center align-items-center mt-5">
            <div className="col-md-7 d-flex justify-content-center">
              <div className="row justify-content-center text-center">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.type}
                      className="col-6 col-sm-4 col-md-4 col-lg-2 text-center d-flex flex-column align-items-center model-icon"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedType(cat.type)}
                    >
                      <div className={`circle-container${selectedType === cat.type ? ' selected' : ''}`}
                        style={{ border: selectedType === cat.type ? '2px solid #DE3996' : 'none' }}
                      >
                        <Icon size={40} color={selectedType === cat.type ? '#DE3996' : '#a3a3a3'} />
                      </div>
                      <h6 className="mt-1 " style={{ fontSize: 5, }}>
                        <span style={{ fontSize: 5, color: selectedType === cat.type ? '#DE3996' : '#625d5d' }}>{cat.label}</span>
                      </h6>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* =================== model card section end ============= */}
        </div>

        {/* =================== Hero Section End ============= */}
        {/* =================== Studio Section  ============= */}
        <section className="studio-section p-md-5">
          <div className="container">
            {loading ? (
              <div className="centered-loader">
                <CustomLoader />
              </div>
            ) : error ? (
              <div className="text-center my-5 text-danger">{error}</div>
            ) : models.length === 0 ? (
              <div className="text-center my-5">No models found.</div>
            ) : (
              <div className="model-list-row">
                {models.map((model, idx) => {
                  const imgUrl = model.thumbnail
                    ? `https://dev-backend.ai3dscanning.com/storage/${model.thumbnail.replace(/^\/+/, '')}`
                    : model.image
                      ? `https://dev-backend.ai3dscanning.com/storage/${model.image.replace(/^\/+/, '')}`
                      : '';
                  return (
                    <div key={model.id} className="card mb-4 shadow-sm border-0" style={{ maxWidth: 540, borderRadius: 18, margin: '0 auto', overflow: 'hidden', boxShadow: '0 4px 24px rgba(230,51,154,0.07)' }}>
                      <div className="row g-0 align-items-center">
                        <div className="col-md-4 d-flex align-items-center" style={{ background: '#f7f7f7', minHeight: 140 }}>
                          <img src={imgUrl} className="img-fluid rounded-start" alt={model.title} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 140 }} />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body d-flex flex-column justify-content-center h-100">
                            <h5 className="card-title mb-2" style={{ fontWeight: 700, fontSize: '1.15rem', color: '#23232a' }}>{model.title}</h5>
                            <p className="card-text mb-3" style={{ color: '#666', fontSize: '0.98rem', minHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis' }}>{model.description || 'No description.'}</p>
                            <button className="btn btn-primary mt-auto align-self-end"
                              style={{ background: 'var(--primary-color)', border: 'none', borderRadius: 22, fontWeight: 600, fontSize: '1rem', padding: '6px 20px', boxShadow: '0 2px 8px rgba(230,51,154,0.10)' }}
                              onClick={(e) => { e.stopPropagation(); setModalModel(model); setVideoLoading(true); }}>
                              Explore <i className="fa fa-arrow-right mx-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        {/* =================== Studio Section End ============= */}

        {modalModel && (
          <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setModalModel(null)}>
            <div className="modal-content" style={{ background: '#fff', borderRadius: 12, padding: 0, minWidth: 350, maxWidth: 600, boxShadow: '0 2px 16px rgba(0,0,0,0.15)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setModalModel(null)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 28, color: '#e6339a', cursor: 'pointer', zIndex: 2 }}>&times;</button>
              <div className="card mb-3" style={{ maxWidth: 540, margin: '40px auto 0 auto' }}>
                <div className="row g-0">
                  <div className="col-md-4">
                    <img src={modalModel.image || ''} className="img-fluid rounded-start" alt={modalModel.title} />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{modalModel.title}</h5>
                      <p className="card-text">{modalModel.description || 'No description.'}</p>
                      <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default SimplePage;