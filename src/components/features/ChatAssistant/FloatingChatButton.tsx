import React from 'react';
import styles from './ChatAssistant.module.css';
import aiChatBubbleIcon from '../../../assets/images/litle-lemon-ai-chat-bubble.png';

export interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => (
  <button className={styles.chatFab} onClick={onClick} aria-label="Open chat assistant">
    <img
      src={aiChatBubbleIcon}
      alt="Little Lemon AI Chat Assistant"
      className={styles.chatFabImage}
    />
  </button>
);

export default FloatingChatButton;
