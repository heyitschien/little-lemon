import React, { useState } from 'react';
import styles from './ChatAssistant.module.css';

// Simple functional component for a single quick reply button
const QuickReplyButton = ({ text, onClick }) => (
  <button 
    type="button" // Prevent form submission
    className={styles.quickReplyButton} 
    onClick={() => onClick(text)}
  >
    {text}
  </button>
);

const ChatInput = ({ onSendMessage, isSending }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isSending) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  // Predefined quick replies
  const quickReplies = [
    "What are your vegetarian options?",
    "Show me desserts",
    "Tell me about your appetizers"
  ];

  // Handler for quick reply clicks
  const handleQuickReplyClick = (text) => {
    if (!isSending) {
      onSendMessage(text); // Send the quick reply text as a message
      // Optionally, you might want to clear the input field or give other feedback
    }
  };

  return (
    <div className={styles.chatInputArea}> {/* Wrapper for form and quick replies */}
      <form onSubmit={handleSubmit} className={styles.chatInputForm}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className={styles.chatInputField}
          disabled={isSending}
        />
        <button type="submit" className={styles.chatSendButton} disabled={isSending}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
      <div className={styles.quickRepliesContainer}>
        {quickReplies.map((replyText) => (
          <QuickReplyButton 
            key={replyText} 
            text={replyText} 
            onClick={handleQuickReplyClick} 
          />
        ))}
      </div>
    </div>
  );
};

export default ChatInput;
