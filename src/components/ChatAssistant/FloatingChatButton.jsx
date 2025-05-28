import React from 'react';
import styles from './ChatAssistant.module.css';
import aiChatBubbleIcon from '../../assets/images/litle-lemon-ai-chat-bubble.png';

const FloatingChatButton = ({ onClick }) => {
  return (
    <button className={styles.chatFab} onClick={onClick} aria-label="Open chat assistant">
      <img src={aiChatBubbleIcon} alt="Little Lemon AI Chat Assistant" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> {/* Use contain to ensure full image visibility */}
      {/* We can add a small 'AI' badge here later if desired */}
    </button>
  );
};

export default FloatingChatButton;
