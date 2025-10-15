import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './SimplePage.css';
import { FiSearch, FiArrowRight, FiX } from 'react-icons/fi';
import search from '../../assets/images/search.svg';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import model1 from '../../assets/images/model-1.png';
import model2 from '../../assets/images/model-2.png';
import model3 from '../../assets/images/model-3.png';
import model4 from '../../assets/images/model-4.png';
import model5 from '../../assets/images/model-5.png';
import model6 from '../../assets/images/model-6.png';
import shoesImg from '../../assets/images/shoes.jpg';
import houseImg from '../../assets/images/products/dslr.png';
import characterImg from '../../assets/images/products/iPhone.png';
import carImg from '../../assets/images/products/Nike.png';
import droneImg from '../../assets/images/products/drone.png';
import headphoneImg from '../../assets/images/products/parfum.png';
import { useNavigate } from 'react-router-dom';
import { FaCross, FaHeart, FaReact, FaRegHeart } from 'react-icons/fa';
import scanImg from '../../assets/images/scan.svg';
import CustomLoader from '../../components/loader/CustomLoader';
import { FiTool } from 'react-icons/fi';
import { FaGamepad } from 'react-icons/fa';
import { GiVrHeadset, GiFactory } from 'react-icons/gi';
import { MdStore, MdMonitorHeart } from 'react-icons/md';
import Starfield from '../../components/effects/Starfield';
import videoGif from '../../assets/images/video.gif';
import darkGif from '../../assets/images/dark.gif';
import icon1 from '../../assets/images/icon1.svg';
import icon2 from '../../assets/images/icon2.svg';
import icon3 from '../../assets/images/icon3.svg';
import icon4 from '../../assets/images/icon4.svg';
import icon5 from '../../assets/images/icon5.svg';
import icon6 from '../../assets/images/icon6.svg';
import loadGif from '../../assets/images/load.gif';
import Paid from '../../assets/icon/Paid.svg';
import Fav from '../../assets/icon/Fav.svg';
import FavModels from '../../assets/icon/FavModels.svg';
import axios from 'axios';
import LoginPopup from '../../components/popup/LoginPopup';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const CATEGORIES = [
  { label: 'Construction', type: 'construction', icon: icon1, favorite: true },
  { label: 'Gaming', type: 'gaming', icon: icon2, favorite: true },
  { label: 'VR', type: 'vr', icon: icon3, favorite: true },
  { label: 'Retail', type: 'retail', icon: icon4, favorite: true },
  { label: 'Manufacturing', type: 'manufacturing', icon: icon5, favorite: true },
  { label: 'Health', type: 'health', icon: icon6, favorite: true },
];

const getModelImageUrl = (image) => {
  if (!image) return model1;
  if (image.startsWith('http')) return image;
  return `https://app.ai3dscanning.com/storage/${image.replace(/^\//, '')}`;
};

const getFullVideoUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `https://app.ai3dscanning.com/storage/${url.replace(/^\/+/, '')}`;
};

