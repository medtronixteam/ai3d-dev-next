import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import CustomLoader from '../../components/loader/CustomLoader';
import './SplatViewer.css';

const SplatViewer = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [splatUrl, setSplatUrl] = useState('');
  const [error, setError] = useState('');
  const [viewerType, setViewerType] = useState('placeholder'); // 'placeholder', 'threejs', 'iframe'
  const viewerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseURL}/project/detail/${id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        
        const data = await response.json();
        const projectData = data?.data?.project;
        
        if (!projectData) {
          throw new Error('Project not found');
        }
        
        setProject(projectData);
        
        // Get splat file URL from project data
        // Adjust these field names based on your API response
        const splatFileUrl = projectData.splat_file_url || 
                           projectData.splat_url || 
                           projectData.file_url ||
                           projectData.splat_file ||
                           projectData.output_file;
        
        if (splatFileUrl) {
          setSplatUrl(splatFileUrl);
          // Determine viewer type based on file extension
          if (splatFileUrl.includes('.splat') || splatFileUrl.includes('.ply')) {
            setViewerType('threejs');
          } else if (splatFileUrl.includes('.html') || splatFileUrl.includes('.viewer')) {
            setViewerType('iframe');
          } else {
            setViewerType('placeholder');
          }
        } else {
          setError('Splat file not found in project data');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id && token) {
      fetchProject();
    }
  }, [id, token]);

  useEffect(() => {
    if (splatUrl && viewerRef.current && viewerType === 'threejs') {
      initializeThreeJSViewer();
    } else if (splatUrl && viewerRef.current && viewerType === 'iframe') {
      initializeIframeViewer();
    } else if (splatUrl && viewerRef.current) {
      initializePlaceholderViewer();
    }
  }, [splatUrl, viewerType]);

  const initializeThreeJSViewer = async () => {
    try {
      // Dynamically import Three.js
      const THREE = await import('three');
      
      // Clear previous content
      if (viewerRef.current) {
        viewerRef.current.innerHTML = '';
      }

      // Create scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a1a);
      sceneRef.current = scene;

      // Create camera
      const camera = new THREE.PerspectiveCamera(
        75,
        viewerRef.current.clientWidth / viewerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
      cameraRef.current = camera;

      // Create renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(viewerRef.current.clientWidth, viewerRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      viewerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      scene.add(directionalLight);

      // Add a placeholder cube (you'll replace this with actual splat loading)
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial({ color: 0xe63399 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();

      // Handle window resize
      const handleResize = () => {
        if (camera && renderer && viewerRef.current) {
          camera.aspect = viewerRef.current.clientWidth / viewerRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(viewerRef.current.clientWidth, viewerRef.current.clientHeight);
        }
      };
      window.addEventListener('resize', handleResize);

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        if (renderer) {
          renderer.dispose();
        }
      };

    } catch (err) {
      console.error('Error initializing Three.js viewer:', err);
      setError('Failed to initialize 3D viewer. Please try again.');
    }
  };

  const initializeIframeViewer = () => {
    if (viewerRef.current) {
      viewerRef.current.innerHTML = `
        <iframe 
          src="${splatUrl}" 
          style="width: 100%; height: 100%; border: none;"
          title="3D Model Viewer"
        ></iframe>
      `;
    }
  };

  const initializePlaceholderViewer = () => {
    if (viewerRef.current) {
      viewerRef.current.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #1a1a1a; color: white;">
          <div style="text-align: center; padding: 40px;">
            <h3 style="margin-bottom: 20px; color: #e63399;">3D Model Viewer</h3>
            <p style="margin-bottom: 20px; color: #ccc;">Splat file loaded successfully!</p>
            <p style="margin-bottom: 30px; color: #888; font-size: 14px;">File: ${splatUrl.split('/').pop()}</p>
            <div style="display: flex; gap: 16px; justify-content: center;">
              <button onclick="window.open('${splatUrl}', '_blank')" style="padding: 12px 24px; background: #e63399; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
                Download File
              </button>
              <button onclick="window.open('${splatUrl}', '_blank')" style="padding: 12px 24px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer; font-size: 14px;">
                Open in New Tab
              </button>
            </div>
            <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 8px;">
              <p style="margin: 0; color: #888; font-size: 12px;">
                To view this splat file, you can:<br/>
                1. Download and open with a compatible viewer<br/>
                2. Use an online splat viewer<br/>
                3. Install a splat viewer application
              </p>
            </div>
          </div>
        </div>
      `;
    }
  };

  const handleBack = () => {
    navigate(`/preview/${id}`);
  };

  const handleDownload = () => {
    if (splatUrl) {
      window.open(splatUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="splat-viewer-container">
        <div className="splat-header">
          <button className="back-button" onClick={handleBack}>
            ← Back to Preview
          </button>
        </div>
        <div className="splat-content">
          <CustomLoader />
          <p>Loading splat viewer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="splat-viewer-container">
        <div className="splat-header">
          <button className="back-button" onClick={handleBack}>
            ← Back to Preview
          </button>
        </div>
        <div className="splat-content">
          <div className="error-message">
            <h3>Error Loading Splat File</h3>
            <p>{error}</p>
            <button onClick={handleBack} className="retry-button">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="splat-viewer-container">
      <div className="splat-header">
        <button className="back-button" onClick={handleBack}>
          ← Back to Preview
        </button>
        <div className="splat-title">
          <h2>{project?.title || '3D Model Viewer'}</h2>
          <p style={{ margin: 0, fontSize: 12, color: '#888' }}>
            {viewerType === 'threejs' ? '3D Renderer' : 
             viewerType === 'iframe' ? 'Embedded Viewer' : 'File Viewer'}
          </p>
        </div>
        <div className="splat-controls">
          <button className="control-button" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>
      
      <div className="splat-content">
        <div className="viewer-container" ref={viewerRef}>
          {/* Viewer will be initialized here based on viewerType */}
        </div>
      </div>
    </div>
  );
};

export default SplatViewer; 