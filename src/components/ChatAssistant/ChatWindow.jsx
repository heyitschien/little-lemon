import React, { useEffect, useRef } from 'react';
import styles from './ChatAssistant.module.css';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatWindow = ({ isOpen, onClose, messages, onSendMessage, isSending }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.chatWindow} role="dialog" aria-modal="true" aria-labelledby="chatWindowTitle">
      <div className={styles.chatHeader}>
        <h2 id="chatWindowTitle" className={styles.chatTitle}>Little Lemon Assistant</h2>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close chat">
          &times; {/* Simple 'x' for close */}
        </button>
      </div>
      <div className={styles.chatMessagesArea}>
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.chatInputAreaContainer}>
        <ChatInput onSendMessage={onSendMessage} isSending={isSending} />
      </div>
    </div>
  );
};

export default ChatWindow;