function VideoModalWithLoader({ videoUrl, onClose }) {
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [errorState, setErrorState] = React.useState(null); // New state for error type
  const timeoutRef = React.useRef(null);

  React.useEffect(() => {
    if (loading) {
      timeoutRef.current = setTimeout(() => {
        if (loading && !errorState) {
          setLoading(false);
          setErrorState('timeout');
          onClose();
        }
      }, 8000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [loading, errorState, onClose]);

  if (!videoUrl) return null;

  const safeUrl = getFullVideoUrl(videoUrl);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '16px auto',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {loading ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            background: 'rgba(0,0,0,0.7)',
          }}
        >
          <CustomLoader />
        </div>
      ) : errorState ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            zIndex: 11,
            padding: 20,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 10 }}>
            Video Could Not Be Played
          </p>
          <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 300, lineHeight: 1.5 }}>
            {errorState === 'timeout'
              ? 'The video took too long to load. Please try again.'
              : 'The video file may be corrupted, or the server is not serving it correctly.'}
          </p>
          <p style={{ fontSize: 14, opacity: 0.7, marginTop: 12, fontStyle: 'italic' }}>
            URL: {safeUrl.substring(0, 80)}...
          </p>
          <button
            onClick={onClose}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              backgroundColor: '#DE3996',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            Close
          </button>
        </div>
      ) : (
        <video
          src={safeUrl}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            borderRadius: 12,
            objectFit: 'cover',
            zIndex: 5,
          }}
          onLoadedData={() => {
            setLoading(false);
            setTimeout(() => setModalVisible(true), 100);
          }}
          onError={(err) => {
            console.error('Video failed to load:', err);
            setLoading(false);
            setErrorState('corrupted'); // Mark as file corruption/server misconfig
          }}
        />
      )}
    </div>
  );
}
const VideoModal = ({ open, videoUrl, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setModalVisible(true);
      timeoutRef.current = setTimeout(() => {
        if (loading) {
          setLoading(false);
          onClose();
        }
      }, 10000);
    } else {
      setModalVisible(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [open, videoUrl, loading, onClose]);

  if (!open) return null;

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
        }}
      >
        <CustomLoader />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        opacity: modalVisible ? 1 : 0,
        visibility: modalVisible ? 'visible' : 'hidden',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 24,
          right: 32,
          background: '#DE3996',
          border: 'none',
          borderRadius: '50%',
          width: 44,
          height: 44,
          color: '#fff',
          fontSize: 24,
          cursor: 'pointer',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Close video"
      >
        ×
      </button>
      <video
        ref={videoRef}
        src={getFullVideoUrl(videoUrl)} // ✅ Fixed: Use correct URL
        autoPlay
        loop
        muted
        playsInline
        controls
        style={{
          maxWidth: '90vw',
          maxHeight: '80vh',
          borderRadius: 16,
          background: '#000',
          boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
          zIndex: 10000,
          opacity: loading ? 0 : 1,
          visibility: loading ? 'hidden' : 'visible',
          transition: 'opacity 0.3s ease',
        }}
        onLoadedData={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setLoading(false);
          setTimeout(() => setModalVisible(true), 100);
        }}
        onError={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setLoading(false);
          console.error('Video failed to load');
        }}
      />
    </div>
  );
};

