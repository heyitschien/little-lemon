import React, { useState } from 'react';
import styles from './ChatAssistant.module.css';

interface QuickReplyButtonProps {
  text: string;
  onClick: (value: string) => void;
}

const QuickReplyButton: React.FC<QuickReplyButtonProps> = ({ text, onClick }) => (
  <button
    type="button"
    className={styles.quickReplyButton}
    onClick={() => onClick(text)}
  >
    {text}
  </button>
);

export interface ChatInputProps {
  onSendMessage: (value: string) => void;
  isSending: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isSending }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (inputValue.trim() && !isSending) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const quickReplies: string[] = [
    'What are your vegetarian options?',
    'Show me desserts',
    'Tell me about your appetizers'
  ];

  const handleQuickReplyClick = (text: string) => {
    if (!isSending) {
      onSendMessage(text);
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className={styles.chatInputArea}>
      <form onSubmit={handleSubmit} className={styles.chatInputForm}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
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
