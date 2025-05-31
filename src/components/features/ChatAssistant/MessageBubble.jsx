import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './ChatAssistant.module.css';
import MenuItemCardChat from './MenuItemCardChat';
import ErrorBoundary from './ErrorBoundary';
import LoadingIndicator from './LoadingIndicator'; // Import LoadingIndicator

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleClass = isUser ? styles.userMessage : styles.aiMessage;
  const alignClass = isUser ? styles.messageRight : styles.messageLeft;

  // Clean up the AI's text by removing the [ITEM_IDS:...] part before rendering
  const cleanMessageText = (text) => {
    if (typeof text === 'string') {
      return text.replace(/\[ITEM_IDS:.*?\]/g, '').trim();
    }
    return ''; // Return empty string if text is not a string (e.g. null or undefined)
  };

  const displayMessageText = cleanMessageText(message.text);

  if (message.sender === 'ai' && message.itemCards && message.itemCards.length > 0) {
    console.log(`MessageBubble: Rendering itemCards for AI message id ${message.id}:`, JSON.stringify(message.itemCards.map(item => item ? {id: item.id, name: item.name} : {id: 'null_item'})));
  }

  return (
    <div className={`${styles.messageBubbleContainer} ${alignClass}`}>
      <div className={`${styles.messageBubble} ${bubbleClass}`}>
        {isUser ? (
          <ReactMarkdown>{message.text}</ReactMarkdown>
        ) : message.isLoading ? ( // Check for isLoading flag for AI messages
          <LoadingIndicator />
        ) : (
          <ErrorBoundary> {/* Wrap AI message content */}
            {displayMessageText && <ReactMarkdown>{displayMessageText}</ReactMarkdown>}
            {message.itemCards && message.itemCards.length > 0 && (
              <div className={styles.itemCardsContainer}>
                {message.itemCards.map((item) => (
                  item ? <MenuItemCardChat key={item.id} item={item} /> : null
                ))}
              </div>
            )}
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
