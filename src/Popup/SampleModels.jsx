import React, { useCallback, useEffect, useRef, useState } from 'react';
import './samplemodel.css';
import { Maximize2, Moon, Sun, X } from 'lucide-react';
import { FastAverageColor } from 'fast-average-color';
import CustomLoader from '../components/loader/CustomLoader';
import { baseURL } from '../config';
import { useAuth } from '../context/AuthContext';

const isPlatformDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

const MODEL_VIEWER_ENV =
  'https://modelviewer.dev/shared-assets/environments/neutral.hdr';

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
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    r = hue2rgb(p, q, hDecimal + 1 / 3);
    g = hue2rgb(p, q, hDecimal);
    b = hue2rgb(p, q, hDecimal - 1 / 3);
  }

  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' : '' + hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const getCardBgColor = (baseColor, isDark) => {
  if (isDark) return '#12121a';
  if (!baseColor) return '#f4f4f8';

  let hex = baseColor.replace(/^\s*#|\s*$/g, '');
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, '$1$1');
  }
  let r = parseInt(hex.substr(0, 2), 16),
    g = parseInt(hex.substr(2, 2), 16),
    b = parseInt(hex.substr(4, 2), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return '#f4f4f8';
  }

  r = Math.min(255, Math.floor(r + (255 - r) * 0.2));
  g = Math.min(255, Math.floor(g + (255 - g) * 0.2));
  b = Math.min(255, Math.floor(b + (255 - b) * 0.2));

  const toHexVal = (x) => {
    const hexVal = Math.round(x).toString(16);
    return hexVal.length === 1 ? '0' : '' + hexVal;
  };

  return `#${toHexVal(r)}${toHexVal(g)}${toHexVal(b)}`;
};