// Model Card Video Modal (for Explore → button)
function ModelCardVideoModal({ open, fileUrl, imageUrl, onClose }) {
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [mediaError, setMediaError] = React.useState(false);
  const [isVideoMode, setIsVideoMode] = React.useState(false);
  const timeoutRef = React.useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };

    // Check initial theme
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);


  // Detect file type by extension
  const getFileType = (url) => {
    if (!url) return null;
    const extension = url.split('.').pop().toLowerCase();
    if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(extension)) return 'video';
    if (['glb', 'gltf'].includes(extension)) return 'glb';
    return 'image';
  };

  React.useEffect(() => {
    if (open && fileUrl) {
      setLoading(true);
      setModalVisible(true);
      setMediaError(false);

      const type = getFileType(fileUrl);
      setIsVideoMode(type === 'video');

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        console.warn('⏰ Media loading timeout');
        setLoading(false);
        setMediaError(true);
      }, 20000);
    } else if (!open) {
      setModalVisible(false);
      setLoading(true);
      setMediaError(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [open, fileUrl]);

  const handleLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(false);
    setMediaError(false);
  };

  const handleError = (err) => {
    console.error('❌ Media failed to load:', err);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(false);
    setMediaError(true);
  };

  if (!open || !fileUrl) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(30,30,40,0.38)',
        transition: 'all 0.3s ease',
        opacity: modalVisible ? 1 : 0,
        visibility: modalVisible ? 'visible' : 'hidden',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          position: 'relative',
          background: isDarkMode ? '#23232a' : '#fff',
          borderRadius: 28,
          maxWidth: '720px',
          width: '97vw',
          maxHeight: '82vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          animation: 'modal-3d-pop-in 0.55s cubic-bezier(.25,1.7,.45,1.32)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'var(--primary-color)',
            border: 'none',
            borderRadius: '50%',
            width: 38,
            height: 38,
            color: '#fff',
            fontSize: 26,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
          aria-label="Close media"
        >
          <FiX size={18} />
        </button>

        {/* Loader */}
        {loading && !mediaError && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.15)',
            }}
          >
            <CustomLoader />
          </div>
        )}

        {/* Error fallback */}
        {mediaError && imageUrl && (
          <img
            src={imageUrl}
            alt="Fallback Preview"
            onLoad={handleLoad}
            onError={handleError}
            style={{
              maxWidth: '100%',
              maxHeight: '60vh',
              borderRadius: 18,
              background: 'transparent',
              objectFit: 'contain',
            }}
          />
        )}

        {/* Main Content */}
        {!mediaError && isVideoMode ? (
          <video
            src={fileUrl}
            autoPlay
            loop
            muted
            playsInline
            controls
            onLoadedData={handleLoad}
            onError={(err) => {
              console.warn('⚠️ Video failed — switching to image');
              setIsVideoMode(false);
              handleError(err);
            }}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              borderRadius: 18,
              background: 'transparent',
              opacity: loading ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }}
          />
        ) : (
          <img
            src={imageUrl}
            alt="Model Preview"
            onLoad={handleLoad}
            onError={handleError}
            style={{
              maxWidth: '100%',
              maxHeight: '60vh',
              borderRadius: 18,
              objectFit: 'contain',
              opacity: loading ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes modal-3d-pop-in {
          0% { transform: scale(0.7) rotateX(18deg) translateY(80px); opacity: 0; }
          60% { transform: scale(1.08) rotateX(-6deg) translateY(-12px); opacity: 1; }
          100% { transform: scale(1) rotateX(0) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ModernModal({
  open,
  onClose,
  children,
  width = 500,
  maxHeight = '80vh',
  showStarfield = false,
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(30,30,40,0.12)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'background 0.3s',
      }}
    >
      <div
        style={{
          position: 'relative',
          background: 'rgba(255,255,255,0.13)',
          borderRadius: 28,
          boxShadow: '0 16px 64px 0 rgba(30,30,60,0.22), 0 2px 16px 0 rgba(230,51,154,0.10)',
          maxWidth: width,
          width: '95vw',
          maxHeight,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          animation: 'modal-3d-pop-in 0.55s cubic-bezier(.25,1.7,.45,1.32)',
          transformStyle: 'preserve-3d',
          perspective: 1200,
          border: '1.5px solid rgba(230,51,154,0.10)',
          backdropFilter: 'blur(0px)',
        }}
      >
        {showStarfield && <Starfield />}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            zIndex: 10001,
            background: 'none',
            border: 'none',
            borderRadius: '50%',
            width: 38,
            height: 38,
            color: 'black',
            fontSize: 30,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'none',
          }}
          aria-label="Close modal"
        >
          ×
        </button>
        <div
          style={{
            width: '100%',
            height: '100%',
            padding: 32,
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modal-3d-pop-in {
          0% { transform: scale(0.7) rotateX(18deg) translateY(80px); opacity: 0; }
          60% { transform: scale(1.08) rotateX(-6deg) translateY(-12px); opacity: 1; }
          100% { transform: scale(1) rotateX(0deg) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const Dashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(CATEGORIES[0].type);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalModel, setModalModel] = useState(null);
  const [isVideoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [modelModalData, setModelModalData] = useState(null);
  const [modelVideoModalOpen, setModelVideoModalOpen] = React.useState(false);
  const [modelFileUrl, setModelFileUrl] = useState(null);
  const [exploreLoading, setExploreLoading] = React.useState(false);
  const location = useLocation();
  const [currentWord, setCurrentWord] = useState('images');
  const words = ['images', 'videos', 'prompt'];
  const [wordIndex, setWordIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [favoriteModels, setFavoriteModels] = useState([]);
  const [isFavoriteModeActive, setIsFavoriteModeActive] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = React.useRef(null);
  const [showModelPopup, setShowModelPopup] = useState(false);
  const [selectedModelData, setSelectedModelData] = useState(null);

  useEffect(() => {
    // Add class to body
    document.body.classList.add('dashboard-active');

    return () => {
      // Remove class when leaving dashboard
      document.body.classList.remove('dashboard-active');
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    return () => observer.disconnect();
  }, []);

  const fetchModels = useCallback(
    async (type, pageNum = 1, append = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError('');
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 1. Get all models
        const response = await fetch(`${baseURL}/model/${type}?page=${pageNum}`, { headers });
        const data = await response.json();
        // console.log('Full model API response:', data);
        const rawModels = data.models?.data || [];

        setPagination({
          current_page: data.models?.current_page || 1,
          last_page: data.models?.last_page || 1,
          total: data.models?.total || 0,
        });

        // Check if there are more pages
        const morePages = data.models?.current_page < data.models?.last_page;
        setHasMore(morePages);

        // 2. Get favorite models (sirf agar logged in ho)
        let favorites = [];
        if (token) {
          const favRes = await fetch(`${baseURL}/favorite/models`, { headers });
          const favData = await favRes.json();
          favorites = favData['favorite models'] || [];
        }

        // 3. Merge: mark models as favorite
        const modelsWithFavorites = rawModels.map((model) => ({
          ...model,
          is_favorite: favorites.some((fav) => fav.id === model.id),
        }));

        // Append or replace models
        if (append) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          setModels((prevModels) => {
            const newList = [...prevModels, ...modelsWithFavorites];
            return newList;
          });
        } else {
          // console.log('Replacing models with new list');
          setModels(modelsWithFavorites);
        }
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to load models.');
        if (!append) {
          setModels([]);
        }
      } finally {
        if (append) {
          setIsLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [token],
  );

  const handleNext = useCallback(() => {
    // console.log('handleNext called');
    // console.log('Current state:', { hasMore, isLoadingMore, page });

    if (hasMore && !isLoadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchModels(selectedType, nextPage, true);
    }
  }, [hasMore, isLoadingMore, page, selectedType]);

  // Fetch favourite models from API
  const fetchFavoriteModels = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/favorite/models`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const favorites = response.data['favorite models'] || [];
      // Mark all as favorites
      const favoritesWithFlag = favorites.map((model) => ({
        ...model,
        is_favorite: true,
      }));

      setFavoriteModels(favoritesWithFlag);
    } catch (error) {
      console.error('Failed to fetch favorite models:', error);
      setFavoriteModels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModelFavoriteToggle = async (model) => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    const isCurrentlyFav = model.is_favorite;

    // Optimistic update (models + favoriteModels dono update karo)
    setModels((prev) =>
      prev.map((m) => (m.id === model.id ? { ...m, is_favorite: !isCurrentlyFav } : m)),
    );

    setFavoriteModels((prev) => {
      if (isCurrentlyFav) {
        return prev.filter((m) => m.id !== model.id);
      } else {
        return [...prev, { ...model, is_favorite: true }];
      }
    });

    try {
      await axios.post(
        `${baseURL}/favorite/models`,
        { model_id: model.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // console.log('Favorite status updated successfully');
    } catch (err) {
      console.error('Failed to toggle favorite:', err);

      // Revert changes agar API fail ho jaye
      setModels((prev) =>
        prev.map((m) => (m.id === model.id ? { ...m, is_favorite: isCurrentlyFav } : m)),
      );

      setFavoriteModels((prev) => {
        if (isCurrentlyFav) {
          // tha fav pehle → wapis add karo
          return [...prev, { ...model, is_favorite: true }];
        } else {
          // tha unfav pehle → remove karo
          return prev.filter((m) => m.id !== model.id);
        }
      });

      toast.error('Failed to update favorite. Please try again.');
    }
  };

  const handleFavoriteModelsClick = () => {
    if (isFavoriteModeActive) {
      setIsFavoriteModeActive(false);
      setPage(1);
      setHasMore(true);
      fetchModels(selectedType, 1, false);
    } else {
      setIsFavoriteModeActive(true);
      fetchFavoriteModels();
    }
  };

  useEffect(() => {
    if (!isFavoriteModeActive) {
      setPage(1);
      setHasMore(true);
      fetchModels(selectedType, 1, false);
    }
  }, [selectedType, token, isFavoriteModeActive]);

  // Current models to display (either regular or favorites)
  const currentModels = useMemo(() => {
    if (isFavoriteModeActive) {
      return favoriteModels.filter((m) => m.category === selectedType);
    }
    return models;
  }, [isFavoriteModeActive, favoriteModels, models, selectedType]);

  const searchModels = async () => {
    if (!searchText.trim()) return;
    setIsSearching(true);
    setLoading(true);
    setError('');
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${baseURL}/models/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: searchText, category: selectedType }),
      });
      const data = await res.json();
      setModels(data.models || data.data || []);
      if ((data.models && data.models.length === 0) || (data.data && data.data.length === 0)) {
        setError('No results found.');
      }
    } catch (err) {
      setError('Search failed.');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!isSearching) {
      setPage(1);
      setHasMore(true);
      fetchModels(selectedType, 1, false);
    }
    // eslint-disable-next-line
  }, [selectedType, token, location.key]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [words.length]);

  useEffect(() => {
    setCurrentWord(words[wordIndex]);
  }, [wordIndex, words]);

  // Infinite Scroll Effect using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (
          firstEntry.isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !loading &&
          !isFavoriteModeActive
        ) {
          handleNext();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1,
      },
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoadingMore, loading, isFavoriteModeActive, handleNext]);

  const handleCategoryClick = (type) => {
    setSelectedType(type);
    setSearchText('');
    setPage(1);
    setHasMore(true);
    fetchModels(type, 1, false);
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === '') {
      setPage(1);
      setHasMore(true);
      fetchModels(selectedType, 1, false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim() !== '') {
      searchModels();
    } else {
      setPage(1);
      setHasMore(true);
      fetchModels(selectedType, 1, false);
    }
  };

  const [imgLoadedArr, setImgLoadedArr] = React.useState([]);
  React.useEffect(() => {
    setImgLoadedArr(Array(models.length).fill(false));
    if (models.length === 0) return;
    let cancelled = false;
    const toStorageUrl = (path) =>
      `https://app.ai3dscanning.com/storage/${String(path || '').replace(/^\/+/, '')}`;
    models.forEach((model, idx) => {
      const url = model?.thumbnail
        ? toStorageUrl(model.thumbnail)
        : model?.image
          ? toStorageUrl(model.image)
          : model1;
      const img = new Image();
      const markLoaded = () => {
        if (cancelled) return;
        setImgLoadedArr((arr) => {
          const next = arr.length === models.length ? [...arr] : Array(models.length).fill(false);
          next[idx] = true;
          return next;
        });
      };
      img.onload = markLoaded;
      img.onerror = markLoaded;
      img.src = url;
      if (img.complete) markLoaded();
    });
    return () => {
      cancelled = true;
    };
  }, [models]);

  return (
    <>
      {/* =================== Hero Section ============= */}
      <section
        className="hero-section p-md-5 pb-md-0 py-5"
        style={{
          overflow: 'hidden',
          position: 'relative',
          background: 'none',
          minHeight: 320,
        }}
      >
        <div className="bubble-wrapper-animation">
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
          <div>
            <span className="bubble"></span>
          </div>
        </div>
        {!isDark && (
          <img
            src={videoGif}
            alt="Hero Background"
            className="hero-video-gif"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              pointerEvents: 'none',
              filter: 'brightness(0.85) saturate(1.1) blur(0.5px)',
              background: 'white',
            }}
          />
        )}
        {isDark && (
          <img
            src={darkGif}
            alt="Hero Background Dark"
            className="hero-video-gif"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              pointerEvents: 'none',
              filter: 'none',
              background: 'black',
            }}
          />
        )}

        {!isDark && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
              pointerEvents: 'none',
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.85) 60%, #fff 100%)',
            }}
          />
        )}
        {isDark && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
              pointerEvents: 'none',
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 15%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.78) 82%, #000 100%)',
            }}
          />
        )}

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="row justify-content-center align-items-center text-center mt-lg-1 mt-3">
            <div className="col-lg-8">
              <style>{`
                .flip-perspective{perspective:1000px}
                .counter-flip{display:inline-block;backface-visibility:hidden;transform-origin:50% 0%;transform-style:preserve-3d;will-change:transform;animation:flipWordSmooth .9s cubic-bezier(.2,.7,.3,1)}
                @keyframes flipWordSmooth{0%{transform:rotateX(90deg);opacity:.0}55%{transform:rotateX(-10deg);opacity:1}100%{transform:rotateX(0);opacity:1}}
                @keyframes flipCounterSmooth{0%{transform:rotateX(-90deg);opacity:.0}55%{transform:rotateX(10deg);opacity:1}100%{transform:rotateX(0);opacity:1}}
              `}</style>
              <h2 className="flip-perspective">
                <span key={currentWord + ':a'} style={{ color: 'inherit' }}>
                  Turn
                </span>{' '}
                <span
                  key={currentWord}
                  style={{
                    width: '3.2em',
                    display: 'inline-block',
                    backfaceVisibility: 'hidden',
                    transformOrigin: '50% 100%',
                    animation: 'flipCounterSmooth .9s cubic-bezier(.2,.7,.3,1)',
                  }}
                >
                  {currentWord}
                </span>{' '}
                <span key={currentWord + ':b'} style={{ color: 'inherit' }}>
                  into interactive
                </span>{' '}
                <span key={currentWord + ':c'} style={{ color: 'var(--primary-color)' }}>
                  3D
                </span>{' '}
                <br />
                <span key={currentWord + ':c2'} style={{ color: 'var(--primary-color)' }}>
                  Models
                </span>{' '}
                <span key={currentWord + ':d'} style={{ color: 'inherit' }}>
                  - Instantly
                </span>
              </h2>
              <p>The AI engine for scalable 3D asset generation</p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div
              className="col-12 col-lg-8 search-container"
              style={{
                borderRadius: 16,
                padding: '0.5rem 0.5rem',
                zIndex: 3,
              }}
            >
              <form className="search-box" onSubmit={handleSearch}>
                <span className="borders"></span>
                <div className="search-icon">
                  <img src={search} />
                </div>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search 3D Models"
                  value={searchText}
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className="arrow-icon"
                  style={{ background: 'none', border: 'none', outline: 'none' }}
                >
                  <FiArrowRight />
                </button>
              </form>
            </div>
          </div>

          <div className="row justify-content-center align-items-center mt-2">
            <div
              className="col-lg-8 d-flex justify-content-center"
              style={{
                borderRadius: 16,
                backdropFilter: 'blur(4px)',
                padding: '0.5rem 0.5rem',
                zIndex: 3,
              }}
            >
              <div className="category-row">
                {CATEGORIES.map((cat, idx) => {
                  const isActive = selectedType === cat.type;
                  return (
                    <div
                      key={cat.type}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <div
                        className={`category-icon-circle${isActive ? ' active' : ''}`}
                        onClick={() => handleCategoryClick(cat.type)}
                      >
                        <img
                          src={cat.icon}
                          alt={cat.label}
                          className={`category-icon${isActive ? ' active' : ''}`}
                          style={{
                            width: 30,
                            height: 30,
                            filter: isActive
                              ? 'invert(36%) sepia(97%) saturate(7492%) hue-rotate(312deg) brightness(97%) contrast(101%)'
                              : 'none',
                          }}
                        />
                      </div>
                      <div className={`category-label${isActive ? ' active' : ''}`}>
                        {cat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="Fav-models-box mt-3 ms-auto">
            <button
              className="Fav-models-btn d-flex align-items-center gap-2"
              onClick={handleFavoriteModelsClick}
            >
              {isFavoriteModeActive ? (
                <FaHeart fill="#DE3996" size={14} />
              ) : (
                <FaRegHeart fill="#DE3996" size={14} />
              )}
              <span>Favorite Models</span>
            </button>
          </div>
        </div>
      </section>

      {/* =================== Studio Section  ============= */}
      <section className="studio-section" style={{ overflow: 'hidden' }}>
        <div className="container-section">
          {loading ? (
            <div className="text-center my-5">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #e63399',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto',
                }}
              ></div>
              <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
          ) : error ? (
            <div className="text-center my-5 text-danger">{error}</div>
          ) : currentModels.length === 0 ? (
            // Check if we're on favorites tab or general models
            isFavoriteModeActive ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#888', fontSize: 20 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>
                  <FaHeart size={35} style={{ color: 'rgba(222, 57, 150, 1)' }} />
                </div>
                No Favorite's found
              </div>
            ) : (
              <div
                className="no-models-found-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '60px 20px',
                  borderRadius: 16,
                  margin: '40px auto',
                  maxWidth: 420,
                  minHeight: 220,
                  animation: 'fadeIn 0.7s',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 26, color: '#22223b', marginBottom: 8 }}>
                  No Models Found
                </div>
                <div style={{ color: '#888', fontSize: 17, textAlign: 'center', maxWidth: 340 }}>
                  We couldn't find any 3D models for your search or category.
                  <br />
                  Try adjusting your search or check back later!
                </div>
                <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
              </div>
            )
          ) : (
            <div className="model-list-row">
              {currentModels.map((model, idx) => {
                const imgUrl = model.thumbnail
                  ? `https://app.ai3dscanning.com/storage/${model.thumbnail.replace(/^\/+/, '')}`
                  : model.image
                    ? `https://app.ai3dscanning.com/storage/${model.image.replace(/^\/+/, '')}`
                    : model1;
                return (
                  <div key={model.id} className="model-card">
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 12,
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {!imgLoadedArr[idx] && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 1,
                              background: 'transparent',
                            }}
                          >
                            <span
                              className="dashboard-thumb-loader"
                              aria-label="loading thumbnail"
                            ></span>
                          </div>
                        )}
                        <img
                          src={imgUrl}
                          alt={model.title || model.name}
                          className="model-card-img"
                          style={{
                            opacity: imgLoadedArr[idx] ? 1 : 0,
                            transition: 'opacity 0.5s',
                            zIndex: 2,
                          }}
                          onLoad={() => {
                            setImgLoadedArr((arr) => {
                              const newArr = [...arr];
                              newArr[idx] = true;
                              return newArr;
                            });
                          }}
                        />
                        <button
                          className="rp-fav-btn"
                          onClick={() => handleModelFavoriteToggle(model)}
                        >
                          {model.is_favorite ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                        </button>
                      </div>
                    </div>
                    <div className="model-card-content" style={{ position: 'relative' }}>
                      {model.is_free !== 1 && (
                        <img
                          src={Paid}
                          alt="paid"
                          style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '8px',
                            width: '16px',
                            height: '16px',
                          }}
                        />
                      )}
                      <div className="model-card-title">{model.title || model.name}</div>
                      <div className="model-card-desc">
                        {model.description || 'No description.'}
                      </div>
                      {exploreLoading && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0,0,0,0.12)',
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8,
                          }}
                        >
                          <CustomLoader />
                        </div>
                      )}
                      <button
                        className="model-card-btn"
                        onClick={() => {
                          const rawUrl =
                            model.file_url ||
                            model.video_url ||
                            model.url ||
                            (model.data && (model.data.video_url || model.data.url));

                          const imgUrl = model.image
                            ? `https://app.ai3dscanning.com/storage/${model.image.replace(/^\/+/, '')}`
                            : null;

                          if (rawUrl || imgUrl) {
                            const finalUrl = rawUrl ? getFullVideoUrl(rawUrl) : null;
                            setModelFileUrl(finalUrl); // ✅ renamed from setModelVideoUrl
                            setSelectedModelData(model);
                            setModelVideoModalOpen(true);
                          } else {
                            toast.error('No video or image found');
                            console.error('Neither video nor image exists for model:', model);
                          }
                        }}
                      >
                        Explore →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Intersection Observer Target */}
          {!loading && !isFavoriteModeActive && currentModels.length > 0 && (
            <div
              ref={loaderRef}
              style={{
                height: '20px',
                width: '100%',
                margin: '20px 0',
              }}
            />
          )}
        </div>
      </section>

      {/* Infinite Scroll Loading Indicator */}
      {isLoadingMore && (
        <div className="text-center my-4">
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #e63399',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '-6rem auto 0 auto',
            }}
          ></div>
        </div>
      )}

      {/* Model Details Modal (modern style) */}
      {modelModalOpen && modelModalData && (
        <ModernModal open={modelModalOpen} onClose={() => setModelModalOpen(false)} width={500}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {modelModalData.videoUrl && (
              <VideoModalWithLoader
                videoUrl={modelModalData.videoUrl}
                onClose={() => setModelModalOpen(false)}
              />
            )}
          </div>
        </ModernModal>
      )}

      {/* Modal for model details */}
      {modalModel &&
        (() => {
          const [isModalImgLoaded, setModalImgLoaded] = React.useState(false);
          return (
            <ModernModal open={!!modalModel} onClose={() => setModalModel(null)} width={500}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <h4 style={{ margin: 0 }}>{modalModel.title}</h4>
              </div>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  minHeight: 180,
                  marginBottom: 16,
                  overflow: 'hidden',
                  borderRadius: 8,
                }}
              >
                <img
                  src={getModelImageUrl(modalModel.image)}
                  alt={modalModel.title}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    objectFit: 'cover',
                    maxHeight: 220,
                    filter: isModalImgLoaded ? 'none' : 'blur(10px) grayscale(0.2)',
                    transition: 'filter 0.7s',
                    position: 'relative',
                    zIndex: 2,
                  }}
                  onLoad={() => setModalImgLoaded(true)}
                />
                {!isModalImgLoaded && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      cursor: 'pointer',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3,
                      background: 'rgba(255,255,255,0.5)',
                      transition: 'opacity 0.4s',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div
                        className="modal-dot-loader-dot"
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          background: '#e6339a',
                          opacity: 0.7,
                          animation: 'modalDotBounce 1s infinite alternate',
                        }}
                      />
                      <div
                        className="modal-dot-loader-dot"
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          background: '#e6339a',
                          opacity: 0.7,
                          animation: 'modalDotBounce 1s infinite alternate',
                          animationDelay: '0.2s',
                        }}
                      />
                      <div
                        className="modal-dot-loader-dot"
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          background: '#e6339a',
                          opacity: 0.7,
                          animation: 'modalDotBounce 1s infinite alternate',
                          animationDelay: '0.4s',
                        }}
                      />
                      <div
                        className="modal-dot-loader-dot"
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          background: '#e6339a',
                          opacity: 0.7,
                          animation: 'modalDotBounce 1s infinite alternate',
                          animationDelay: '0.6s',
                        }}
                      />
                    </div>
                    <style>{`
                      @keyframes modalDotBounce {
                        0% { opacity: 0.7; transform: translateY(0); }
                        100% { opacity: 1; transform: translateY(-14px); }
                      }
                    `}</style>
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Description:</strong> {modalModel.description || 'No description.'}
              </div>
            </ModernModal>
          );
        })()}

      {showPromptModal && (
        <ModernModal
          open={showPromptModal}
          onClose={() => setShowPromptModal(false)}
          width={350}
          showStarfield
        >
          <FaReact
            style={{
              fontSize: 48,
              color: '#DE3996',
              marginBottom: 18,
              animation: 'spin 1.2s linear infinite',
            }}
          />
          <h2 style={{ fontWeight: 700, marginBottom: 12 }}>Coming Soon</h2>
          <div style={{ color: '#555', fontSize: 17, marginBottom: 8 }}>
            Prompt-based generation will be available soon!
          </div>
          <button
            className="btn btn-create"
            style={{ marginTop: 18 }}
            onClick={() => setShowPromptModal(false)}
          >
            OK
          </button>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </ModernModal>
      )}

      {/* Scan Modal */}
      {showScanModal && (
        <ModernModal
          open={showScanModal}
          onClose={() => setShowScanModal(false)}
          width={400}
          showStarfield
        >
          <div className="text-center">
            <img src={scanImg} alt="Scan" style={{ width: 80, marginBottom: 16 }} />
            <h4>Scan New Model</h4>
            <p>Upload your images to generate a 3D model. (Coming Soon)</p>
          </div>
        </ModernModal>
      )}

      {/* Global Video Modal */}
      <VideoModal
        open={isVideoModalOpen}
        videoUrl={videoModalUrl}
        onClose={() => setVideoModalOpen(false)}
      />

      {/* Model Card Video Modal */}
      <ModelCardVideoModal
        open={modelVideoModalOpen}
        fileUrl={modelFileUrl} // ✅ renamed from videoUrl
        imageUrl={
          selectedModelData?.image
            ? `https://app.ai3dscanning.com/storage/${selectedModelData.image.replace(/^\/+/, '')}`
            : null
        }
        onClose={() => setModelVideoModalOpen(false)}
      />

      {showLoginModal && (
        <LoginPopup
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
          }}
        />
      )}
    </>
  );
};

export default Dashboard;
