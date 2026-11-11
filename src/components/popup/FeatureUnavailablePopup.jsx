import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Sparkles, Clock, Compass, Layers, Video, Image as ImageIcon, Type, ArrowRight } from 'lucide-react';
import './FeatureUnavailablePopup.css';

/**
 * Helper to test whether an error response / message is "feature not available"
 */
export const isFeatureUnavailableError = (errOrMessage) => {
  if (!errOrMessage) return false;
  let text = '';
  if (typeof errOrMessage === 'string') {
    text = errOrMessage;
  } else if (typeof errOrMessage === 'object') {
    text =
      errOrMessage?.response?.data?.message ||
      errOrMessage?.response?.data?.error ||
      errOrMessage?.data?.message ||
      errOrMessage?.message ||
      '';
  }
  const str = String(text).toLowerCase().trim();
  return (
    str.includes('feature is not available') ||
    str.includes('not available yet') ||
    str.includes('feature unavailable') ||
    str.includes('feature not available') ||
    str.includes('feature is unavailable') ||
    str.includes('currently unavailable') ||
    str.includes('under development') ||
    str.includes('coming soon')
  );
};

export const dispatchFeatureUnavailable = (detail = {}) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('featureUnavailable', {
        detail: {
          title: detail.title || 'Feature Coming Soon',
          message: detail.message || 'This feature is not available yet.',
          ...detail,
        },
      }),
    );
  }
};

const getFeatureIcon = (featureName) => {
  const name = String(featureName || '').toLowerCase();
  if (name.includes('video')) return <Video size={30} />;
  if (name.includes('image')) return <ImageIcon size={30} />;
  if (name.includes('text') || name.includes('prompt')) return <Type size={30} />;
  if (name.includes('multi')) return <Layers size={30} />;
  return <Sparkles size={30} />;
};

const getFeatureTip = (featureName) => {
  const name = String(featureName || '').toLowerCase();
  if (name.includes('text') || name.includes('prompt')) {
    return 'You can try uploading a Single Image or Multiple Images to generate your 3D model in the meantime!';
  }
  if (name.includes('video')) {
    return 'You can try our Image to 3D or Multi-Image 3D reconstruction tools right now!';
  }
  return 'Explore our other available 3D generation tools while we prepare this feature!';
};

const FeatureUnavailablePopup = ({
  open = true,
  onClose,
  title = 'Feature Coming Soon',
  message = 'This feature is not available yet.',
  featureName = null,
}) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const tipText = getFeatureTip(featureName);
  const displayTitle = featureName ? `${featureName} - Coming Soon` : title;

  return (
    <div
      className="feature-unavailable-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fup-title"
    >
      <div className="feature-unavailable-card" onClick={(e) => e.stopPropagation()}>
        {/* Soft Ambient Glow */}
        <div className="feature-unavailable-ambient" aria-hidden="true" />

        {/* Close Button */}
        <button
          type="button"
          className="feature-unavailable-close"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

        {/* Multi-Layer Animated Visual Icon Area */}
        <div className="fup-visual-container">
          <div className="fup-orbit-ring fup-orbit-ring--outer" aria-hidden="true" />
          <div className="fup-orbit-ring fup-orbit-ring--inner" aria-hidden="true" />
          <div className="fup-glow-orb" aria-hidden="true" />

          <div className="fup-icon-core">
            {getFeatureIcon(featureName)}
          </div>

          {/* Floating animated sparkles */}
          <span className="fup-sparkle fup-sparkle--1" aria-hidden="true">✨</span>
          <span className="fup-sparkle fup-sparkle--2" aria-hidden="true">⭐</span>
          <span className="fup-sparkle fup-sparkle--3" aria-hidden="true">✨</span>
        </div>

        {/* Status Pill Badge */}
        <div className="fup-badge">
          <span className="fup-badge-pulse" aria-hidden="true" />
          <span className="fup-badge-dot" aria-hidden="true" />
          <span>Under Active Development</span>
        </div>

        {/* Title */}
        <h2 id="fup-title" className="feature-unavailable-title">
          {displayTitle}
        </h2>

        {/* Message */}
        <p className="feature-unavailable-desc">
          {message || 'This feature is not available yet. We are working hard to bring it to you soon!'}
        </p>

        {/* Inset Information Box */}
        <div className="feature-unavailable-info-box">
          <div className="feature-unavailable-info-icon">
            <Clock size={19} />
          </div>
          <div className="feature-unavailable-info-text">
            <strong>Our engineering team is actively training and fine-tuning</strong> this AI pipeline for photorealistic 3D generation. It will be enabled in an upcoming release!
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="feature-unavailable-tip">
          <span className="feature-unavailable-tip-label">💡 Tip:</span> {tipText}
        </div>

        {/* Actions */}
        <div className="feature-unavailable-actions">
          <button
            type="button"
            className="feature-unavailable-btn-primary"
            onClick={onClose}
          >
            <span>Got it, thanks!</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureUnavailablePopup;
