import React from 'react';
import {
  ArrowRight,
  Search,
  Download,
  Heart,
  Share2,
  Box,
  Clock,
  Edit2,
} from 'lucide-react';
import hugeiconsCrown from '../../pages/images/icons/hugeicons_crown-02.png';
import Crown from '../../pages/images/icons/crown.png';
import starSearch from '../../pages/images/icons/star-search.png';
import fullScreen from '../../pages/images/icons/full-screen.png';

const RightScan = ({
  activeTab,
  setActiveTab,
  historyFilter,
  setHistoryFilter,
  historyData,
  modelReady,
  transformControls,
  handleTransformChange,
  handleExport,
  onHistoryExport,
  onHistoryFavorite,
  onHistoryShare,
  historySearchQuery,
  setHistorySearchQuery,
}) => {
  const filteredHistory = historyData.filter((item) =>
    historyFilter === 'all' ? true : item.status === historyFilter,
  );

  return (
    <div className="col-lg-3 ps-lg-3 my-lg-0 mt-3 mb-5">
      <div className="library-card-outer">
        {activeTab === 'library' && (
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
              <button className="upgrade-btn-card rounded-pill border-0">
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

        <div className="library-card-scroll">
          {activeTab === 'library' ? (
            <div className="fade-in">
              <div className="search-wrap mb-3 position-relative">
                <img src={starSearch} className="search-icon text-pink" alt="" />
                <input
                  type="text"
                  className="form-control custom-search x-small"
                  placeholder="Search our 3D Models"
                />
                <div className="search-arrow">
                  <ArrowRight size={14} />
                </div>
              </div>
              <div className="row g-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="col-6">
                    <div
                      className="gallery-card rounded-3 shadow-sm"
                      style={{
                        backgroundImage: `url(https://picsum.photos/200/200?random=${i})`,
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'history' ? (
            <div className="fade-in">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">
                  Recent <span className="text-pink">Model</span>
                </h6>
                <span className="text-pink xx-small fw-bold cursor-pointer">View All</span>
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
                    onClick={() => setHistoryFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              <div className="history-list">
                {filteredHistory.map((item) => (
                  <div key={item.id} className="history-item border">
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="history-thumb"
                        style={{ backgroundImage: `url(${item.thumbnail})` }}
                      ></div>

                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="mb-0">
                            <h6 className="mb-0 fw-bold" style={{ fontSize: '11px' }}>
                              {item.name}
                            </h6>
                            <span className="text-muted xx-small mb-0 mt-0">{item.time}</span>
                          </div>
                          <span className={`badge-type type-${item.type}`}>{item.type} to 3D</span>
                        </div>

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
                              <span className="text-pink fw-bold cursor-pointer">Regenerate</span>
                            </div>
                            <div className="progress custom-progress">
                              <div
                                className="progress-bar bg-danger"
                                style={{ width: '60%' }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex mt-1 gap-1">
                            <div className="bg-icon cursor-pointer" onClick={() => onHistoryExport(item)}>
                              <Download size={12} className="text-muted" />
                            </div>
                            <div className="bg-icon cursor-pointer" onClick={() => onHistoryFavorite(item)}>
                              <Heart size={12} className={item.favorite ? 'text-pink' : 'text-muted'} fill={item.favorite ? '#DE3996' : 'none'} />
                            </div>
                            <div className="bg-icon cursor-pointer" onClick={() => onHistoryShare(item)}>
                              <Share2 size={12} className="text-muted" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                    {/* Position Section */}
                    <div className="input-group">
                      <label className="input-label">Position</label>
                      <div className="vector-inputs">
                        <div className="input-field">
                          <span className="axis-label">X</span>
                          <input
                            type="number"
                            value={transformControls.position.x}
                            onChange={(e) =>
                              handleTransformChange('position', 'x', e.target.value)
                            }
                            className="number-input"
                          />
                        </div>
                        <div className="input-field">
                          <span className="axis-label">Y</span>
                          <input
                            type="number"
                            value={transformControls.position.y}
                            onChange={(e) =>
                              handleTransformChange('position', 'y', e.target.value)
                            }
                            className="number-input"
                          />
                        </div>
                        <div className="input-field">
                          <span className="axis-label">Z</span>
                          <input
                            type="number"
                            value={transformControls.position.z}
                            onChange={(e) =>
                              handleTransformChange('position', 'z', e.target.value)
                            }
                            className="number-input"
                          />
                        </div>
                      </div>
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
                          value={transformControls.scale}
                          onChange={(e) => handleTransformChange('scale', '', e.target.value)}
                          className="number-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="library-card-tabs">
          {modelReady ? (
            <div className="export-button-bar">
              <button className="export-action-btn small">
                <Edit2 size={14} className="action-icon" />
              </button>
              <button className="export-action-btn small">
                <Share2 size={14} className="action-icon" />
              </button>
              <button className="export-action-btn export">
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