import React, { useRef, useState, useEffect } from 'react';
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';
import './YouTubeCleanPlayer.css';

const YouTubeCleanPlayer = ({
  videoId = 'ElOdxYgLfV0',
  title = 'AI 3D Scanning Demo',
  autoPlay = false,
  startMuted = false,
}) => {
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(startMuted);
  const [isHovered, setIsHovered] = useState(false);
  const [origin, setOrigin] = useState('https://ai3dscanning.com');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Send message to YouTube iframe via JS API
  const sendCommand = (func, args = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    }
  };

  const handleTogglePlay = (e) => {
    e?.stopPropagation();
    if (isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendCommand('playVideo');
      setIsPlaying(true);
    }
  };

  const handleToggleMute = (e) => {
    e?.stopPropagation();
    if (isMuted) {
      sendCommand('unMute');
      setIsMuted(false);
    } else {
      sendCommand('mute');
      setIsMuted(true);
    }
  };

  // Construct iframe embed URL
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&origin=${encodeURIComponent(origin)}${autoPlay ? '&autoplay=1' : ''}${startMuted ? '&mute=1' : ''}`;

  return (
    <div
      className="yt-clean-player-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleTogglePlay}
      role="region"
      aria-label={title}
    >
      <iframe
        ref={iframeRef}
        className="yt-clean-iframe"
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />

      {/* Transparent Click Interceptor to handle smooth custom clicks */}
      <div className="yt-click-layer" />

      {/* Big Center Play Button (Shown when video is paused) */}
      {!isPlaying && (
        <div className="yt-center-play-wrapper">
          <button
            type="button"
            className="yt-big-play-btn"
            onClick={handleTogglePlay}
            aria-label="Play video"
          >
            <FiPlay size={36} style={{ marginLeft: 4 }} />
          </button>
        </div>
      )}

      {/* Floating Bottom Minimal Controls Bar (Play/Pause & Speaker Mute/Unmute) */}
      <div className={`yt-custom-controls-bar ${isHovered || !isPlaying ? 'visible' : ''}`}>
        {/* Play / Pause Toggle */}
        <button
          type="button"
          className="yt-control-btn"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} style={{ marginLeft: 2 }} />}
        </button>

        {/* Speaker / Mute Toggle */}
        <button
          type="button"
          className="yt-control-btn"
          onClick={handleToggleMute}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          title={isMuted ? 'Unmute sound' : 'Mute sound'}
        >
          {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
        </button>
      </div>
    </div>
  );
};

export default YouTubeCleanPlayer;
