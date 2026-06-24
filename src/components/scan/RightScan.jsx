import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  Download,
  Heart,
  Share2,
  Box,
  Clock,
  Edit2,
  Image,
} from 'lucide-react';
import hugeiconsCrown from '../../pages/images/icons/hugeicons_crown-02.png';
import Crown from '../../pages/images/icons/crown.png';
import starSearch from '../../pages/images/icons/star-search.png';
import fullScreen from '../../pages/images/icons/full-screen.png';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import { toast } from 'react-toastify';
import { FastAverageColor } from 'fast-average-color';
import ModelReviewModal from '../popup/ModelReviewModal';
import CustomLoader from '../loader/CustomLoader';
import paths from '../../routes/paths';

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

const RightScan = ({
  activeTab,
  setActiveTab,
  historyFilter,
  onHistoryFilterChange,
  historyData,
  historyLoading = false,
  historyFilterLoading = false,
  modelReady,
  isUserOwnedProject,
  transformControls,
  handleTransformChange,
  handleExport,
  onShareProject,
  onHistoryExport,
  onHistoryFavorite,
  onHistoryShare,
  onHistoryOpen,
  historySearchQuery,
  setHistorySearchQuery,
  onSelectModel,
  hideUpgradePromo = false,
  showReviewModal = false,
  onCloseReviewModal,
  reviewProjectToken,
  reviewProjectType,
}) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [libraryModels, setLibraryModels] = React.useState([]);
  const [libraryLoading, setLibraryLoading] = React.useState(false);
  const [isModelLoading, setIsModelLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [searchText, setSearchText] = React.useState('');
  const [cardBgColors, setCardBgColors] = React.useState({});
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [loadedImages, setLoadedImages] = React.useState({});

  // Theme detection
  React.useEffect(() => {
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

  // Background color extraction for library cards
  React.useEffect(() => {
    const fetchColors = async () => {
      const promises = libraryModels.map(async (model) => {
        const fallback = getDeterministicHexColor(model.id, model.title || model.name);
        const imgUrl = model.thumbnail
          ? `https://app.ai3dscanning.com/storage/${model.thumbnail.replace(/^\/+/, '')}`
          : model.image
            ? `https://app.ai3dscanning.com/storage/${model.image.replace(/^\/+/, '')}`
            : null;

        if (imgUrl) {
          try {
            const fac = new FastAverageColor();
            const color = await fac.getColorAsync(imgUrl, { algorithm: 'simple' });
            const lightColor = makeColorLighter(color.hex, 30);
            return { id: model.id, color: lightColor };
          } catch (e) {
            console.error('Error extracting color for model', model.id, e);
            return { id: model.id, color: fallback };
          }
        }
        return { id: model.id, color: fallback };
      });

      const results = await Promise.all(promises);
      const newColors = {};
      results.forEach(res => {
        if (res.color) {
          newColors[res.id] = res.color;
        }
      });

      setCardBgColors(prev => ({ ...prev, ...newColors }));
    };

    if (libraryModels.length > 0) {
      fetchColors();
    }
  }, [libraryModels]);

  const fetchLibraryModels = React.useCallback(async (pageNum = 1, query = '', append = false) => {
    setLibraryLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let data;
      if (query.trim()) {
        const res = await fetch(`${baseURL}/models/search?page=${pageNum}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ title: query, category: 'all' }),
        });
        data = await res.json();
      } else {
        const res = await fetch(`${baseURL}/top/models?page=${pageNum}`, { headers });
        data = await res.json();
      }

      const rawModels = data.models?.data || data.models || data.data || [];
      const currentPage = data.models?.current_page || pageNum;
      const lastPage = data.models?.last_page || 1;
      
      setHasMore(currentPage < lastPage);
      
      setLibraryModels((prev) => {
        if (append) {
          const existingIds = new Set(prev.map(m => m.id));
          const filteredNew = rawModels.filter(m => !existingIds.has(m.id));
          return [...prev, ...filteredNew];
        } else {
          return rawModels;
        }
      });
    } catch (err) {
      console.error('Failed to fetch library models:', err);
    } finally {
      setLibraryLoading(false);
    }
  }, [token]);

  // Initial load
  React.useEffect(() => {
    if (activeTab === 'library') {
      setPage(1);
      setHasMore(true);
      fetchLibraryModels(1, searchText, false);
    }
  }, [activeTab, fetchLibraryModels]);

  // Paginated load
  React.useEffect(() => {
    if (activeTab === 'library' && page > 1) {
      fetchLibraryModels(page, searchText, true);
    }
  }, [page, activeTab, fetchLibraryModels, searchText]);

  // Debounced search typing
  React.useEffect(() => {
    if (activeTab !== 'library') return;
    
    if (searchText === '') {
      setPage(1);
      setHasMore(true);
      fetchLibraryModels(1, '', false);
      return;
    }
    
    const delayDebounce = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      fetchLibraryModels(1, searchText, false);
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchText, activeTab, fetchLibraryModels]);

  const handleScroll = (e) => {
    if (activeTab !== 'library') return;
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 50 && !libraryLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const onSearchSubmit = (e) => {
    e?.preventDefault();
    setPage(1);
    setHasMore(true);
    fetchLibraryModels(1, searchText, false);
  };

  const handleModelClick = async (model) => {
    if (isModelLoading) return;
    setIsModelLoading(true);
    let url = model.file_temp_url || model.file_url || model.url;
    
    if (model.id) {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(`${baseURL}/model/temp/url/${model.id}`, { headers });
        if (response.ok) {
          const resData = await response.json();
          let tempUrl = resData.url || resData.temp_url || resData.model_url || resData.data?.url || resData.data?.temp_url;
          if (tempUrl) {
            if (tempUrl.includes('/storage//')) {
              tempUrl = tempUrl.replace('/storage//', '/storage/models/');
            }
            url = tempUrl;


          }
        }
      } catch (err) {
        console.error('Failed to fetch temp URL for library model, using fallback:', err);
      }
    }

    setIsModelLoading(false);

    if (url) {
      url = url.replace(/\\\//g, '/').trim();
      if (url.includes('/storage//')) {
        url = url.replace('/storage//', '/storage/models/');
      }
      if (!url.startsWith('http') && !url.startsWith('blob:')) {
        const cleanName = url.replace(/^\/+/, '');
        if (cleanName.startsWith('storage/')) {
          url = `https://app.ai3dscanning.com/${cleanName}`;
        } else {
          url = `https://app.ai3dscanning.com/storage/models/${cleanName}`;
        }
      }
      if (onSelectModel) {
        onSelectModel(url);
      }
    } else {
      toast.error('No 3D model file available for this item');
    }
  };

  const filteredHistory = historyData.filter((item) =>
    historyFilter === 'all' ? true : item.status === historyFilter,
  );

  const handleHistoryItemClick = (item) => {
    onHistoryOpen?.(item);
  };

  const getHistoryBadgeLabel = (type) => {
    if (type === 'prompt') return 'Text to 3D';
    if (type === 'video') return 'Video to 3D';
    return 'Image to 3D';
  };

  const renderHistoryThumb = (item) => {
    const isTextTo3D = item.rawType === 'text_to_3d' || item.rawType === 'prompt_to_3d' || item.type === 'prompt';
    const isVideoTo3D = item.rawType === 'video_to_3d' || item.type === 'video';

    let textLabel = 'Image to 3D';
    if (isTextTo3D) {
      textLabel = 'Text to 3D';
    } else if (isVideoTo3D) {
      textLabel = 'Video to 3D';
    }

    return (
      <div
        className="history-thumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(230, 51, 153, 0.05)',
          borderRadius: '8px',
          boxShadow: 'none',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            color: '#e63399',
            fontWeight: '600',
            textAlign: 'center',
            lineHeight: '1.2',
            padding: '5px',
          }}
        >
          {textLabel}
        </span>
      </div>
    );
  };

  return (
    <div className="col-lg-3 ps-lg-3 my-lg-0 mt-3 mb-0 mb-lg-5 scan-right-column">
      <style>{`
        /* Custom image loader matching platform styling */
        .rp-img-loader {
          width: 56px;
          height: 56px;
          position: relative;
          background: transparent !important;
          border-radius: 4px;
          overflow: hidden;
        }

        .rp-img-loader:before {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 36px;
          height: 36px;
          transform: rotate(45deg) translate(30%, 40%);
          background: color-mix(in srgb, #DE3996 60%, #ffffff 40%);
          box-shadow: 24px -26px 0 4px #DE3996;
          animation: rp-slide 2s infinite ease-in-out alternate;
        }

        .rp-img-loader:after {
          content: "";
          position: absolute;
          left: 10px;
          top: 10px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #DE3996;
          transform: rotate(0deg);
          transform-origin: 25px 105px;
          animation: rp-rotate 2s infinite ease-in-out;
        }

        @keyframes rp-slide {
          0%, 100% { bottom: -25px }
          25%, 75% { bottom: -1px }
          20%, 80% { bottom: 1px }
        }

        @keyframes rp-rotate {
          0% { transform: rotate(-15deg) }
          25%, 75% { transform: rotate(0deg) }
          100% { transform: rotate(25deg) }
        }
      `}</style>
      <div className={`library-card-outer${activeTab === 'transform' ? ' transform-tab' : ''}${modelReady ? ' model-ready-panel' : ''}`}>
        {activeTab === 'library' && !hideUpgradePromo && (
          <div className="upgrade-box p-2 rounded-4 m-3">
            <p className="text-pink x-small fw-bold mb-2">
              <img
                src={hugeiconsCrown}
                alt="Diamond"
                style={{ height: '15px', width: '15px' }}
              />{' '}
              You're on a free plan. Upgrade to Pro or Enterprise to unlock priority processing,
              private generations, higher scan limits, advanced editing tools, and team
              collaboration features.
            </p>
            <div className="d-flex justify-content-end">
              <button className="upgrade-btn-card rounded-pill border-0" onClick={() => navigate('/3dio/subscription')}>
                <img
                  src={Crown}
                  alt="Diamond"
                  style={{ height: '14px', width: '14px', marginRight: 6 }}
                />
                Upgrade
              </button>
            </div>
          </div>
        )}

        <div className="library-card-scroll" onScroll={handleScroll}>
          {activeTab === 'library' ? (
            <div className="fade-in">
              <form onSubmit={onSearchSubmit} className="search-wrap mb-3 position-relative">
                <img src={starSearch} className="search-icon text-pink" alt="" />
                <input
                  type="text"
                  className="form-control custom-search x-small"
                  placeholder="Search our 3D Models"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <button type="submit" className="search-arrow border-0 p-0" style={{ cursor: 'pointer' }}>
                  <ArrowRight size={14} />
                </button>
              </form>
              <div className="row g-2 animate-grid-scroll" style={{ paddingBottom: '16px' }}>
                {libraryModels.length > 0 ? (
                  <>
                    {libraryModels.map((model) => {
                      const imgUrl = model.thumbnail
                        ? `https://app.ai3dscanning.com/storage/${model.thumbnail.replace(/^\/+/, '')}`
                        : model.image
                          ? `https://app.ai3dscanning.com/storage/${model.image.replace(/^\/+/, '')}`
                          : 'https://picsum.photos/200/200?random=' + model.id;

                      const isImgLoaded = loadedImages[model.id];
                      const bgColor = cardBgColors[model.id] || '#f5f5f5';

                      return (
                        <div key={model.id} className="col-6">
                          <div
                            className="gallery-card rounded-3 shadow-sm cursor-pointer position-relative overflow-hidden d-flex align-items-center justify-content-center"
                            style={{
                              backgroundColor: getCardBgColor(bgColor, isDarkMode),
                              height: '110px',
                              border: '1px solid rgba(255,255,255,0.05)',
                            }}
                            onClick={() => handleModelClick(model)}
                            title={model.title || model.name}
                          >
                            {!isImgLoaded && (
                              <div
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  zIndex: 2,
                                }}
                              >
                                <span className="rp-img-loader" aria-label="loading thumbnail"></span>
                              </div>
                            )}
                            <img
                              src={imgUrl}
                              alt={model.title || model.name}
                              onLoad={() => setLoadedImages(prev => ({ ...prev, [model.id]: true }))}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: isImgLoaded ? 1 : 0,
                                transition: 'opacity 0.3s ease',
                              }}
                            />
                            <div 
                              style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                fontSize: '10px',
                                padding: '4px 6px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textAlign: 'center',
                                zIndex: 3,
                              }}
                            >
                              {model.title || model.name || 'Untitled'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {libraryLoading && (
                      <div className="col-12 text-center py-2">
                        <div className="spinner-border spinner-border-sm text-pink" role="status"></div>
                      </div>
                    )}
                  </>
                ) : libraryLoading ? (
                  <div className="col-12 text-center py-4">
                    <div className="spinner-border spinner-border-sm text-pink" role="status"></div>
                  </div>
                ) : (
                  <div className="col-12 text-center py-4 text-muted small">
                    No models found in library.
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'history' ? (
            <div className="fade-in">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">
                  Recent <span className="text-pink">Model</span>
                </h6>
                <Link
                  to={paths.models}
                  className="text-pink xx-small fw-bold cursor-pointer text-decoration-none"
                >
                  View All
                </Link>
              </div>
              <div className="search-wrap mb-3 position-relative">
                <Search className="search-icon text-pink" size={14} />
                <input
                  type="text"
                  className="form-control custom-search x-small"
                  placeholder="Search recent 3D generation..."
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                />
                <div className="search-arrow">
                  <ArrowRight size={14} />
                </div>
              </div>
              <div className="d-flex gap-2 mb-3">
                {['all', 'completed', 'processing'].map((filter) => (
                  <button
                    key={filter}
                    className={`filter-pill ${historyFilter === filter ? 'active' : ''}`}
                    onClick={() => onHistoryFilterChange(filter)}
                    disabled={historyLoading || historyFilterLoading}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              <div className="history-list">
                {historyLoading || historyFilterLoading ? (
                  <div className="history-list-loader">
                    <CustomLoader />
                  </div>
                ) : filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      className={`history-item border${onHistoryOpen ? ' history-item--clickable' : ''}`}
                      onClick={() => handleHistoryItemClick(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleHistoryItemClick(item);
                        }
                      }}
                      role={onHistoryOpen ? 'button' : undefined}
                      tabIndex={onHistoryOpen ? 0 : undefined}
                    >
                      <div className="d-flex align-items-start gap-3">
                        {renderHistoryThumb(item)}

                        <div className="flex-grow-1">
                          <div className="history-item-header">
                            <h6 className="mb-0 fw-bold history-item-title" style={{ fontSize: '11px' }}>
                              {item.name}
                            </h6>
                            <span className={`badge-type type-${item.type} flex-shrink-0`}>
                              {getHistoryBadgeLabel(item.type)}
                            </span>
                          </div>
                          <span className="text-muted xx-small history-item-time">{item.time}</span>

                          {item.status === 'processing' ? (
                            <div className="mt-0">
                              <div className="d-flex justify-content-between xx-small mb-1">
                                <span className="text-pink italic fw-bold">processing</span>
                                <span className="text-muted">{item.progress}%</span>
                              </div>
                              <div className="progress custom-progress">
                                <div
                                  className="progress-bar"
                                  style={{ width: `${item.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : item.status === 'failed' ? (
                            <div className="mt-3">
                              <div className="d-flex justify-content-between xx-small mb-1">
                                <span className="text-danger fw-bold">Generation Failed</span>
                                <span
                                  className="text-pink fw-bold cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleHistoryItemClick(item);
                                  }}
                                >
                                  Regenerate
                                </span>
                              </div>
                              <div className="progress custom-progress">
                                <div
                                  className="progress-bar bg-danger"
                                  style={{ width: '60%' }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <div className="history-item-actions d-flex gap-1">
                              <div
                                className="bg-icon cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onHistoryExport(item);
                                }}
                              >
                                <Download size={12} className="text-muted" />
                              </div>
                              <div
                                className="bg-icon cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onHistoryFavorite(item);
                                }}
                              >
                                <Heart size={12} className={item.favorite ? 'text-pink' : 'text-muted'} fill={item.favorite ? '#DE3996' : 'none'} />
                              </div>
                              <div
                                className="bg-icon cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onHistoryShare(item);
                                }}
                              >
                                <Share2 size={12} className="text-muted" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(222, 57, 150, 0.1)', color: '#DE3996' }}>
                      <Clock size={20} />
                    </div>
                    <h6 className="fw-semibold mb-1" style={{ fontSize: '13px' }}>No History Found</h6>
                    <p className="text-muted xx-small mb-0 px-3">
                      You haven't generated any 3D models yet. Start scanning to see your history here!
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'transform' ? (
            <div className="fade-in">
              <div className="controls-section">
                <div className="control-panel">
                  <div className="control-section">
                    <div className="d-flex align-items-center mb-4">
                      <img src={fullScreen} alt="" />
                      <h3 className="section-title mx-2">Transform Controls</h3>
                    </div>
                    {/* Rotation Section */}
                    <div className="input-group">
                      <label className="input-label">Rotation (degree)</label>
                      <div className="vector-inputs">
                        <div className="input-field">
                          <span className="axis-label">X</span>
                          <input
                            type="number"
                            value={transformControls.rotation.x}
                            onChange={(e) =>
                              handleTransformChange('rotation', 'x', e.target.value)
                            }
                            className="number-input"
                          />
                        </div>
                        <div className="input-field">
                          <span className="axis-label">Y</span>
                          <input
                            type="number"
                            value={transformControls.rotation.y}
                            onChange={(e) =>
                              handleTransformChange('rotation', 'y', e.target.value)
                            }
                            className="number-input"
                          />
                        </div>
                        <div className="input-field">
                          <span className="axis-label">Z</span>
                          <input
                            type="number"
                            value={transformControls.rotation.z}
                            onChange={(e) =>
                              handleTransformChange('rotation', 'z', e.target.value)
                            }
                            className="number-input"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Scale Section */}
                    <div className="input-group">
                      <label className="input-label">Scale</label>
                      <div className="scale-input">
                        <input
                          type="number"
                          min="-5"
                          max="5"
                          step="0.1"
                          value={transformControls.scale}
                          onChange={(e) => handleTransformChange('scale', '', e.target.value)}
                          className="number-input"
                        />
                      </div>
                    </div>

                    {showReviewModal && (
                      <div id="scan-review-panel">
                        <ModelReviewModal
                          embedded
                          isOpen={showReviewModal}
                          onClose={onCloseReviewModal}
                          projectToken={reviewProjectToken}
                          projectType={reviewProjectType}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="library-card-tabs">
          {modelReady && isUserOwnedProject ? (
            <div className="export-button-bar">
              <button
                type="button"
                className="export-action-btn small"
                title="Edit"
                aria-label="Edit"
              >
                <Edit2 size={14} className="action-icon" />
              </button>
              <button
                type="button"
                className="export-action-btn small"
                onClick={onShareProject}
                title="Share project"
                aria-label="Share project"
              >
                <Share2 size={14} className="action-icon" />
              </button>
              <button
                type="button"
                className="export-action-btn export"
                onClick={handleExport}
                title="Export GLB"
                aria-label="Export model"
              >
                <Download size={14} className="me-1" />
                Export
              </button>
            </div>
          ) : (
            <>
              <button
                className={`tab-btn ${activeTab === 'library' ? 'active' : ''}`}
                onClick={() => setActiveTab('library')}
              >
                <Box size={18} />
                <span className="custom-tooltip">Library</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <Clock size={18} />
                <span className="custom-tooltip">History</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightScan;