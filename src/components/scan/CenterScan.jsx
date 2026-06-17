import React from 'react';
import { Rocket, Zap, Palette, Download } from 'lucide-react';
import sendCart from '../../pages/images/send-cart.png';
import SeamlessCart from '../../pages/images/Seamless-cart.png';
import CenterBox from '../../pages/images/icons/center-box.svg';
import shine from '../../pages/images/icons/shine.svg';
import ImgBox from '../../pages/images/icons/img-graph.svg';
import layersIcon from '../../pages/images/icons/layers-icon.svg';
import vedioIcon from '../../pages/images/icons/vedio-icon.svg';
import blurStar from '../../pages/images/icons/blurStar.png';
import PickerSelect from '../../pages/images/icons/picker-select.png';
import lassoTool from '../../pages/images/icons/lasso-tool.png';
import polygon from '../../pages/images/icons/polygon.png';
import brushSelect from '../../pages/images/icons/brush-select.png';
import floodSelect from '../../pages/images/icons/flood-select.png';
import earthSphereLine from '../../pages/images/icons/earth-sphere-line.png';
import squareSelect from '../../pages/images/icons/square-select.png';
import flyThrough from '../../pages/images/icons/fly-through.png';
import hotspot from '../../pages/images/icons/hotspot.png';
import trash from '../../pages/images/icons/trash.png';
import undo from '../../pages/images/icons/undo.png';
import redo from '../../pages/images/icons/redo.png';
import selection from '../../pages/images/icons/selection.png';
import setting from '../../pages/images/icons/setting.png';
import help from '../../pages/images/icons/help.png';
import shadow from '../../pages/images/icons/shadow.png';
import camera from '../../pages/images/icons/camera.png';
import ModelViewer from './ModelViewer';

