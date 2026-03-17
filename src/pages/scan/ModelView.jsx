import React, { useState } from 'react';
import { Download, Copy, Edit2, Rocket, Share, Edit } from 'lucide-react';

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
import CenterBox from '../../pages/images/icons/center-box.svg';
import Logo from '../../pages/images/logo.png';
import CarModel from '../../pages/images/icons/car-model.png';
import fullScreen from '../../pages/images/icons/full-screen.png';

import './ModelViewUnique.css';

const ModelView = () => {
  const [transformControls, setTransformControls] = useState({
    position: { x: 45, y: 30, z: 60 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0,
  });

  const leftToolbar = [
    { name: 'Picker', img: PickerSelect },
    { name: 'Lasso', img: lassoTool },
    { name: 'Polygon', img: polygon },
    { name: 'Brush', img: brushSelect },
    { name: 'Flood', img: floodSelect },
    { name: 'Sphere', img: earthSphereLine },
    { name: 'Square', img: squareSelect },
    { name: 'Fly Through', img: flyThrough },
    { name: 'Hotspot', img: hotspot },
    { name: 'Delete', img: trash },
  ];

  const bottomActions = [
    { name: 'Undo', img: undo },
    { name: 'Redo', img: redo },
    { name: 'Select', img: selection },
    { name: 'Shadow', img: shadow },
    { name: 'Rotate', img: redo },
    { name: 'Scale', img: selection },
    { name: 'World', img: earthSphereLine },
    { name: 'Bounds', img: setting },
    { name: 'Help', img: help },
  ];

  return (
    <div className="a3d-app-container main-wrapper">
      {/* Header Section */}
      <header className="a3d-header">
        <div className="a3d-header-left mt-3 ms-2">
          <img src={Logo} alt="A3D Logo" className="a3d-logo" />
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
            <button className="a3d-join-btn">Join Now</button>
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
                    <button className="a3d-icon-btn">
                      <img src={tool.img} alt="" />
                    </button>
                    <span className="a3d-custom-tooltip">{tool.name}</span>
                  </div>
                ))}
              </aside>

              {/* Model Render Area */}
              <div className="a3d-render-canvas">
                <img src={CarModel} alt="3D Model" className="a3d-main-model" />
              </div>

              {/* Bottom Left Status */}
              <div className="a3d-status-badge">
                <img src={CenterBox} alt="" />
                <span>
                  Position X:{transformControls.position.x} | Y:{transformControls.position.y} | Z:
                  {transformControls.position.z}
                </span>
              </div>

              {/* Bottom Horizontal Toolbar */}
              <footer className="a3d-toolbar-bottom">
                {bottomActions.map((action) => (
                  <div key={action.name} className="a3d-tip-wrapper">
                    <button className="a3d-icon-btn">
                      <img src={action.img} alt="" />
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
                        defaultValue={transformControls.position[axis.toLowerCase()]}
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
                      <input type="number" defaultValue={0} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="a3d-control-section">
                <label>Scale</label>
                <div className="a3d-field w-100">
                  <input type="number" defaultValue={0} className="text-start ps-2" />
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="export-button-bar">
                    <button className="export-action-btn small">
                      <Edit size={14} className="action-icon" />
                    </button>
                    <button className="export-action-btn small">
                      <Share size={14} className="action-icon" />
                    </button>
                    <button className="export-action-btn export">
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
