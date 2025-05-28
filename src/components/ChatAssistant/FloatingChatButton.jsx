import React from 'react';
import styles from './ChatAssistant.module.css';

const FloatingChatButton = ({ onClick }) => {
  return (
    <button className={styles.chatFab} onClick={onClick} aria-label="Open chat assistant">
      {/* Placeholder for an icon - we can use an SVG or a character for now */}
      💬
      {/* We can add a small 'AI' badge here later if desired */}
    </button>
  );
};

export default FloatingChatButton;
