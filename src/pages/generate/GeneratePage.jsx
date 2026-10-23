'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaHeart, FaRegHeart } from 'react-icons/fa';
import { FiBox, FiFileText, FiRefreshCw, FiX } from 'react-icons/fi';
import { Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import paths from '../../routes/paths';
import JoinPlatformCta from '../../components/landing/JoinPlatformCta';
import FooterLangCurrency from '../../components/footer/FooterLangCurrency';
import WaitlistModal from '../../components/popup/WaitlistModal';
import CustomLoader from '../../components/loader/CustomLoader';
import logo from '../images/logo.png';
import line from '../images/line.png';
import dot from '../images/do.png';
import arrow from '../images/arri.png';
import model1 from '../../assets/images/model-1.png';
import icon1 from '../../assets/images/icon1.svg';
import icon2 from '../../assets/images/icon2.svg';
import icon3 from '../../assets/images/icon3.svg';
import icon4 from '../../assets/images/icon4.svg';
import icon5 from '../../assets/images/icon5.svg';
import icon6 from '../../assets/images/icon6.svg';
import Paid from '../../assets/icon/Paid.svg';
import '../LandingPage.css';
import '../dashboard/SimplePage.css';
import './GeneratePage.css';

const ModelCardVideoModal = dynamic(
  () => import('../dashboard').then((mod) => mod.ModelCardVideoModal),
  { ssr: false },
);

const modelFileUrl = (model) => {
  const raw =
    model?.file_temp_url ||
    model?.file_url ||
    model?.video_url ||
    model?.url ||
    model?.data?.video_url ||
    model?.data?.url;
  if (!raw) return null;
  if (String(raw).startsWith('http')) return raw;
  const clean = String(raw).replace(/^\/+/, '');
  if (clean.startsWith('storage/')) return `https://dev-backend.ai3dscanning.com/${clean}`;
  return `https://dev-backend.ai3dscanning.com/storage/${clean}`;
};

const CARDS_PER_VIEW = 24;
const HERO_PROMPT_LIMIT = 150;
const HERO_PROMPTS = [
  "Retrofuturistic payphone with neon 'VIDEOPHONE' sign, CRT monitor, black casing with pink and blue accents, 80s aesthetic",
  'Matte black wireless headphones on a clean studio background',
  'Compact construction drone with bright orange accents',
  'Modern retail sneaker, soft product lighting, neutral backdrop',
  'Low-poly game character with a backpack and stylized armor',
];

const WORDS = ['images', 'videos', 'prompt'];

const CATEGORIES = [
  { label: 'All', type: 'all', icon: icon6 },
  { label: 'Construction', type: 'construction', icon: icon1 },
  { label: 'Gaming', type: 'gaming', icon: icon2 },
  { label: 'VR', type: 'vr', icon: icon3 },
  { label: 'Retail', type: 'retail', icon: icon4 },
  { label: 'Manufacturing', type: 'manufacturing', icon: icon5 },
];

const PRODUCT_LINKS = [
  { title: 'Text to 3D', desc: 'Prompt to finished asset', to: '/3dio/new/scan' },
  { title: 'Multi-image to 3D', desc: 'Multiple views fused', to: '/3dio/new/scan' },
  { title: 'Skeleton & rigging', desc: 'Auto-rig with motion presets', to: '/3dio/new/scan' },
  { title: 'Workspace', desc: 'Projects, versions, library', to: '/3dio/workspace' },
  { title: 'Image to 3D', desc: 'One photo, one model', to: '/3dio/new/scan' },
  { title: 'Video to 3D', desc: 'Turntable capture', to: '/3dio/new/scan' },
  { title: 'Editor', desc: 'Remesh, clean, texture', to: '/3dio/' },
  { title: 'Teams', desc: 'Roles, seats, SSO', to: '/3dio/settings/team' },
];

const storageUrl = (path) =>
  `https://dev-backend.ai3dscanning.com/storage/${String(path).replace(/^\/+/, '')}`;

const modelImage = (model) => {
  if (model?.thumbnail) return storageUrl(model.thumbnail);
  if (model?.image) return storageUrl(model.image);
  return model1;
};

const isPaid = (model) =>
  model?.is_free === false ||
  model?.is_free === 0 ||
  model?.is_free === '0' ||
  model?.is_free === 'false';

export default function GeneratePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const pageRef = useRef(null);
  const promptRef = useRef(null);
  const productMenuTimer = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isMobileProductOpen, setIsMobileProductOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [models, setModels] = useState([]);
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_VIEW);
  const [hasMore, setHasMore] = useState(true);
  const modelsRef = useRef([]);
  const nextPageRef = useRef(1);
  const requestRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [failedThumbs, setFailedThumbs] = useState({});

  const currentWord = WORDS[wordIndex];

  useEffect(() => {
    const section = pageRef.current;
    if (!section) return undefined;

    const handleScroll = () => {
      setIsScrolled(section.scrollTop > 30);
    };

    handleScroll();
    section.addEventListener('scroll', handleScroll, { passive: true });
    return () => section.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const field = promptRef.current;
    if (!field) return;
    field.style.height = 'auto';
    field.style.height = `${field.scrollHeight}px`;
  }, [prompt]);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((index) => (index + 1) % WORDS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const loadBatch = useCallback(
    async (type, target, reset) => {
      const requestId = requestRef.current + 1;
      requestRef.current = requestId;
      if (reset) {
        setLoading(true);
        setModels([]);
        modelsRef.current = [];
        nextPageRef.current = 1;
      } else {
        setLoadingMore(true);
      }
      setError('');
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        let favorites = [];
        if (token) {
          const favRes = await fetch(`${baseURL}/favorite/models`, { headers });
          const favData = await favRes.json();
          favorites = favData['favorite models'] || [];
        }

        let list = reset ? [] : modelsRef.current.slice();
        let pageNum = reset ? 1 : nextPageRef.current;
        let more = true;
        let calls = 0;

        while (list.length < target && more && calls < 6) {
          const response = await fetch(`${baseURL}/model/${type}?page=${pageNum}`, { headers });
          const data = await response.json();
          const rawModels = data.models?.data || [];
          const seen = new Set(list.map((model) => model.id));
          rawModels.forEach((model) => {
            if (seen.has(model.id)) return;
            seen.add(model.id);
            list.push({
              ...model,
              is_favorite: favorites.some((fav) => fav.id === model.id),
            });
          });
          const current = data.models?.current_page || pageNum;
          const last = data.models?.last_page || current;
          more = current < last && rawModels.length > 0;
          pageNum = current + 1;
          calls += 1;
          if (rawModels.length === 0) break;
        }

        if (requestId !== requestRef.current) return;

        modelsRef.current = list;
        nextPageRef.current = pageNum;
        const shown = Math.min(target, list.length);
        setModels(list);
        setVisibleCount(shown);
        setHasMore(list.length > shown || more);
      } catch (err) {
        console.error('Error fetching models:', err);
        if (requestId !== requestRef.current) return;
        setError('Failed to load models.');
        if (reset) {
          setModels([]);
          modelsRef.current = [];
        }
      } finally {
        if (requestId === requestRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [token],
  );

  useEffect(() => {
    if (isSearching) return;
    loadBatch(selectedType, CARDS_PER_VIEW, true);
  }, [selectedType, token, isSearching, loadBatch]);

  const searchModels = async (query) => {
    const title = (query ?? prompt).trim();
    if (!title) return;
    setIsSearching(true);
    setLoading(true);
    setError('');
    setHasMore(false);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${baseURL}/models/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ title, category: selectedType }),
      });
      const data = await res.json();
      const list = Array.isArray(data.models)
        ? data.models
        : data.models?.data || data.data || [];
      setModels(list);
      if (list.length === 0) setError('No results found.');
    } catch (err) {
      setError('Search failed.');
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event?.preventDefault();
    if (!prompt.trim()) {
      setIsSearching(false);
      return;
    }
    searchModels(prompt);
  };

  const clearPrompt = () => {
    setPrompt('');
    setIsSearching(false);
    setHasMore(true);
  };

  const handleGuide = () => {
    setPrompt(HERO_PROMPTS[0].slice(0, HERO_PROMPT_LIMIT));
  };

  const handleRandom = () => {
    const next = HERO_PROMPTS[Math.floor(Math.random() * HERO_PROMPTS.length)].slice(
      0,
      HERO_PROMPT_LIMIT,
    );
    setPrompt(next);
    searchModels(next);
  };

  const handleCategory = (type) => {
    setSelectedType(type);
    setPrompt('');
    setIsSearching(false);
    setHasMore(true);
  };

  const toggleFavorite = async (event, model) => {
    event.stopPropagation();
    if (!token) {
      navigate(paths.signin);
      return;
    }
    const nextFavorite = !model.is_favorite;
    setModels((prev) =>
      prev.map((item) => (item.id === model.id ? { ...item, is_favorite: nextFavorite } : item)),
    );
    try {
      await axios.post(
        `${baseURL}/favorite/models`,
        { model_id: model.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (err) {
      setModels((prev) =>
        prev.map((item) =>
          item.id === model.id ? { ...item, is_favorite: model.is_favorite } : item,
        ),
      );
    }
  };

  const openProductMenu = () => {
    if (productMenuTimer.current) clearTimeout(productMenuTimer.current);
    setIsProductOpen(true);
  };

  const closeProductMenu = () => {
    if (productMenuTimer.current) clearTimeout(productMenuTimer.current);
    productMenuTimer.current = setTimeout(() => setIsProductOpen(false), 280);
  };

  const closeMenus = () => {
    setIsOpen(false);
    setIsProductOpen(false);
    setIsMobileProductOpen(false);
  };

  return (
    <div className="generate-page landing-page-section ai_3d_landing" ref={pageRef}>
      <div className="main_head">
        <main className="container py-sm-4 pt-4">
          <header
            className={`a3d-header container-fluid mb-4 a3d-fade-in ${isScrolled ? 'a3d-header-scrolled' : ''}`}
          >
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/" className="a3d-header-logo-link">
                <img src={logo} alt="AI 3D Scanning Logo" className="a3d-header-logo" />
              </Link>

              <button
                className="navbar-toggler d-lg-none border-0"
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isOpen}
              >
                <i className="fas fa-bars" aria-hidden="true" />
              </button>

              <nav className="d-none d-lg-flex gap-lg-3 gap-xl-4 align-items-center">
                <Link to="/" className="a3d-nav-link">
                  Home
                </Link>
                <div
                  className="a3d-product-dropdown-container"
                  onMouseEnter={openProductMenu}
                  onMouseLeave={closeProductMenu}
                >
                  <button
                    type="button"
                    className="a3d-nav-link a3d-product-trigger"
                    onClick={() => setIsProductOpen((open) => !open)}
                    aria-expanded={isProductOpen}
                  >
                    Product
                    <FaChevronDown className={`a3d-product-chevron ${isProductOpen ? 'open' : ''}`} />
                  </button>
                  {isProductOpen && (
                    <div className="a3d-product-menu" role="menu">
                      <div className="a3d-product-column">
                        {PRODUCT_LINKS.slice(0, 4).map((item) => (
                          <Link
                            key={item.title}
                            to={item.to}
                            className="a3d-product-item"
                            onClick={() => setIsProductOpen(false)}
                          >
                            <span className="a3d-product-item-title">{item.title}</span>
                            <span className="a3d-product-item-desc">{item.desc}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="a3d-product-column">
                        {PRODUCT_LINKS.slice(4).map((item) => (
                          <Link
                            key={item.title}
                            to={item.to}
                            className="a3d-product-item"
                            onClick={() => setIsProductOpen(false)}
                          >
                            <span className="a3d-product-item-title">{item.title}</span>
                            <span className="a3d-product-item-desc">{item.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  to="/generate"
                  className={`a3d-nav-link ${location.pathname.startsWith('/generate') ? 'active' : ''}`}
                >
                  Generate
                </Link>
                <Link
                  to="/3dio/api-sdk"
                  className={`a3d-nav-link ${location.pathname === '/3dio/api-sdk' ? 'active' : ''}`}
                >
                  API & Pricing
                </Link>
                <a href="/#Leadership" className="a3d-nav-link">
                  Leadership
                </a>
              </nav>

              <div className="d-none d-lg-flex gap-2 align-items-center">
                <Link to="https://calendly.com/arslan-medtronix/30min" className="a3d-book-demo-btn">
                  Schedule Meeting
                </Link>
                <JoinPlatformCta onWaitlistOpen={() => setIsWaitlistOpen(true)} />
              </div>
            </div>
          </header>
          <div className="a3d-header-offset" />

          <div className={`mobile-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2">
              <Link to="/" className="a3d-header-logo-link" onClick={closeMenus}>
                <img src={logo} alt="AI 3D Scanning Logo" className="a3d-header-logo" />
              </Link>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <nav className="d-flex flex-column gap-2 px-3 pb-3">
              <Link to="/" className="a3d-nav-link" onClick={closeMenus}>
                Home
              </Link>
              <button
                type="button"
                className="a3d-nav-link a3d-mobile-product-toggle"
                onClick={() => setIsMobileProductOpen((open) => !open)}
              >
                Product
                <FaChevronDown className={`a3d-product-chevron ${isMobileProductOpen ? 'open' : ''}`} />
              </button>
              {isMobileProductOpen && (
                <div className="generate-mobile-products">
                  {PRODUCT_LINKS.map((item) => (
                    <Link key={item.title} to={item.to} className="a3d-nav-link" onClick={closeMenus}>
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
              <Link
                to="/generate"
                className={`a3d-nav-link ${location.pathname.startsWith('/generate') ? 'active' : ''}`}
                onClick={closeMenus}
              >
                Generate
              </Link>
              <Link to="/3dio/api-sdk" className="a3d-nav-link" onClick={closeMenus}>
                API & Pricing
              </Link>
              <a href="/#Leadership" className="a3d-nav-link" onClick={closeMenus}>
                Leadership
              </a>
              <Link
                to="https://calendly.com/arslan-medtronix/30min"
                className="a3d-book-demo-btn"
                onClick={closeMenus}
              >
                Schedule Meeting
              </Link>
              <JoinPlatformCta
                onWaitlistOpen={() => setIsWaitlistOpen(true)}
                onAfterClick={closeMenus}
              />
            </nav>
          </div>

          <section className="generate-hero">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <style>{`
                  .generate-page .flip-perspective{perspective:1000px}
                  .generate-page .generate-flip-word{width:3.2em;display:inline-block;backface-visibility:hidden;transform-origin:50% 100%;animation:flipCounterSmooth .9s cubic-bezier(.2,.7,.3,1)}
                  @keyframes flipCounterSmooth{0%{transform:rotateX(-90deg);opacity:0}55%{transform:rotateX(10deg);opacity:1}100%{transform:rotateX(0);opacity:1}}
                `}</style>
                <h2 className="flip-perspective">
                  <span key={`${currentWord}:a`}>Turn</span>{' '}
                  <span key={currentWord} className="generate-flip-word generate-accent">
                    {currentWord}
                  </span>{' '}
                  <span key={`${currentWord}:b`}>into interactive</span>{' '}
                  <span key={`${currentWord}:c`} className="generate-accent">
                    3D
                  </span>{' '}
                  <br />
                  <span key={`${currentWord}:c2`} className="generate-accent">
                    Models
                  </span>{' '}
                  <span key={`${currentWord}:d`}>- Instantly</span>
                </h2>
                <p>The AI engine for scalable 3D asset generation</p>
              </div>
            </div>
            <div className="generate-search-wrap">
              <form className="hero-prompt" onSubmit={handleSearch}>
                <span className="hero-prompt-shine" aria-hidden="true" />
                <span className="hero-prompt-spark hero-prompt-spark--a" aria-hidden="true" />
                <span className="hero-prompt-spark hero-prompt-spark--b" aria-hidden="true" />
                <span className="hero-prompt-spark hero-prompt-spark--c" aria-hidden="true" />
                <textarea
                  ref={promptRef}
                  className="hero-prompt-input"
                  placeholder="Search 3D Models"
                  value={prompt}
                  maxLength={HERO_PROMPT_LIMIT}
                  rows={1}
                  onChange={(event) => setPrompt(event.target.value.slice(0, HERO_PROMPT_LIMIT))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      handleSearch(event);
                    }
                  }}
                />
                {prompt ? (
                  <button
                    type="button"
                    className="hero-prompt-clear"
                    aria-label="Clear search"
                    onClick={clearPrompt}
                  >
                    <FiX size={16} />
                  </button>
                ) : null}
                <div className="hero-prompt-toolbar">
                  <button
                    type="button"
                    className="hero-prompt-chip hero-prompt-chip--guide"
                    onClick={handleGuide}
                  >
                    <FiFileText size={14} />
                    Guide
                  </button>
                  <button type="button" className="hero-prompt-chip" onClick={handleRandom}>
                    <Sparkles size={14} />
                    Random
                  </button>
                  <span className={`hero-prompt-count${prompt.length > 100 ? ' is-hot' : ''}`}>
                    {prompt.length}/{HERO_PROMPT_LIMIT}
                  </span>
                </div>
              </form>
            </div>

            <div className="category-row" style={{ justifyContent: 'center', marginBottom: 12 }}>
              {CATEGORIES.map((cat) => {
                const active = selectedType === cat.type;
                return (
                  <div key={cat.type} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      className={`category-icon-circle${active ? ' active' : ''}`}
                      onClick={() => handleCategory(cat.type)}
                    >
                      <img
                        src={cat.icon}
                        alt={cat.label}
                        className={`category-icon${active ? ' active' : ''}`}
                        style={{
                          width: 30,
                          height: 30,
                          filter: active
                            ? 'invert(36%) sepia(97%) saturate(7492%) hue-rotate(312deg) brightness(97%) contrast(101%)'
                            : 'none',
                        }}
                      />
                    </div>
                    <div className={`category-label${active ? ' active' : ''}`}>{cat.label}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="studio-section generate-models">
            <div className="container-section">
              {loading ? (
                <div className="dashboard-models-loader">
                  <CustomLoader />
                </div>
              ) : error && models.length === 0 ? (
                <div className="models-empty-state">
                  <div className="models-empty-state__icon">
                    <FiBox size={32} />
                  </div>
                  <h3 className="models-empty-state__title">No models found</h3>
                  <p className="models-empty-state__text">{error}</p>
                  <button
                    type="button"
                    className="models-empty-state__btn models-empty-state__btn--primary"
                    onClick={() => {
                      setIsSearching(false);
                      setPrompt('');
                      loadBatch(selectedType, CARDS_PER_VIEW, true);
                    }}
                  >
                    <FiRefreshCw size={16} />
                    Try again
                  </button>
                </div>
              ) : models.length === 0 ? (
                <div className="models-empty-state">
                  <div className="models-empty-state__icon">
                    <FiBox size={32} />
                  </div>
                  <h3 className="models-empty-state__title">No models found</h3>
                  <p className="models-empty-state__text">
                    We couldn’t find any 3D models for this category. Try another category or check back later.
                  </p>
                </div>
              ) : (
                <div className="model-list-row">
                  {models.slice(0, visibleCount).map((model) => (
                    <div
                      key={model.id}
                      className="model-card"
                      onClick={() => setSelectedModel(model)}
                      style={{ position: 'relative', cursor: 'pointer', borderRadius: 12, overflow: 'hidden' }}
                    >
                      {isPaid(model) && (
                        <img
                          src={Paid}
                          alt="paid"
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            width: 18,
                            height: 18,
                            zIndex: 10,
                          }}
                        />
                      )}
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: model.bg_color || '#ffffff',
                          borderRadius: 12,
                        }}
                      >
                        {failedThumbs[model.id] ? (
                          <div className="model-card-fallback">
                            <FiBox size={28} />
                            <span>No preview</span>
                          </div>
                        ) : (
                          <img
                            src={modelImage(model)}
                            alt=""
                            className="model-card-img"
                            onError={() => {
                              setFailedThumbs((prev) =>
                                prev[model.id] ? prev : { ...prev, [model.id]: true },
                              );
                            }}
                          />
                        )}
                        <button
                          type="button"
                          className="rp-fav-btn"
                          onClick={(event) => toggleFavorite(event, model)}
                        >
                          {model.is_favorite ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                        </button>
                      </div>
                      <div className="model-card-content">
                        <div className="model-card-title" style={{ paddingRight: 22 }}>
                          {model.title || model.name}
                        </div>
                        <div className="model-card-desc">{model.description || 'No description.'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loading && !isSearching && hasMore && models.length > 0 && (
                <button
                  type="button"
                  className="generate-load-more"
                  disabled={loadingMore}
                  onClick={() => loadBatch(selectedType, visibleCount + CARDS_PER_VIEW, false)}
                >
                  <span>{loadingMore ? 'Loading models' : 'Show more models'}</span>
                  <span className={`generate-load-more__icon${loadingMore ? ' is-loading' : ''}`}>
                    <FaChevronDown size={12} />
                  </span>
                </button>
              )}
            </div>
          </section>
        </main>

        <div className="aithreed">
        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <div className="logo">
                  <img src={logo} alt="AI 3D Scanning Logo" />
                </div>
                <p className="desc">
                  AI 3D Scanning Solutions transforms photos, videos, and real-world objects into
                  high-precision 3D models instantly and without expensive hardware. Our platform
                  offers creation, editing, and a vast 3D content library, all powered by cutting
                  edge AI. From individuals to enterprises, we make 3D accessible, scalable, and
                  secure.
                </p>
                <div className="alldiv">
                  <div className="btn-wrapper">
                    <Link to="/contributor/program" className="btn btn-custom Sell">
                      Sell your 3D Models
                    </Link>
                  </div>
                  <FooterLangCurrency />
                </div>
              </div>
              <div className="col-lg-2 col-md-4 col-6 txcenter top">
                <h6>Quick Links</h6>
                <div className="relative">
                  <img width="61px" src={line} alt="Line" />
                  <img src={dot} alt="Dot" className="posotion" />
                </div>
                <ul className="mt-1">
                  {[
                    { name: 'Home', url: '/' },
                    { name: 'About Us', url: '/about-us' },
                    { name: 'Services', url: '/service' },
                    { name: 'Pricing', url: '/3dio/subscription' },
                    { name: 'Student', url: '/student-program' },
                  ].map((item) => (
                    <li key={item.name}>
                      <Link to={item.url}>
                        <img className="iconsize me-1" src={arrow} alt="" style={{ verticalAlign: 'middle', marginTop: '-3px' }} />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-lg-2 col-md-4 col-6 top">
                <h6>Support</h6>
                <div className="relative">
                  <img width="61px" src={line} alt="Line" />
                  <img src={dot} alt="Dot" className="posotion" />
                </div>
                <ul className="mt-1">
                  <li>
                    <a href="/3dio/support">
                      <img className="iconsize me-1" src={arrow} alt="" style={{ verticalAlign: 'middle', marginTop: '-3px' }} />
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="/#FAQs">
                      <img className="iconsize me-1" src={arrow} alt="" style={{ verticalAlign: 'middle', marginTop: '-3px' }} />
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-lg-2 col-md-4 col-6 bottom padd">
                <h6>Follow</h6>
                <div className="relative">
                  <img width="61px" src={line} alt="Line" />
                  <img src={dot} alt="Dot" className="posotion" />
                </div>
                <ul className="mt-1">
                  {[
                    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/ai3d-scanning-solutions-inc/?' },
                    { name: 'Instagram', url: 'https://www.instagram.com/ai3d_scanning_solutions' },
                    { name: 'Threads', url: 'https://www.threads.net/@ai3d_scanning_solutions' },
                    { name: 'Facebook', url: 'https://www.facebook.com/share/1Bbvpcm4EU/?mibextid=wwXIfr' },
                  ].map((item) => (
                    <li key={item.name}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <img className="iconsize me-1" src={arrow} alt="" style={{ verticalAlign: 'middle', marginTop: '-2px' }} />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-lg-2 col-md-4 col-6 bottom p-0 contact mt-md-0 mt-4">
                <h6>Get In Touch</h6>
                <div className="relative">
                  <img width="61px" src={line} alt="Line" />
                  <img src={dot} alt="Dot" className="posotion" />
                </div>
                <div className="contact">
                  <ul className="mt-lg-2 mt-0">
                    <li>
                      <span className="colorc">Email: </span>
                      <br />
                      <a href="mailto:contact@ai3dscanning.com" className="mt-1">
                        contact@ai3dscanning.com
                      </a>
                    </li>
                    <li>
                      <a href="tel:+923443228863">
                        <span className="colorc">Phone: </span>
                        <br />
                        <br />
                        +923443228863 , +12088076899
                      </a>
                    </li>
                    <li>
                      <address className="my-0">
                        <span className="colorc">Address: </span>
                        <br />
                        <br />
                        <a
                          href="https://maps.google.com/?q=3765+W+Dublin+Dr,+Eagle,+Idaho+83616,+USA"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          3765 W Dublin Dr, Eagle, Idaho 83616, USA
                        </a>
                      </address>
                      <a
                        href="https://maps.google.com/?q=H+167/B,+Gol+Chakar,+Sahiwal,+Pakistan+57000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1"
                      >
                        H 167/B, Gol Chakar, Sahiwal, Pakistan 57000
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <hr />
            <p className="copyright">Copyright © Powered by AI 3D Scanning Solutions Inc.</p>
          </div>
        </footer>
        </div>
      </div>
      <ModelCardVideoModal
        open={Boolean(selectedModel)}
        fileUrl={selectedModel ? modelFileUrl(selectedModel) : null}
        imageUrl={selectedModel ? modelImage(selectedModel) : model1}
        modelId={selectedModel?.id}
        modelTitle={selectedModel?.title || selectedModel?.name || 'Model Preview'}
        modelData={selectedModel}
        platformIsDark={false}
        onClose={() => setSelectedModel(null)}
      />
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </div>
  );
}
