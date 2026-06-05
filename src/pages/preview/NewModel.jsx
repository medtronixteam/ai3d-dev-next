import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { baseURL } from '../../config';
import CustomLoader from '../../components/loader/CustomLoader';
import axios from 'axios';

const NewModel = () => {
  const { id: projectId } = useParams();
  const [searchParams] = useSearchParams();
  const mobileToken = searchParams.get('token');
  const bgColor = decodeURIComponent(searchParams.get('bg') || '#ffffff');

  const navigate = useNavigate();
  const [modelUrl, setModelUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const arParam = searchParams.get('ar');
  const isArEnabled = arParam === '1';
  const modelViewerRef = useRef(null);
  const [isModelRendering, setIsModelRendering] = useState(true);
  const [screenshotTaken, setScreenshotTaken] = useState(false);
  const [screenshotData, setScreenshotData] = useState(null);

  const addCacheBuster = (url) => {
    if (!url) return url;
    const isSigned = url.includes('Signature=') || 
                     url.includes('x-goog-signature=') || 
                     url.includes('X-Goog-Signature=') || 
                     url.includes('X-Amz-Signature=') || 
                     url.includes('sig=');
    if (isSigned) {
      return url;
    }
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_t=${Date.now()}`;
  };

  const fetchTempModelUrl = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${baseURL}/project/temp/url/${projectId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${mobileToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        navigate('/model/error/page', {
          state: { message: 'Invalid token or unauthorized request' },
        });
        return;
      }

      const data = await response.json();

      let url =
        data.url || data.temp_url || data.model_url || data.data?.url || data.data?.temp_url;

      if (!url) {
        navigate('/model/error/page', {
          state: { message: 'Model URL not returned' },
        });
        return;
      }

      url = url.replace(/\\\//g, '/').trim();
      const finalUrl = addCacheBuster(url);
      setIsModelRendering(true);
      setModelUrl(finalUrl);
    } catch (err) {
      navigate('/model/error/page', {
        state: { message: err.message },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mobileToken || !projectId) {
      navigate('/model/error/page', {
        state: { message: 'Missing token or project ID' },
      });
      return;
    }

    fetchTempModelUrl();
  }, []);

  const takeScreenshot = async () => {
    if (!modelViewerRef.current) {
      console.warn('Model viewer is not ready');
      return;
    }

    try {
      const blob = await modelViewerRef.current.toBlob({ mimeType: 'image/png' });

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result;
        setScreenshotData(base64data);
        setScreenshotTaken(true);

        console.log('Screenshot captured');
        await uploadScreenshot(base64data);
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Screenshot failed:', err);
    }
  };

  const uploadScreenshot = async (base64Image) => {
    try {
      const response = await axios.post(
        `${baseURL}/project/captured/ss`,
        {
          project_id: projectId,
          caputured_ss: base64Image,
        },
        {
          headers: {
            Authorization: `Bearer ${mobileToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Backend Screenshot Upload Response:', response.data);
    } catch (err) {
      console.error('Screenshot upload failed:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer || !modelUrl) return;

    const handleLoad = () => {
      setIsModelRendering(false);

      if (!screenshotTaken) {
        takeScreenshot();
      }
    };

    viewer.addEventListener('model-visibility', handleLoad);
    return () => viewer.removeEventListener('load', handleLoad);
  }, [modelUrl, screenshotTaken]);

  return (
    <div
      style={{
        background: bgColor,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
      }}
    >
      {modelUrl && (
        <div style={{ position: 'relative', width: '100%', height: '500px' }}>
          {(loading || isModelRendering) && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                color: '#fff',
              }}
            >
              <CustomLoader />
              <span style={{ marginTop: '3.5rem' }}>Loading your 3D model...</span>
            </div>
          )}

          <model-viewer
          ref={modelViewerRef}
          src={modelUrl}
          camera-controls
          auto-rotate
          {...(isArEnabled ? { ar: '' } : {})}
          ar-modes="webxr scene-viewer quick-look"
          style={{ width: '100%', height: '100%' }}
        />
        </div>
      )}
    </div>
  );
};

export default NewModel;
