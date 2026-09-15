import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import elipse from '../../pages/images/heading_ellipse.png';
import './InteractiveShowcaseSection.css';

const SHOWCASE_TABS = [
  {
    id: 'multimodal',
    title: 'Multimodal inputs',
    description:
      'Create detailed 3D models and environments from text prompts, single images, multi-angle photos, video captures, or 360° panoramas in approximately 30 seconds.',
    tags: ['Text-to-3D', 'Image-to-3D', 'Video Scan', '360° Panoramas'],
    badge: 'Multimodal Capture',
    videoId: 'ElOdxYgLfV0',
    caption: 'Multimodal 2D to 3D AI Generation',
  },
  {
    id: 'meshing',
    title: 'Sub-millimeter AI meshing',
    description:
      'Generate watertight 3D meshes with clean quad topology, sub-millimeter geometric accuracy, and photorealistic PBR texture maps automatically.',
    tags: ['Sub-mm Precision', 'PBR Materials', 'Auto UV Mapping', 'Quad Topology'],
    badge: 'Neural Meshing',
    videoId: 'ElOdxYgLfV0',
    caption: 'High-Precision Mesh & Texture Synthesis',
  },
  {
    id: 'studio',
    title: 'Interactive 3D editing',
    description:
      'Inspect, tweak textures, adjust lighting, decimate polygons, and edit geometry in real time inside our browser-based WebGL/WebXR studio without heavy software.',
    tags: ['Browser WebGL Studio', 'Real-time Relighting', 'Polygon Reduction', 'Texture Tweak'],
    badge: 'Cloud 3D Studio',
    videoId: 'ElOdxYgLfV0',
    caption: 'Real-time In-Browser 3D Studio',
  },
  {
    id: 'worlds',
    title: 'Expand and combine worlds',
    description:
      'Combine multiple scans into full-scale digital twins, indoor room captures, and persistent 3D spatial environments ready for simulation and virtual exploration.',
    tags: ['Digital Twins', 'Spatial Environments', 'Scene Composition', 'Room Scans'],
    badge: 'Spatial Environments',
    videoId: 'ElOdxYgLfV0',
    caption: 'Persistent 3D Worlds & Digital Twins',
  },
  {
    id: 'outputs',
    title: 'Versatile outputs & APIs',
    description:
      'Export production-ready assets into GLB, USDZ, OBJ, FBX, and STL with developer-friendly REST APIs for Unreal Engine, Unity, Blender, and WebXR.',
    tags: ['GLB & USDZ', 'OBJ / FBX / STL', 'Unreal & Unity Ready', 'REST Developer API'],
    badge: 'Production Exports',
    videoId: 'ElOdxYgLfV0',
    caption: 'Universal 3D Asset Export & Pipeline APIs',
  },
];

const InteractiveShowcaseSection = () => {
  // By default, no tab is expanded
  const [activeTabId, setActiveTabId] = useState(null);

  const activeTab = SHOWCASE_TABS.find((tab) => tab.id === activeTabId) || {
    badge: '3DIO AI Platform',
    videoId: 'ElOdxYgLfV0',
    caption: 'AI 3D Scanning & Mesh Generation Platform',
  };

  const handleTabClick = (tabId) => {
    // If clicked on currently active tab, collapse it; otherwise open the clicked tab
    setActiveTabId((prev) => (prev === tabId ? null : tabId));
  };

  return (
    <section className="showcase-section-wrapper py-5" id="video">
      <div className="container">
        {/* Header Title with Signature Ellipse */}
        <div className="showcase-header text-center mb-4">
          <motion.h2
            className="showcase-main-title"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            From Pixels To{' '}
            <span className="perfect-heading">
              W
              <span className="wr-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                o
                <img
                  src={elipse}
                  alt="Ellipse"
                  className="showcase-ellipse-img"
                />
              </span>
              rlds
            </span>
          </motion.h2>
          <motion.p
            className="showcase-subtitle mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            3DIO, our AI-powered 3D platform, generates spatially consistent, high-fidelity, and
            persistent 3D worlds and assets that you can move through, edit, and integrate anywhere.
          </motion.p>
        </div>

        {/* Content Row: Left Accordion Tabs & Right Media Showcase */}
        <div className="row align-items-center g-4 g-lg-5">
          {/* Left Column: Interactive Options */}
          <div className="col-lg-5 col-12">
            <div className="showcase-tabs-list">
              {SHOWCASE_TABS.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <div
                    key={tab.id}
                    className={`showcase-tab-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleTabClick(tab.id);
                      }
                    }}
                    aria-expanded={isActive}
                  >
                    <div className="showcase-tab-header d-flex align-items-center justify-content-between">
                      <h3 className="showcase-tab-title mb-0">{tab.title}</h3>
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          className="showcase-tab-body"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                        >
                          <p className="showcase-tab-desc">{tab.description}</p>
                          <div className="showcase-tags d-flex flex-wrap gap-2 mt-2">
                            {tab.tags.map((tag) => (
                              <span key={tag} className="showcase-tag-pill">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA Button (Using Project Theme Pink Color) */}
            <div className="showcase-cta-wrapper mt-4 pt-2">
              <Link to="/3dio/new/scan" className="showcase-cta-btn">
                <span>Start creating with 3DIO</span>
                <span className="showcase-cta-arrow">
                  <FiArrowRight size={18} />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Media Preview Card */}
          <div className="col-lg-7 col-12">
            <motion.div
              className="showcase-media-card position-relative"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="showcase-media-container">
                <iframe
                  className="showcase-video-iframe"
                  src={`https://www.youtube.com/embed/${activeTab.videoId || 'ElOdxYgLfV0'}?rel=0&playsinline=1`}
                  title="3DIO AI - AI Infra for 3D Creation from Image, Video & Text"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: 16,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveShowcaseSection;
