import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Download, Copy, Edit2, Rocket, Share, Edit } from 'lucide-react';
import { toast } from 'react-toastify';

// Icons/Images
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
import CenterBox from '../../pages/images/icons/center-box.svg';
import Logo from '../../pages/images/logo.png';
import CarModel from '../../pages/images/icons/car-model.png';
import fullScreen from '../../pages/images/icons/full-screen.png';
import ModelViewer from '../../components/scan/ModelViewer';

import './ModelViewUnique.css';

const ModelView = () => {
  const location = useLocation();
  const [modelUrl, setModelUrl] = useState('');
  const [isActuallyRendered, setIsActuallyRendered] = useState(false);

  // Toolbars State
  const [activeTool, setActiveTool] = useState('Picker');
  const [shadowsEnabled, setShadowsEnabled] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  const [transformControls, setTransformControls] = useState({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
  });

  // Undo / Redo history
  const [historyStack, setHistoryStack] = useState([{
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlFromQuery = queryParams.get('url');
    const urlFromState = location.state?.modelUrl || location.state?.url || location.state?.projectId;

    if (urlFromQuery) {
      setModelUrl(urlFromQuery);
    } else if (urlFromState) {
      if (urlFromState.startsWith('http') || urlFromState.startsWith('/') || urlFromState.startsWith('blob:')) {
        setModelUrl(urlFromState);
      } else {
        setModelUrl(`/assets/images/mini_bot.glb`);
      }
    } else {
      setModelUrl('/assets/images/mini_bot.glb');
    }
  }, [location]);

  const handleTransformChange = (type, axis, value) => {
    let numericValue = parseFloat(value) || 0;
    if (type === 'scale') {
      numericValue = Math.max(-5, Math.min(5, numericValue));
    }
    setTransformControls((prev) => {
      const newControls = {
        ...prev,
        [type]: axis
          ? { ...prev[type], [axis]: numericValue }
          : numericValue,
      };

      // Push to history
      const newStack = historyStack.slice(0, historyIndex + 1);
      newStack.push(newControls);
      setHistoryStack(newStack);
      setHistoryIndex(newStack.length - 1);

      return newControls;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setTransformControls(historyStack[newIndex]);
      toast.info('Undo action performed');
    } else {
      toast.warning('Nothing to undo');
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setTransformControls(historyStack[newIndex]);
      toast.info('Redo action performed');
    } else {
      toast.warning('Nothing to redo');
    }
  };

  const handleToggleAutoRotate = () => {
    setAutoRotate(prev => !prev);
    toast.info(`Auto-rotate ${!autoRotate ? 'enabled' : 'disabled'}`);
  };

  const handleToggleShadows = () => {
    setShadowsEnabled(prev => !prev);
    toast.info(`Shadows ${!shadowsEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleToggleGrid = () => {
    setGridVisible(prev => !prev);
    toast.info(`Grid ${!gridVisible ? 'visible' : 'hidden'}`);
  };

  const handleHelp = () => {
    toast.info(
      "💡 Controls: Drag to Rotate | Right-Click + Drag to Pan | Scroll to Zoom. Use the Transform Panel to adjust values.",
      { autoClose: 5000 }
    );
  };

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `3d_capture_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Screenshot captured and downloaded!');
    } else {
      toast.error('3D viewer not loaded yet');
    }
  };

  const handleReset = () => {
    const defaultState = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 1,
    };
    setTransformControls(defaultState);

    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(defaultState);
    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);

    toast.info('Model transformations reset');
  };

  const handleExport = async () => {
    if (!modelUrl) return;
    try {
      const link = document.createElement('a');
      link.href = modelUrl;
      link.setAttribute('download', `model_${Date.now()}.glb`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Model export started!');
    } catch (err) {
      console.error('Export failed', err);
      toast.error('Failed to export model');
    }
  };

  const handleCopy = () => {
    if (!modelUrl) return;
    navigator.clipboard.writeText(modelUrl);
    toast.success('Model URL copied to clipboard!');
  };

  const leftToolbar = [
    { name: 'Picker', img: PickerSelect, onClick: () => { setActiveTool('Picker'); toast.info('Picker tool active'); } },
    { name: 'Lasso', img: lassoTool, onClick: () => { setActiveTool('Lasso'); toast.info('Lasso selection tool active'); } },
    { name: 'Polygon', img: polygon, onClick: () => { setActiveTool('Polygon'); toast.info('Polygon selection tool active'); } },
    { name: 'Brush', img: brushSelect, onClick: () => { setActiveTool('Brush'); toast.info('Brush paint tool active'); } },
    { name: 'Flood', img: floodSelect, onClick: () => { setActiveTool('Flood'); toast.info('Flood fill tool active'); } },
    { name: 'Sphere', img: earthSphereLine, onClick: () => { setActiveTool('Sphere'); toast.info('Sphere bounding tool active'); } },
    { name: 'Square', img: squareSelect, onClick: () => { setActiveTool('Square'); toast.info('Square boundary tool active'); } },
    { name: 'Fly Through', img: flyThrough, onClick: () => { setActiveTool('Fly Through'); handleToggleAutoRotate(); } },
    { name: 'Hotspot', img: hotspot, onClick: () => { setActiveTool('Hotspot'); toast.info('Hotspot placement active'); } },
    { name: 'Delete', img: trash, onClick: handleReset },
  ];

  const bottomActions = [
    { name: 'Undo', img: undo, onClick: handleUndo },
    { name: 'Redo', img: redo, onClick: handleRedo },
    { name: 'Auto Rotate', img: selection, onClick: handleToggleAutoRotate },
    { name: 'Shadows', img: shadow, onClick: handleToggleShadows },
    { name: 'Grid', img: earthSphereLine, onClick: handleToggleGrid },
    { name: 'Help', img: help, onClick: handleHelp },
    { name: 'Screenshot', img: camera, onClick: handleScreenshot },
  ];

  return (
    <div className="a3d-app-container main-wrapper">
      {/* Header Section */}
      <header className="a3d-header">
        <div className="a3d-header-left mt-3 ms-2">
          <Link to="/3dio">
            <img src={Logo} alt="A3D Logo" className="platform-logo" style={{ cursor: 'pointer' }} />
          </Link>
        </div>

        <div className="a3d-header-center mt-3">
          <div className="a3d-promo-banner">
            <div className="a3d-rocket-circle">
              <Rocket size={18} />
            </div>
            <div className="a3d-promo-text">
              <strong>Join Our Contributor Account for Free!</strong>
              <span>
                Join thousands of 3D artists earning passive income from their creative work
              </span>
            </div>
            <button className="a3d-join-btn" style={{ cursor: "not-allowed", position: "relative", zIndex: 1000 }}>Join Now</button>
          </div>
        </div>

        <div className="a3d-header-right">{/* Add other nav icons here if needed */}</div>
      </header>

      <main className="container-fluid pt-0 p-3 ps-0">
        <div className="row g-3">
          {/* Main Viewport */}
          <div className="col-lg-9">
            <div className="a3d-viewport-box">
              {/* Left Vertical Toolbar */}
              <aside className="a3d-toolbar-left">
                {leftToolbar.map((tool) => (
                  <div key={tool.name} className="a3d-tip-wrapper">
                    <button
                      className={`a3d-icon-btn ${activeTool === tool.name ? 'active' : ''}`}
                      onClick={tool.onClick}
                    >
                      <img src={tool.img} alt={tool.name} style={activeTool === tool.name ? { filter: 'hue-rotate(90deg) brightness(1.2)' } : {}} />
                    </button>
                    <span className="a3d-custom-tooltip">{tool.name}</span>
                  </div>
                ))}
              </aside>

              {/* Model Render Area */}
              <div className="a3d-render-canvas" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '500px' }}>
                {!isActuallyRendered && modelUrl && (
                  <div className="model-loading-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F8F9FA',
                    zIndex: 20,
                    borderRadius: '12px'
                  }}>
                    <div className="spinner-border text-pink" role="status"></div>
                    <p className="mt-3 fw-bold text-dark">Initializing 3D View...</p>
                  </div>
                )}
                {modelUrl ? (
                  <ModelViewer
                    modelUrl={modelUrl}
                    onModelLoaded={() => setIsActuallyRendered(true)}
                    transformControls={transformControls}
                    shadowsEnabled={shadowsEnabled}
                    gridVisible={gridVisible}
                    autoRotate={autoRotate}
                  />
                ) : (
                  <img src={CarModel} alt="3D Model" className="a3d-main-model" />
                )}
              </div>

              {/* Bottom Left Status */}
              <div className="a3d-status-badge">
                <img src={CenterBox} alt="" />
                <span>
                  Position X:{transformControls.position.x || 0} | Y:{transformControls.position.y || 0} | Z:
                  {transformControls.position.z || 0}
                </span>
              </div>

              {/* Bottom Horizontal Toolbar */}
              <footer className="a3d-toolbar-bottom">
                {bottomActions.map((action) => (
                  <div key={action.name} className="a3d-tip-wrapper">
                    <button className="a3d-icon-btn" onClick={action.onClick} title={action.name}>
                      <img src={action.img} alt={action.name} />
                    </button>
                    <span className="a3d-custom-tooltip">{action.name}</span>
                  </div>
                ))}
              </footer>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="col-lg-3">
            <div className="a3d-sidebar-panel">
              <div className="a3d-panel-title">
                <img src={fullScreen} alt="" />
                <h5>Transform Controls</h5>
              </div>

              {/* Transform Inputs */}
              <div className="a3d-control-section">
                <label>Position</label>
                <div className="a3d-input-row">
                  {['X', 'Y', 'Z'].map((axis) => (
                    <div key={axis} className="a3d-field">
                      <span>{axis}</span>
                      <input
                        type="number"
                        value={transformControls.position[axis.toLowerCase()]}
                        onChange={(e) =>
                          handleTransformChange('position', axis.toLowerCase(), e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="a3d-control-section">
                <label>Rotation (degree)</label>
                <div className="a3d-input-row">
                  {['X', 'Y', 'Z'].map((axis) => (
                    <div key={axis} className="a3d-field">
                      <span>{axis}</span>
                      <input
                        type="number"
                        value={transformControls.rotation[axis.toLowerCase()]}
                        onChange={(e) =>
                          handleTransformChange('rotation', axis.toLowerCase(), e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="a3d-control-section">
                <label>Scale</label>
                <div className="a3d-field w-100">
                  <input
                    type="number"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={transformControls.scale}
                    onChange={(e) => handleTransformChange('scale', '', e.target.value)}
                    className="text-start ps-2"
                  />
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="export-button-bar">
                <button className="export-action-btn small" onClick={handleCopy} title="Copy Model Link">
                  <Copy size={14} className="action-icon" />
                </button>
                <button className="export-action-btn small" onClick={handleCopy} title="Share Model Link">
                  <Share size={14} className="action-icon" />
                </button>
                <button className="export-action-btn export" onClick={handleExport} title="Export GLB">
                  <Download size={14} className="me-1" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelView;
