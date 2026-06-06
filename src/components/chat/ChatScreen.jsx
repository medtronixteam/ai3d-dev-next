import React, { useState, useEffect, useRef } from 'react';
import './ChatScreen.css';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import FitBotIcon from '../../assets/images/chatbox.gif';
import UserAvatar from '../../assets/images/Profile.png';
import axios from 'axios';
import { baseURL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ChatScreen = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'How can I assist you today?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);
  const { token } = useAuth();
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);

  // Fetch user profile when chat opens and set avatar image
  useEffect(() => {
    let cancelled = false;
    const toStorageUrl = (path) => `https://app.ai3dscanning.com/storage/${String(path || '').replace(/^\/+/, '')}`;
    async function fetchProfile() {
      if (!token) return;
      try {
        const res = await axios.get(`${baseURL}/user`, { headers: { Authorization: `Bearer ${token}` } });
        const profile = res.data?.user || res.data;
        if (cancelled || !profile) return;
        let url = null;
        if (profile.avatar) {
          url = profile.avatar.startsWith('http') ? profile.avatar : toStorageUrl(profile.avatar);
        } else if (profile.image) {
          url = profile.image.startsWith('http') ? profile.image : toStorageUrl(profile.image);
        }
        if (url) setUserAvatarUrl(url);
      } catch (e) {
        // silent fail, fallback image will be used
      }
    }
    fetchProfile();
    return () => { cancelled = true; };
  }, [token]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage) return;

    const uniqueId = Date.now() + Math.floor(Math.random() * 1000000);
    const userMessage = { id: uniqueId, text: trimmedMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const encodedQuery = encodeURIComponent(trimmedMessage);
      const url = `https://customer-chatbot.ai3dscanning.com/process_chat/query?query=${encodedQuery}`;
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMessages(prev => [
        ...prev,
        {
          id: uniqueId + 1,
          text: data.response || "I'm not sure how to respond.",
          sender: 'bot'
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: uniqueId + 2,
          text: 'Sorry, something went wrong. Please try again.',
          sender: 'bot'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <button className="back-btn" onClick={onClose}>
          <FiArrowLeft />
        </button>
        <img src={FitBotIcon} alt="FitBot" className="bot-avatar" />
        <div className="bot-info">
          <span className="bot-name">FitBot</span>
          <span className="bot-status">Always active</span>
        </div>
      </div>
      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((message, index) => (
          <React.Fragment key={message.id}>
            <div className={`message ${message.sender}`}>
              {message.sender === 'bot' && (
                <img src={FitBotIcon} alt="FitBot" className="message-avatar" />
              )}
              <div className="message-content">
                <p>{message.text}</p>
              </div>
              {message.sender === 'user' && (
                <img src={userAvatarUrl || UserAvatar} alt="User" className="message-avatar" />
              )}
            </div>
            {/* Very basic consecutive message logic */}
            {(messages[index + 1]?.sender !== message.sender) && <div className="message-spacer"></div>}
          </React.Fragment>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type a message...."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
        />
        <button className="send-btn" onClick={handleSendMessage} disabled={isLoading}>
          <FiSend />
        </button>
      </div>
      <div className="help-text">
        Need more help? Help our <Link to="/3dio/support">visit center</Link>
      </div>
    </div>
  );
};

export default ChatScreen; 