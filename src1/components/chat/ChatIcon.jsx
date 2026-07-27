import React from 'react';
import './ChatIcon.css';
import { FiMessageSquare } from 'react-icons/fi';
import FitBotIcon from '../../assets/images/chatbox.gif';
const ChatIcon = ({ onClick }) => {
  return (
    <button type="button" className="platform-chat-fab" onClick={onClick} aria-label="Open chat">
      <img src={FitBotIcon} alt="Chat Icon" />
    </button>
  );
};
export default ChatIcon;
