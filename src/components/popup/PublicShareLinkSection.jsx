import React, { useEffect, useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { makeProjectPublic } from '../../utils/publicProjectShare';
import './PublicShareLinkSection.css';

const PublicShareLinkSection = ({ projectId, authToken }) => {
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) {
      setPublicUrl('');
      setError('Project not found.');
      setLoading(false);
      return;
    }

    if (!authToken) {
      setPublicUrl('');
      setError('Please log in to create a share link.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const generateLink = async () => {
      setLoading(true);
      setError('');
      setPublicUrl('');
      setCopied(false);

      try {
        const { url } = await makeProjectPublic(projectId, authToken);
        if (cancelled) return;

        if (!url) {
          throw new Error('Share link not returned from server.');
        }

        setPublicUrl(url);
      } catch (err) {
        if (cancelled) return;
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to create public share link.',
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    generateLink();

    return () => {
      cancelled = true;
    };
  }, [projectId, authToken]);

  const handleCopyLink = async () => {
    if (!publicUrl) return;

    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link.');
    }
  };

  return (
    <div className="public-share-section">
      <div className="public-share-divider">
        <span>Or share with link</span>
      </div>

      <p className="public-share-hint">
        Anyone with this link can view your 3D model without logging in.
      </p>

      {error && <div className="public-share-error">{error}</div>}

      {loading && (
        <div className="public-share-loading">
          <span className="public-share-loading-spinner" aria-hidden="true" />
          Creating share link...
        </div>
      )}

      {!loading && publicUrl && (
        <div className="public-share-link-card">
          <div className="public-share-link-row">
            <div className="public-share-link-box" title={publicUrl}>
              {publicUrl}
            </div>
            <button
              type="button"
              className={`public-share-copy-btn${copied ? ' copied' : ''}`}
              onClick={handleCopyLink}
              aria-label={copied ? 'Copied' : 'Copy link'}
              title={copied ? 'Copied' : 'Copy link'}
            >
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicShareLinkSection;