const CenterScan = ({
  showLoadingUI,
  showQueueUI,
  showSuccessUI,
  modelReady,
  modelUrl,
  progress,
  setShowLoadingUI,
  setShowBlackOverlay,
  setProgress,
  resetAllInputs,
  showBlackOverlay,
  lottieRef,
  currentStep,
  projectStatus,
  modelViewerRef,
  onModelRendered,
  transformControls,
  sectionRef,
  activeViewportTool,
  shadowsEnabled,
  gridVisible,
  autoRotate,
  onSelectViewportTool,
  onViewportUndo,
  onViewportRedo,
  onToggleAutoRotate,
  onToggleShadows,
  onToggleGrid,
  onViewportHelp,
  onViewportScreenshot,
  onResetTransform,
  expanded = false,
}) => {
  const [isActuallyRendered, setIsActuallyRendered] = React.useState(false);

  React.useEffect(() => {
    setIsActuallyRendered(false);
  }, [modelUrl]);

  React.useEffect(() => {
    if (isActuallyRendered && onModelRendered) {
      const timer = setTimeout(() => {
        onModelRendered();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isActuallyRendered, onModelRendered]);

  const handleModelLoaded = React.useCallback(() => {
    setIsActuallyRendered(true);
  }, []);

  const leftToolbar = [
    { name: 'Picker', img: PickerSelect, onClick: () => onSelectViewportTool?.('Picker') },
    { name: 'Lasso', img: lassoTool, onClick: () => onSelectViewportTool?.('Lasso') },
    { name: 'Polygon', img: polygon, onClick: () => onSelectViewportTool?.('Polygon') },
    { name: 'Brush', img: brushSelect, onClick: () => onSelectViewportTool?.('Brush') },
    { name: 'Flood', img: floodSelect, onClick: () => onSelectViewportTool?.('Flood') },
    { name: 'Sphere', img: earthSphereLine, onClick: () => onSelectViewportTool?.('Sphere') },
    { name: 'Square', img: squareSelect, onClick: () => onSelectViewportTool?.('Square') },
    { name: 'Fly Through', img: flyThrough, onClick: () => { onSelectViewportTool?.('Fly Through'); onToggleAutoRotate?.(); } },
    { name: 'Hotspot', img: hotspot, onClick: () => onSelectViewportTool?.('Hotspot') },
    { name: 'Delete', img: trash, onClick: () => onResetTransform?.() },
  ];

  const bottomActions = [
    { name: 'Undo', img: undo, onClick: () => onViewportUndo?.() },
    { name: 'Redo', img: redo, onClick: () => onViewportRedo?.() },
    { name: 'Auto Rotate', img: selection, onClick: () => onToggleAutoRotate?.(), active: autoRotate },
    { name: 'Grid', img: setting, onClick: () => onToggleGrid?.(), active: gridVisible },
    { name: 'Help', img: help, onClick: () => onViewportHelp?.(), title: 'Drag to rotate | Right-click to pan | Scroll to zoom' },
    { name: 'Shadows', img: shadow, onClick: () => onToggleShadows?.(), active: shadowsEnabled },
    { name: 'Screenshot', img: camera, onClick: () => onViewportScreenshot?.() },
  ];

  return (
    <div
      className={`${
        expanded ? 'col-lg-9 col-md-8' : 'col-lg-6 col-md-8'
      } negative-margin contributor-card position-relative mt-lg-0 mt-4`}
    >
      <div className="contributor-banner d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex gap-3 align-items-center w-100 flex-column flex-sm-row">
          <div className="d-flex gap-3 align-items-center flex-grow-1">
            <div className="rocket-icon-wrapper flex-shrink-0">
              <Rocket size={24} color="#DE3996" />
            </div>
            <div className="text-start">
              <h6 className="fw-bold text-pink m-0">Join Our Contributor Account for Free!</h6>
              <p className="text-muted" style={{ fontSize: '11px', margin: 0 }}>
                Join thousands of 3D artists earning passive income from their creative work
              </p>
            </div>
          </div>
          <button className="btn-join-now flex-shrink-0 mt-2 mt-sm-0" style={{ cursor: "not-allowed", position: "relative", zIndex: 1000 }}>Join Now</button>
        </div>
      </div>

      <div
        id="model-viewport-section"
        ref={sectionRef}
        className="center-card-wrapper position-relative"
      >
        {showBlackOverlay && <div className="black-overlay fade-in"></div>}
        <div
          className={`d-flex align-items-center justify-content-center px-3 center-card ${modelReady ? 'center-card--no-padding' : ''
            }`}
        >
          {showLoadingUI ? (
            <div
              className={`model-loading-panel text-center fade-in w-100${showBlackOverlay ? ' model-loading-panel--overlay' : ''}`}
              style={{ maxWidth: '450px', position: 'relative', zIndex: 10 }}
            >
              <div className="progress-circle-wrapper mb-4">
                <svg className="progress-circle" width="120" height="120" viewBox="0 0 120 120">
                  <circle className="progress-circle-track" cx="60" cy="60" r="54" fill="none" strokeWidth="8" />
                  <circle
                    className="progress-circle-fill"
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="339.292"
                    strokeDashoffset={339.292 - (339.292 * progress) / 100}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-percent">{Math.round(progress)}%</span>
                </div>
              </div>
              <div className="model-loading-copy">
                <h3 className="model-loading-title fw-bold mb-2">
                  Creating your <span className="text-pink">model</span>
                </h3>
                <p className="model-loading-subtitle small mb-4">We are working on it, give us a minute</p>
              </div>
              <button
                className="btn btn-outline-pink mt-2"
                onClick={() => {
                  setShowLoadingUI(false);
                  setShowBlackOverlay(false);
                  setProgress(0);
                  resetAllInputs();
                }}
              >
                Cancel
              </button>
            </div>
          ) : showQueueUI ? (
            <div className="text-center queue-ui fade-in w-100" style={{ maxWidth: '450px' }}>
              <div className="q-orb-main mb-4">
                <div className="q-inner-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <h3 className="fw-bold">
                <span className="text-pink">In</span> Queue
              </h3>
              <p className="text-muted small">
                Waiting for processing
                <br />
                Almost there! Hang tight...
              </p>
              <div className="q-orb-footer mt-5">
                <div className="q-inner-icon pink">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          ) : showSuccessUI ? (
            <div className="text-center fade-in w-100" style={{ maxWidth: '450px' }}>
              <img
                src={SeamlessCart}
                className="img-success-main mb-4"
                alt="Success"
                style={{ width: '250px' }}
              />
              <h3 className="fw-bold">
                Submitted <span className="text-pink">Successfully!</span>
              </h3>
              <p className="text-muted small mt-2">
                Your model generation request has been successfully submitted.
              </p>
              <div className="mt-5">
                <img src={sendCart} className="img-send-cart" alt="Icon" style={{ width: '160px' }} />
              </div>
            </div>
          ) : modelReady && modelUrl ? (
            <div className="viewport-section w-100">
              <div className="viewport-content">
                {!isActuallyRendered && (
                  <div className="model-loading-overlay">
                    <div className="spinner-border text-pink" role="status"></div>
                    <p className="model-loading-text">Initializing 3D View...</p>
                  </div>
                )}
                <div className="layered-background">
                  <div className="background-layer pattern-layer"></div>
                  <div className="background-layer grid-layer"></div>
                  <div className="control-icons-panel">
                    {leftToolbar.map((tool) => (
                      <button
                        key={tool.name}
                        type="button"
                        className={`control-icon-btn${activeViewportTool === tool.name ? ' active' : ''}`}
                        onClick={tool.onClick}
                        title={tool.name}
                        aria-label={tool.name}
                      >
                        <img src={tool.img} alt={tool.name} className="control-icon" />
                      </button>
                    ))}
                  </div>
                  <div className="first-image-overlay"></div>
                  <div className="modal-image-center" ref={modelViewerRef}>
                    <ModelViewer
                      modelUrl={modelUrl}
                      onModelLoaded={handleModelLoaded}
                      transformControls={transformControls}
                      shadowsEnabled={shadowsEnabled}
                      gridVisible={gridVisible}
                      autoRotate={autoRotate}
                    />
                  </div>
                </div>
                <div className="right-action-buttons">
                  {bottomActions.map((action) => (
                    <button
                      key={action.name}
                      type="button"
                      className={`action-btn${action.active ? ' active' : ''}`}
                      onClick={action.onClick}
                      title={action.title || action.name}
                      aria-label={action.name}
                    >
                      <img src={action.img} alt={action.name} className="action-icon" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 w-100">
              <div className="center-art-group mb-4">
                <div className="main-circle">
                  <img src={CenterBox} alt="" />
                </div>
                <div className="orb o1">
                  <img src={shine} alt="" />
                </div>
                <div className="orb o2">
                  <img src={ImgBox} alt="" />
                </div>
                <div className="orb o3">
                  <img src={layersIcon} alt="" />
                </div>
                <div className="orb o4">
                  <img src={vedioIcon} alt="" />
                </div>
              </div>
              <img
                src={blurStar}
                alt=""
                style={{ position: 'absolute', top: '60%', left: '65%' }}
              />
              <h4 className="fw-bold">
                <img src={blurStar} alt="" className="me-4" /> Choose your{' '}
                <span className="text-pink">input</span> method
              </h4>
              <p className="center-para">
                Turn prompts, images, or videos into stunning 3D models. Let's <br /> build something
                great.
              </p>
              <div className="d-flex justify-content-between mt-5 text-center">
                <div className="feat-item d-flex flex-column align-items-center">
                  <div className="feat-icon">
                    <Zap size={20} />
                  </div>
                  <span className="x-small fw-bold">Fast Generation</span>
                </div>
                <div className="feat-item d-flex flex-column align-items-center">
                  <div className="feat-icon">
                    <Palette size={20} />
                  </div>
                  <span className="x-small fw-bold">High Quality</span>
                </div>
                <div className="feat-item d-flex flex-column align-items-center">
                  <div className="feat-icon">
                    <Download size={20} />
                  </div>
                  <span className="x-small fw-bold">Easy Export</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default CenterScan;