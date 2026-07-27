import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ModelViewer from '../../components/scan/ModelViewer';
import { fetchPublicProject } from '../../utils/publicProjectShare';
import './PublicProjectPage.css';

const PublicProjectPage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modelUrl, setModelUrl] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadProject = async () => {
      if (!slug) {
        setError('Invalid share link.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const result = await fetchPublicProject(slug);

        if (cancelled) return;

        if (!result.modelUrl) {
          throw new Error('Model file not available for this project.');
        }

        setModelUrl(result.modelUrl);
      } catch (err) {
        if (cancelled) return;
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'This shared project could not be loaded.',
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="public-project-page">
      {loading && (
        <div className="public-project-overlay">
          <div className="spinner-border text-pink" role="status" />
        </div>
      )}

      {!loading && error && (
        <div className="public-project-overlay public-project-overlay--error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && modelUrl && (
        <div className="public-project-viewer-fullscreen">
          <ModelViewer
            modelUrl={modelUrl}
            onModelLoaded={() => {}}
            autoRotate
            gridVisible={false}
          />
        </div>
      )}
    </div>
  );
};

export default PublicProjectPage;
