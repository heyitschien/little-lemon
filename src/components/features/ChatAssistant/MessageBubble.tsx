import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './ChatAssistant.module.css';
import MenuItemCardChat from './MenuItemCardChat';
import ErrorBoundary from './ErrorBoundary';
import LoadingIndicator from './LoadingIndicator';
import type { ChatMessage } from '../../../types/chat';

export interface MessageBubbleProps {
  message: ChatMessage;
}

const removeItemIdTag = (text: string): string => text.replace(/\[ITEM_IDS:.*?\]/g, '').trim();

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleClass = isUser ? styles.userMessage : styles.aiMessage;
  const alignClass = isUser ? styles.messageRight : styles.messageLeft;

  const displayMessageText = removeItemIdTag(message.text);

  if (message.sender === 'ai' && message.itemCards && message.itemCards.length > 0) {
    console.log(
      `MessageBubble: Rendering itemCards for AI message id ${message.id}:`,
      JSON.stringify(message.itemCards.map(item => (item ? { id: item.id, name: item.name } : { id: 'null_item' })))
    );
  }

  return (
    <div className={`${styles.messageBubbleContainer} ${alignClass}`}>
      <div className={`${styles.messageBubble} ${bubbleClass}`}>
        {isUser ? (
          <ReactMarkdown>{message.text}</ReactMarkdown>
        ) : message.isLoading ? (
          <LoadingIndicator />
        ) : (
          <ErrorBoundary>
            {displayMessageText && <ReactMarkdown>{displayMessageText}</ReactMarkdown>}
            {message.itemCards && message.itemCards.length > 0 && (
              <div className={styles.itemCardsContainer}>
                {message.itemCards.map(item => (item ? <MenuItemCardChat key={item.id} item={item} /> : null))}
              </div>
            )}
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
