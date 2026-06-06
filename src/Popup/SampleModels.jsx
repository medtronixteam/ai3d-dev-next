import React, { useEffect, useRef, useState } from 'react';
import './samplemodel.css';
import { Maximize, Maximize2, X } from 'lucide-react';
import { FastAverageColor } from 'fast-average-color';
import CustomLoader from '../components/loader/CustomLoader';

const makeColorLighter = (hexColor, percent = 40) => {
  let hex = hexColor.replace(/^\s*#|\s*$/g, '');
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, '$1$1');
  }
  let r = parseInt(hex.substr(0, 2), 16),
      g = parseInt(hex.substr(2, 2), 16),
      b = parseInt(hex.substr(4, 2), 16);

  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const getDeterministicHexColor = (id, text = '') => {
  if (!id) return '#f5f5f5';
  let hash = 0;
  const str = String(id) + (text ? String(text) : '');
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash) % 360;
  const s = 65; 
  const l = 60; 
  
  const hDecimal = hue / 360;
  const sDecimal = s / 100;
  const lDecimal = l / 100;
  
  let r, g, b;
  
  if (sDecimal === 0) {
    r = g = b = lDecimal;
  } else {
    const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
    const p = 2 * lDecimal - q;
    
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    r = hue2rgb(p, q, hDecimal + 1/3);
    g = hue2rgb(p, q, hDecimal);
    b = hue2rgb(p, q, hDecimal - 1/3);
  }
  
  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' : '' + hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const getCardBgColor = (baseColor, isDark) => {
  if (!baseColor) {
    return isDark ? '#1b1b22' : '#ffffff';
  }
  let hex = baseColor.replace(/^\s*#|\s*$/g, '');
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, '$1$1');
  }
  let r = parseInt(hex.substr(0, 2), 16),
      g = parseInt(hex.substr(2, 2), 16),
      b = parseInt(hex.substr(4, 2), 16);
      
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return isDark ? '#1b1b22' : '#ffffff';
  }

  if (isDark) {
    r = Math.min(255, Math.floor(r * 0.45) + 20);
    g = Math.min(255, Math.floor(g * 0.45) + 20);
    b = Math.min(255, Math.floor(b * 0.45) + 25);
  } else {
    r = Math.min(255, Math.floor(r + (255 - r) * 0.2));
    g = Math.min(255, Math.floor(g + (255 - g) * 0.2));
    b = Math.min(255, Math.floor(b + (255 - b) * 0.2));
  }

  const toHexVal = (x) => {
    const hexVal = Math.round(x).toString(16);
    return hexVal.length === 1 ? '0' : '' + hexVal;
  };

  return `#${toHexVal(r)}${toHexVal(g)}${toHexVal(b)}`;
};