const addCacheBuster = (url) => {
  if (!url) return url;
  const isSigned =
    url.includes('Signature=') ||
    url.includes('x-goog-signature=') ||
    url.includes('X-Goog-Signature=') ||
    url.includes('X-Amz-Signature=') ||
    url.includes('sig=');
  if (isSigned) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}`;
};

const getDirectModelUrl = (model) => {
  if (!model) return null;
  const path =
    model.file_temp_url || model.file_url || model.file || model.url || model.model_url;
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

const SampleModels = ({ model, onClose }) => {
  const { token } = useAuth();
  const overlayRef = useRef(null);
  const viewerRef = useRef(null);
  const loadTimeoutRef = useRef(null);

  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(model?.likes_count || 0);
  const [viewCount] = useState(model?.views_count || 0);
  const [viewerIsDark, setViewerIsDark] = useState(isPlatformDark);

  const imgUrl = model?.image
    ? `https://app.ai3dscanning.com/storage/${model.image.replace(/^\/+/, '')}`
    : null;

  const [modalBgColor, setModalBgColor] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const viewerBg = getCardBgColor(modalBgColor, viewerIsDark);

  useEffect(() => {
    if (imgUrl) {
      const fallback = getDeterministicHexColor(model?.id, model?.title || model?.name);
      setModalBgColor(fallback);

      const fac = new FastAverageColor();
      fac
        .getColorAsync(imgUrl, { algorithm: 'simple' })
        .then((color) => {
          setModalBgColor(makeColorLighter(color.hex, 30));
        })
        .catch(() => {
          setModalBgColor(fallback);
        });
    } else {
      setModalBgColor(null);
    }
  }, [imgUrl, model]);

  useEffect(() => {
    let cancelled = false;

    const resolveModelUrl = async () => {
      setModelLoaded(false);
      setLoadError(false);
      setModelUrl(null);

      if (!model) return;

      if (model.id) {
        try {
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers.Authorization = `Bearer ${token}`;

          const response = await fetch(`${baseURL}/model/temp/url/${model.id}`, {
            method: 'GET',
            headers,
          });

          if (response.ok) {
            const data = await response.json();
            const tempUrl =
              data.url || data.temp_url || data.model_url || data.data?.url || data.data?.temp_url;
            if (tempUrl && !cancelled) {
              setModelUrl(addCacheBuster(tempUrl.replace(/\\\//g, '/').trim()));
              return;
            }
          }
        } catch (err) {
          console.error('Error fetching temp model URL:', err);
        }
      }

      const directUrl = getDirectModelUrl(model);
      if (!cancelled) {
        if (directUrl) {
          setModelUrl(addCacheBuster(directUrl));
        } else {
          setLoadError(true);
        }
      }
    };

    resolveModelUrl();
    return () => {
      cancelled = true;
    };
  }, [model, token]);

  const markModelReady = useCallback(() => {
    setModelLoaded(true);
    setLoadError(false);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, []);

  const viewerRefCallback = useCallback(
    (node) => {
      if (viewerRef.current?._cleanup) {
        viewerRef.current._cleanup();
      }

      viewerRef.current = node;
      if (!node) return;

      const onPosterDismissed = () => markModelReady();

      const onLoad = () => {
        loadTimeoutRef.current = setTimeout(() => {
          markModelReady();
        }, 800);
      };

      const onError = () => {
        setModelLoaded(false);
        setLoadError(true);
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
          loadTimeoutRef.current = null;
        }
      };

      node.addEventListener('poster-dismissed', onPosterDismissed);
      node.addEventListener('load', onLoad);
      node.addEventListener('error', onError);

      node._cleanup = () => {
        node.removeEventListener('poster-dismissed', onPosterDismissed);
        node.removeEventListener('load', onLoad);
        node.removeEventListener('error', onError);
      };
    },
    [markModelReady],
  );

  useEffect(() => {
    if (!modelUrl) return undefined;

    loadTimeoutRef.current = setTimeout(() => {
      setLoadError(true);
      setModelLoaded(false);
    }, 20000);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, [modelUrl]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleFullscreen = () => {
    const el = viewerRef.current;
    if (el?.requestFullscreen) el.requestFullscreen();
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
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
      <div className="sm-modal">
        <div className="sm-header">
          <h3 className="sm-title">{model?.title || 'Untitled Model'}</h3>

          <div className="sm-header-actions">
            <button
              type="button"
              className="sm-icon-btn"
              onClick={() => setViewerIsDark((prev) => !prev)}
              aria-label={viewerIsDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={viewerIsDark ? 'Light mode' : 'Dark mode'}
            >
              {viewerIsDark ? <Sun size={16} color="#DE3996" /> : <Moon size={16} color="#DE3996" />}
            </button>

            <button
              type="button"
              className="sm-icon-btn"
              onClick={handleFullscreen}
              disabled={!modelLoaded && !!modelUrl}
              aria-label="Toggle fullscreen"
              title="Fullscreen"
            >
              <Maximize2 size={16} color="#DE3996" />
            </button>

            <button
              type="button"
              className="sm-icon-btn"
              onClick={onClose}
              aria-label="Close modal"
              title="Close"
            >
              <X size={16} color="#DE3996" />
            </button>
          </div>
        </div>

        <div className="sm-viewer-area" style={{ background: viewerBg }}>
          {modelUrl && !loadError ? (
            <>
              {!modelLoaded && (
                <div className="sm-viewer-loader">
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
                  <p className="sm-loader-caption">We are frying model for you 😋</p>
                </div>
              )}

              <model-viewer
                ref={viewerRefCallback}
                key={modelUrl}
                src={modelUrl}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                tone-mapping="commerce"
                shadow-intensity="1"
                shadow-softness="1"
                exposure="1"
                environment-image={MODEL_VIEWER_ENV}
                autoplay
                reveal="auto"
                loading="eager"
                interaction-prompt="none"
                class="sm-model-viewer"
                style={{
                  opacity: modelLoaded ? 1 : 0,
                  backgroundColor: viewerBg,
                }}
              />
            </>
          ) : imgUrl ? (
            <div className="sm-img-fallback">
              {!imgLoaded && (
                <div className="sm-img-loader-wrap">
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
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L11 21.73a2 2 0 0 0 2 0L20 17.73A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <p>{loadError ? '3D preview could not be loaded' : 'No preview available'}</p>
            </div>
          )}
        </div>

        <div className="sm-reactions">
          <button
            type="button"
            className={`sm-reaction-btn ${liked ? 'sm-liked' : ''}`}
            onClick={handleLike}
            aria-label="Like"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={liked ? '#DE3996' : 'none'}
              stroke={liked ? '#DE3996' : '#4d5457'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span>{likeCount}</span>
          </button>

          <div className="sm-reaction-views">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4d5457"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{viewCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleModels;
