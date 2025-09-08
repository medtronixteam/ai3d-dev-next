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
        // For text_to_3d projects, the URL pattern is specific
        let splatFileUrl = projectData.splat_file_url || 
                          projectData.splat_url || 
                          projectData.file_url ||
                          projectData.splat_file ||
                          projectData.output_file;
        
        // If it's a text_to_3d project and we have the project ID, construct the URL
        if ((projectData.type === 'text_to_3d' || projectData.type === 'prompt_to_3d') && 
            !splatFileUrl && id) {
          splatFileUrl = `https://storage.googleapis.com/ai3dscanning_crm/prompt3Dmodel/${id}/output_model.glb`;
        }
        
        if (splatFileUrl) {
          setSplatUrl(splatFileUrl);
          // Determine viewer type based on file extension and project type
          if (splatFileUrl.includes('.glb') || splatFileUrl.includes('.gltf')) {
            setViewerType('threejs');
          } else if (splatFileUrl.includes('.splat') || splatFileUrl.includes('.ply')) {
            setViewerType('threejs');
          } else if (splatFileUrl.includes('.html') || splatFileUrl.includes('.viewer')) {
            setViewerType('iframe');
          } else if (projectData.type === 'text_to_3d' || projectData.type === 'prompt_to_3d') {
            // For text_to_3d projects, default to threejs viewer
            setViewerType('threejs');
          } else {
            setViewerType('placeholder');
          }
        } else {
          setError('3D model file not found in project data');
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
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      
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
      camera.position.set(0, 0, 5);
      cameraRef.current = camera;

      // Create renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(viewerRef.current.clientWidth, viewerRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      viewerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Add point lights for better illumination
      const pointLight1 = new THREE.PointLight(0xe63399, 0.5, 100);
      pointLight1.position.set(-10, 10, 10);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x4a90e2, 0.5, 100);
      pointLight2.position.set(10, -10, -10);
      scene.add(pointLight2);

      // Add orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.enablePan = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;

      // Load GLB model through backend proxy to avoid CORS issues
      const proxyUrl = `${baseURL}/project/download/${id}`;
      
      // Show loading indicator
      const loadingDiv = document.createElement('div');
      loadingDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        text-align: center;
        z-index: 1000;
      `;
      loadingDiv.innerHTML = `
        <div style="margin-bottom: 20px;">
          <div style="width: 60px; height: 60px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid #e63399; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
        <p>Loading 3D model...</p>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      viewerRef.current.appendChild(loadingDiv);
      
      const loader = new GLTFLoader();
      loader.load(
        proxyUrl,
        (gltf) => {
          // Remove loading indicator
          if (loadingDiv.parentNode) {
            loadingDiv.parentNode.removeChild(loadingDiv);
          }

          const model = gltf.scene;
          
          // Center the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Scale model to fit in view
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 3 / maxDim;
          model.scale.setScalar(scale);
          
          // Center the model
          model.position.sub(center.multiplyScalar(scale));
          
          // Enable shadows for all meshes
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          scene.add(model);
          
          // Adjust camera position based on model size
          const distance = maxDim * 2;
          camera.position.set(distance, distance, distance);
          camera.lookAt(0, 0, 0);
          controls.target.set(0, 0, 0);
          controls.update();
        },
        (progress) => {
          // Update loading progress
          const percent = Math.round((progress.loaded / progress.total) * 100);
          loadingDiv.innerHTML = `
            <div style="margin-bottom: 20px;">
              <div style="width: 60px; height: 60px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid #e63399; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
            <p>Loading 3D model... ${percent}%</p>
            <style>
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          `;
        },
        (error) => {
          console.error('Error loading GLB model:', error);
          if (loadingDiv.parentNode) {
            loadingDiv.parentNode.removeChild(loadingDiv);
          }
          
          // Show fallback with multiple viewing options
          viewerRef.current.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #1a1a1a; color: white;">
              <div style="text-align: center; padding: 40px;">
                <h3 style="margin-bottom: 20px; color: #e63399;">3D Model Viewer</h3>
                <p style="margin-bottom: 20px; color: #ccc;">Unable to load 3D model directly due to CORS restrictions.</p>
                <p style="margin-bottom: 30px; color: #888; font-size: 14px;">File: ${splatUrl.split('/').pop()}</p>
                <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                  <button onclick="window.open('${splatUrl}', '_blank')" style="padding: 12px 24px; background: #e63399; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    Download GLB File
                  </button>
                  <button onclick="window.open('https://threejs.org/editor/', '_blank')" style="padding: 12px 24px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer; font-size: 14px;">
                    Open in Three.js Editor
                  </button>
                  <button onclick="window.open('https://gltf-viewer.donmccurdy.com/', '_blank')" style="padding: 12px 24px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer; font-size: 14px;">
                    Open in GLTF Viewer
                  </button>
                  <button onclick="window.open('https://sandbox.babylonjs.com/', '_blank')" style="padding: 12px 24px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer; font-size: 14px;">
                    Open in Babylon.js
                  </button>
                </div>
                <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                  <p style="margin: 0; color: #888; font-size: 12px;">
                    To view this GLB file, you can:<br/>
                    1. Download and open with a 3D viewer<br/>
                    2. Use the Three.js Editor online<br/>
                    3. Use the GLTF Viewer online<br/>
                    4. Use Babylon.js Sandbox<br/>
                    5. Install a local 3D viewer application
                  </p>
                </div>
              </div>
            </div>
          `;
        }
      );

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
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
          <button className="control-button" onClick={() => window.open(splatUrl, '_blank')}>
            Download
          </button>
          <button className="control-button" onClick={() => {
            if (viewerRef.current && viewerRef.current.querySelector('canvas')) {
              const canvas = viewerRef.current.querySelector('canvas');
              const link = document.createElement('a');
              link.download = `${project?.title || '3d-model'}.png`;
              link.href = canvas.toDataURL();
              link.click();
            }
          }}>
            Screenshot
          </button>
        </div>
      </div>
      
      <div className="splat-content">
        <div className="viewer-container" ref={viewerRef}>
          {/* Splat viewer will be initialized here */}
        </div>
      </div>
    </div>
  );
};

export default SplatViewer; 