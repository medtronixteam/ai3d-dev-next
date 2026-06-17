import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { baseURL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import './ModelReviewModal.css';

const RATING_OPTIONS = [
  { value: 1, label: 'Very Poor' },
  { value: 2, label: 'Poor' },
  { value: 3, label: 'Fair' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Excellent' },
];

const OTHER_OPTION = { value: 'other', label: 'Other' };

const NEGATIVE_OPTIONS = {
  text_to_3d: [
    { value: 'prompt_mismatch', label: 'Prompt mismatch' },
    { value: 'missing_parts', label: 'Missing parts' },
    { value: 'wrong_proportions', label: 'Wrong proportions' },
    { value: 'texture_material', label: 'Texture/material issues' },
    { value: 'low_detail', label: 'Low detail' },
    OTHER_OPTION,
  ],
  image_to_3d: [
    { value: 'source_mismatch', label: "Doesn't match source image" },
    { value: 'missing_parts', label: 'Missing parts' },
    { value: 'wrong_proportions', label: 'Wrong proportions' },
    { value: 'texture_material', label: 'Texture/material issues' },
    { value: 'low_detail', label: 'Low detail' },
    OTHER_OPTION,
  ],
};

const POSITIVE_OPTIONS = {
  text_to_3d: [
    { value: 'prompt_accuracy', label: 'Accurate to prompt' },
    { value: 'great_detail', label: 'Great detail & quality' },
    { value: 'good_proportions', label: 'Good proportions' },
    { value: 'nice_textures', label: 'Nice textures & materials' },
    { value: 'fast_generation', label: 'Fast generation' },
    OTHER_OPTION,
  ],
  image_to_3d: [
    { value: 'source_accuracy', label: 'Matches source image well' },
    { value: 'great_detail', label: 'Great detail & quality' },
    { value: 'good_proportions', label: 'Good proportions' },
    { value: 'nice_textures', label: 'Nice textures & materials' },
    { value: 'fast_generation', label: 'Fast generation' },
    OTHER_OPTION,
  ],
};

export const normalizeReviewProjectType = (type) => {
  if (!type) return 'text_to_3d';

  const normalized = String(type).toLowerCase();

  if (normalized === 'text_to_3d' || normalized === 'prompt') {
    return 'text_to_3d';
  }

  if (
    normalized.includes('image') ||
    normalized.includes('video') ||
    normalized === 'single_image_to_3d' ||
    normalized === 'multi_image_to_3d'
  ) {
    return 'image_to_3d';
  }

  return 'text_to_3d';
};

const ModelReviewModal = ({ isOpen, onClose, projectToken, projectType = 'text_to_3d' }) => {
  const { token } = useAuth();
  const [rating, setRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);
  const [issue, setIssue] = useState('');
  const [otherFeedback, setOtherFeedback] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reviewProjectType = normalizeReviewProjectType(projectType);
  const isPositiveRating = rating !== null && rating >= 4;

  const feedbackOptions = useMemo(() => {
    const optionSet = isPositiveRating ? POSITIVE_OPTIONS : NEGATIVE_OPTIONS;
    return optionSet[reviewProjectType] || optionSet.text_to_3d;
  }, [isPositiveRating, reviewProjectType]);

  const feedbackTitle = isPositiveRating
    ? 'What did you like most?'
    : 'What was the main issue?';

  const otherPlaceholder = isPositiveRating
    ? 'Tell us what you liked...'
    : 'Tell us more about the issue...';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setRating(null);
      setHoverRating(null);
      setIssue('');
      setOtherFeedback('');
      setSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setIssue('');
    setOtherFeedback('');
  }, [rating, reviewProjectType]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error('Please select a rating.');
      return;
    }

    if (issue === 'other' && !otherFeedback.trim()) {
      toast.error('Please share your feedback for "Other".');
      return;
    }

    if (!projectToken) {
      toast.error('Project not found.');
      return;
    }

    if (!token) {
      toast.error('Please log in to submit a review.');
      return;
    }

    const payload = {
      rating,
      main_issue: issue || null,
      feedback: issue === 'other' ? otherFeedback.trim() : null,
    };

    setSubmitting(true);

    try {
      await axios.post(`${baseURL}/models/${projectToken}/review`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Thank you for your feedback!');
      handleClose();
    } catch (err) {
      console.error('Review submit failed:', err);
      toast.error(err?.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoverRating ?? rating;

  return (
    <div
      className={`model-review-overlay${isVisible ? ' visible' : ''}`}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className={`model-review-modal${isVisible ? ' visible' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="model-review-title"
      >
        <button type="button" className="model-review-close" onClick={handleClose} aria-label="Close">
          <FiX size={20} />
        </button>

        <form onSubmit={handleSubmit} className="model-review-form">
          <h2 id="model-review-title" className="model-review-title">
            Rate this model
          </h2>
          <p className="model-review-subtitle">
            Your feedback helps us improve 3D generation quality.
          </p>

          <div className="model-review-stars" role="radiogroup" aria-label="Rate this model">
            {RATING_OPTIONS.map((option) => {
              const isActive = displayRating !== null && option.value <= displayRating;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={rating === option.value}
                  aria-label={`${option.value} – ${option.label}`}
                  className={`model-review-star-btn${rating === option.value ? ' selected' : ''}`}
                  onMouseEnter={() => setHoverRating(option.value)}
                  onMouseLeave={() => setHoverRating(null)}
                  onFocus={() => setHoverRating(option.value)}
                  onBlur={() => setHoverRating(null)}
                  onClick={() => setRating(option.value)}
                >
                  <span className={`model-review-star${isActive ? ' active' : ''}`} aria-hidden="true">
                    ⭐
                  </span>
                  <span className="model-review-tooltip" role="tooltip">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>

          {rating !== null && (
            <div
              className={`model-review-issues fade-in${isPositiveRating ? ' model-review-issues--positive' : ''}`}
              key={`${rating}-${reviewProjectType}`}
            >
              <h3 className="model-review-issues-title">{feedbackTitle}</h3>
              <div className="model-review-issue-list" role="radiogroup" aria-label={feedbackTitle}>
                {feedbackOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`model-review-issue-option${issue === option.value ? ' selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="review-issue"
                      value={option.value}
                      checked={issue === option.value}
                      onChange={() => setIssue(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>

              {issue === 'other' && (
                <textarea
                  className="model-review-textarea"
                  placeholder={otherPlaceholder}
                  value={otherFeedback}
                  onChange={(e) => setOtherFeedback(e.target.value)}
                  rows={3}
                />
              )}
            </div>
          )}

          <div className="model-review-actions">
            <button type="submit" className="model-review-submit" disabled={!rating || submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModelReviewModal;
