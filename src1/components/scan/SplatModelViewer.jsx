import React, { useEffect, useRef, useState } from 'react';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

const isSplatUrl = (url = '') => {
  const clean = String(url).split('?')[0].toLowerCase();
  return (
    clean.endsWith('.splat') ||
    clean.endsWith('.ply') ||
    clean.endsWith('.ksplat') ||
    clean.endsWith('.spz') ||
    clean.endsWith('.sog') ||
    clean.includes('/splats/')
  );
};

const SplatModelViewer = ({
  modelUrl,
  onModelLoaded,
  autoRotate = false,
}) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const onLoadedRef = useRef(onModelLoaded);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onLoadedRef.current = onModelLoaded;
  }, [onModelLoaded]);

  useEffect(() => {
    if (!modelUrl || !containerRef.current) return undefined;

    let cancelled = false;
    let viewer = null;

    const loadSplat = async () => {
      setLoading(true);
      setError(null);

      try {
        if (viewerRef.current) {
          try {
            viewerRef.current.dispose();
          } catch (_) {
            /* ignore dispose errors */
          }
          viewerRef.current = null;
        }

        containerRef.current.innerHTML = '';

        viewer = new GaussianSplats3D.Viewer({
          rootElement: containerRef.current,
          selfDrivenMode: true,
          sharedMemoryForWorkers: false,
          gpuAcceleratedSort: true,
          cameraUp: [0, -1, -0.6],
          initialCameraPosition: [-1, -4, 6],
          initialCameraLookAt: [0, 4, 0],
        });

        viewerRef.current = viewer;

        await viewer.addSplatScene(modelUrl, {
          showLoadingUI: false,
          progressiveLoad: true,
        });

        if (cancelled) {
          viewer.dispose();
          return;
        }

        viewer.start();
        setLoading(false);
        onLoadedRef.current?.();
      } catch (err) {
        console.error('Failed to load splat model:', err);
        if (!cancelled) {
          setError(err?.message || 'Failed to load splat model');
          setLoading(false);
        }
      }
    };

    loadSplat();

    return () => {
      cancelled = true;
      if (viewerRef.current) {
        try {
          viewerRef.current.dispose();
        } catch (_) {
          /* ignore */
        }
        viewerRef.current = null;
      }
    };
  }, [modelUrl]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer?.controls) return undefined;

    viewer.controls.autoRotate = Boolean(autoRotate);
    return undefined;
  }, [autoRotate]);

  return (
    <div
      className="splat-model-viewer"
      style={{ width: '100%', height: '100%', position: 'relative', background: '#F8F9FA' }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {loading && !error && (
        <div className="splat-model-viewer__overlay">
          <div className="spinner-border text-pink" role="status" />
          <p>Loading 3D splat...</p>
        </div>
      )}

      {error && (
        <div className="splat-model-viewer__overlay splat-model-viewer__overlay--error">
          <p className="fw-bold mb-1">Could not display splat model</p>
          <p className="small mb-0 text-muted">{error}</p>
        </div>
      )}
    </div>
  );
};

export { isSplatUrl };
export default SplatModelViewer;
