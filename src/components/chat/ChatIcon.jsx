import React from 'react';
import './ChatIcon.css';
import { FiMessageSquare } from 'react-icons/fi';
import FitBotIcon from '../../assets/images/chat.gif';
const ChatIcon = ({ onClick }) => {
  return (
    <button className="chat-icon" onClick={onClick}>
      {' '}
      <img src={FitBotIcon} alt="Chat Icon" />{' '}
    </button>
  );
};
export default ChatIcon;
