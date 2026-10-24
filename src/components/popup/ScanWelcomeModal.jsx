import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import logo from '../../pages/images/logo.png';
import './ScanWelcomeModal.css';

const USE_CASES = [
  '🎮 Game development',
  '🖨️ 3D printing',
  '🥽 AR / VR',
  '🛍️ E-commerce',
  '🏛️ Architecture & interiors',
  '🎬 Animation & film',
  '✨ Just curious',
];

const SOURCES = [
  '🔍 Google search',
  '▶️ YouTube',
  '📱 TikTok / Instagram',
  '𝕏 X / Twitter',
  '👽 Reddit',
  '💬 Discord / community',
  '🧰 AI tools directory',
  '🤝 Friend or colleague',
  '✏️ Other',
];

const Cube = () => (
  <div className="scan-onboard-scene">
    <div className="scan-onboard-cube">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  </div>
);

const ScanWelcomeModal = ({ isOpen, onClose, onCreateModel, onExploreModels }) => {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('');
  const [useCases, setUseCases] = useState([]);
  const [source, setSource] = useState('');

  useEffect(() => {
    if (!isOpen) return undefined;
    setStep(1);
    setMode('');
    setUseCases([]);
    setSource('');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const finish = (nextMode = mode) => {
    if (nextMode === 'gallery') onExploreModels?.();
    else onCreateModel?.();
  };

  const toggleUseCase = (label) => {
    setUseCases((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    );
  };

  return (
    <div className="scan-onboard" role="dialog" aria-modal="true" aria-label="Welcome">
      <button type="button" className="scan-onboard-close" onClick={onClose} aria-label="Close">
        <X size={18} />
      </button>

      <header className="scan-onboard-header">
        <div className="scan-onboard-logo">
          <img src={logo} alt="3DIO" />
        </div>
        <div className="scan-onboard-credits">
          <b>5</b> free generations
        </div>
      </header>

      <main className="scan-onboard-main">
        <div className="scan-onboard-wrap">
          <div className="scan-onboard-progress">
            <span>Step {step} of 4</span>
            <div className="scan-onboard-bar">
              <span style={{ width: `${(step / 4) * 100}%` }} />
            </div>
          </div>

          {step === 1 && (
            <section className="scan-onboard-step">
              <h1>
                What do you want to <em>create</em> first?
              </h1>
              <p className="scan-onboard-sub">
                Pick a starting point. You&apos;ll see your first 3D result in under a minute.
              </p>
              <div className="scan-onboard-cards">
                <button type="button" className="scan-onboard-card" onClick={() => { setMode('text'); setStep(2); }}>
                  <div className="scan-onboard-preview">
                    <div className="scan-onboard-typing">a red sneaker</div>
                    <span className="scan-onboard-arrow">→</span>
                    <Cube />
                  </div>
                  <h3>Text to 3D</h3>
                  <p>Describe an object and get a ready-to-use 3D model.</p>
                  <span className="scan-onboard-go">Try an example →</span>
                </button>
                <button type="button" className="scan-onboard-card" onClick={() => { setMode('image'); setStep(2); }}>
                  <div className="scan-onboard-preview">
                    <div className="scan-onboard-imgbox">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                    </div>
                    <span className="scan-onboard-arrow">→</span>
                    <Cube />
                  </div>
                  <h3>Image to 3D</h3>
                  <p>Upload a photo or sketch and turn it into a 3D model.</p>
                  <span className="scan-onboard-go">Upload an image →</span>
                </button>
                <button type="button" className="scan-onboard-card" onClick={() => { setMode('video'); setStep(2); }}>
                  <div className="scan-onboard-preview">
                    <div className="scan-onboard-vidbox" />
                    <span className="scan-onboard-arrow">→</span>
                    <Cube />
                  </div>
                  <h3>Video to 3D</h3>
                  <p>Scan an object or a space from a short video.</p>
                  <span className="scan-onboard-go">Upload a video →</span>
                </button>
              </div>
              <button
                type="button"
                className="scan-onboard-link"
                onClick={() => {
                  setMode('gallery');
                  setStep(2);
                }}
              >
                Just exploring? Browse the gallery
              </button>
            </section>
          )}

          {step === 2 && (
            <section className="scan-onboard-step">
              <h1>
                What will you use it <em>for</em>?
              </h1>
              <p className="scan-onboard-sub">
                Pick all that apply. We&apos;ll tailor templates and export formats for you.
              </p>
              <div className="scan-onboard-chips">
                {USE_CASES.map((label) => (
                  <button
                    key={label}
                    type="button"
                    className={`scan-onboard-chip${useCases.includes(label) ? ' on' : ''}`}
                    onClick={() => toggleUseCase(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="scan-onboard-actions">
                <button type="button" className="scan-onboard-link" onClick={() => setStep(3)}>
                  Skip for now
                </button>
                <button type="button" className="scan-onboard-btn" disabled={!useCases.length} onClick={() => setStep(3)}>
                  Continue
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="scan-onboard-step">
              <h1>
                Where did you <em>hear</em> about us?
              </h1>
              <p className="scan-onboard-sub">Just curious. It helps us know where to show up.</p>
              <div className="scan-onboard-chips">
                {SOURCES.map((label) => (
                  <button
                    key={label}
                    type="button"
                    className={`scan-onboard-chip${source === label ? ' on' : ''}`}
                    onClick={() => setSource(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="scan-onboard-actions">
                <button type="button" className="scan-onboard-link" onClick={() => setStep(4)}>
                  Skip for now
                </button>
                <button type="button" className="scan-onboard-btn" disabled={!source} onClick={() => setStep(4)}>
                  Continue
                </button>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="scan-onboard-step">
              <h1>
                Everything you need, <em>in one place</em>
              </h1>
              <p className="scan-onboard-sub">
                From a first idea to a rigged, edited model that&apos;s ready to use.
              </p>
              <div className="scan-onboard-features">
                <div className="scan-onboard-feature">
                  <div className="scan-onboard-preview">
                    <div className="scan-onboard-typing">a robot knight</div>
                    <span className="scan-onboard-arrow">→</span>
                    <Cube />
                  </div>
                  <h3>
                    <span className="scan-onboard-num">1</span> Idea to 3D
                  </h3>
                  <p>Start with text, an image or a video, and get a 3D model in seconds.</p>
                </div>
                <div className="scan-onboard-feature">
                  <div className="scan-onboard-preview">
                    <svg className="scan-onboard-skel" viewBox="0 0 96 140" fill="none">
                      <g>
                        <circle className="head" cx="48" cy="18" r="13" />
                        <line x1="48" y1="31" x2="48" y2="80" />
                        <line x1="48" y1="42" x2="22" y2="66" />
                        <line x1="48" y1="42" x2="74" y2="66" />
                        <line x1="48" y1="80" x2="32" y2="124" />
                        <line x1="48" y1="80" x2="64" y2="124" />
                        <circle cx="48" cy="42" r="4" />
                        <circle cx="48" cy="80" r="4" />
                        <circle cx="22" cy="66" r="4" />
                        <circle cx="74" cy="66" r="4" />
                        <circle cx="32" cy="124" r="4" />
                        <circle cx="64" cy="124" r="4" />
                      </g>
                    </svg>
                  </div>
                  <h3>
                    <span className="scan-onboard-num">2</span> Add a skeleton
                  </h3>
                  <p>Auto-rig your model with bones so it&apos;s ready to pose and animate.</p>
                </div>
                <div className="scan-onboard-feature">
                  <div className="scan-onboard-preview">
                    <div className="scan-onboard-editor">
                      <div className="scan-onboard-tools">
                        <b />
                        <b />
                        <b />
                        <b />
                      </div>
                      <div className="scan-onboard-view">
                        <div className="scan-onboard-gizmo">
                          <i />
                          <i />
                          <i />
                        </div>
                        <Cube />
                      </div>
                    </div>
                  </div>
                  <h3>
                    <span className="scan-onboard-num">3</span> Edit in the browser
                  </h3>
                  <p>Move, scale, retexture and tweak your model, then export to GLB, FBX or STL.</p>
                </div>
              </div>
              <div className="scan-onboard-actions">
                <button type="button" className="scan-onboard-btn" onClick={() => finish()}>
                  Start creating
                </button>
              </div>
              <p className="scan-onboard-note">You have 5 free generations to start.</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default ScanWelcomeModal;
