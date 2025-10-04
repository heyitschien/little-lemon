import React, { useEffect, useRef } from 'react';
import styles from './ChatAssistant.module.css';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import type { ChatMessageList } from '../../../types/chat';

export interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessageList;
  onSendMessage: (value: string) => void | Promise<void>;
  isSending: boolean;
  onClearChat: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isSending,
  onClearChat
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.chatWindow} role="dialog" aria-modal="true" aria-labelledby="chatWindowTitle">
      <div className={styles.chatHeader}>
        <h2 id="chatWindowTitle" className={styles.chatTitle}>
          Little Lemon Assistant
        </h2>
        <div>
          <button
            className={`${styles.headerButton} ${styles.clearChatButton}`}
            onClick={onClearChat}
            aria-label="Clear chat history"
          >
            Clear Chat
          </button>
          <button
            className={`${styles.headerButton} ${styles.closeBtn}`}
            onClick={onClose}
            aria-label="Close chat"
          >
            &times;
          </button>
        </div>
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