const SampleModels = ({ model, onClose }) => {
  const overlayRef  = useRef(null);
  const viewerRef   = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(model?.likes_count || 0);
  const [viewCount] = useState(model?.views_count || 0);

  const getModelUrl = (model) => {
    if (!model) return null;
    const path = model.file_temp_url || model.file_url || model.file || model.url || model.model_url;
    if (path) {
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
      }
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `https://app.ai3dscanning.com${cleanPath}`;
    }
    if (model.image) {
      const filename = model.image.split('/').pop();
      const match = filename.match(/^(\d+)/);
      if (match) {
        return `https://app.ai3dscanning.com/storage/models/${match[1]}.glb`;
      }
    }
    return null;
  };

  const modelSrc = getModelUrl(model);

  const imgUrl = model?.image
    ? `https://app.ai3dscanning.com/storage/${model.image.replace(/^\/+/, '')}`
    : null;

  const [modalBgColor, setModalBgColor] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  // Background color extraction
  useEffect(() => {
    if (imgUrl) {
      const fallback = getDeterministicHexColor(model?.id, model?.title || model?.name);
      setModalBgColor(fallback);

      const fac = new FastAverageColor();
      fac.getColorAsync(imgUrl, { algorithm: 'simple' })
        .then((color) => {
          const lighter = makeColorLighter(color.hex, 30);
          setModalBgColor(lighter);
        })
        .catch((err) => {
          console.error('Error getting light average color:', err);
          setModalBgColor(fallback);
        });
    } else {
      setModalBgColor(null);
    }
  }, [imgUrl, model]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const onLoad = () => setModelLoaded(true);
    el.addEventListener('load', onLoad);
    return () => el.removeEventListener('load', onLoad);
  }, [modelSrc]);

  /* ── Fullscreen helper ── */
  const handleFullscreen = () => {
    const el = viewerRef.current;
    if (el?.requestFullscreen) el.requestFullscreen();
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleLike = () => {
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div
      className="sm-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={model?.title || '3D Model Preview'}
    >
      <div 
        className="sm-modal"
        style={{
          background: modalBgColor
            ? getCardBgColor(modalBgColor, isDarkMode)
            : (isDarkMode
                ? 'linear-gradient(90deg, #3E112C, #190F21)'
                : 'linear-gradient(90deg, #FFEDF7, #F2F0FE)'),
        }}
      >

        <div className="sm-header">
          <h3 className="sm-title">
            {model?.title || 'Untitled Model'}
          </h3>

          <div className="sm-header-actions">

            <button
              className="sm-icon-btn"
              onClick={handleFullscreen}
              disabled={!modelLoaded && !!modelSrc}
              aria-label="Toggle fullscreen"
              title="Fullscreen"
            >
              <Maximize2 size={16} color='#DE3996' />
            </button>

            {/* Close */}
            <button
              className="sm-icon-btn"
              onClick={onClose}
              aria-label="Close modal"
              title="Close"
            >
              <X size={16} color='#DE3996' />
            </button>
          </div>
        </div>

        <div className="sm-viewer-area">

          {modelSrc ? (
            <>
            {!modelLoaded && (
                <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                }}
                >
                <div className="animated-loader">
                    <div className="pan-container">
                    <span
                        className="loader-loader"
                        style={{
                        '--loader-image': imgUrl ? `url(${imgUrl})` : 'none',
                        }}
                    />
                    <div className="fire">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    </div>
                </div>
                <p style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#DE3996',
                    marginTop: '10rem',
                }}>
                    We are frying model for you 😋
                </p>
                </div>
            )}

            <model-viewer
                ref={viewerRef}
                src={modelSrc}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                tone-mapping="neutral"
                shadow-intensity="1"
                shadow-softness="1"
                exposure="1"
                autoplay
                reveal="auto"
                loading="eager"
                class="sm-model-viewer"
                style={{ opacity: modelLoaded ? 1 : 0 }}
            />
            </>
          ) : imgUrl ? (
            <div className="sm-img-fallback">
              {!imgLoaded && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', width: '100%' }}>
                  <CustomLoader />
                </div>
              )}
              <img 
                src={imgUrl} 
                alt={model?.title || 'Model preview'} 
                onLoad={() => setImgLoaded(true)}
                style={{ display: imgLoaded ? 'block' : 'none' }}
              />
            </div>
          ) : (
            <div className="sm-empty-state">
              <div className="sm-empty-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L11 21.73a2 2 0 0 0 2 0L20 17.73A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <p>No preview available</p>
            </div>
          )}
        </div>

        {/* ── Likes & Views Footer ── */}
        <div className="sm-reactions">
        <button
            className={`sm-reaction-btn ${liked ? 'sm-liked' : ''}`}
            onClick={handleLike}
            aria-label="Like"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#DE3996' : 'none'}
            stroke={liked ? '#DE3996' : '#4d5457'} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
            <span>{likeCount}</span>
        </button>

        <div className="sm-reaction-views">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#4d5457" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>{viewCount}</span>
        </div>
        </div>

      </div>
    </div>
  );
};

export default SampleModels;