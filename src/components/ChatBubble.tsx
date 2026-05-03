import React from 'react';
import styles from './ChatBubble.module.css';

interface ChatBubbleProps {
  message: string;
  sender: 'user' | 'ai';
  timestamp?: string;
}

export default function ChatBubble({ message, sender, timestamp }: ChatBubbleProps) {
  return (
    <div className={`${styles.bubbleWrapper} ${sender === 'user' ? styles.userWrapper : styles.aiWrapper}`}>
      {sender === 'ai' && (
        <div className={styles.avatar}>
          <img src="/icon.svg" alt="Stewart" />
        </div>
      )}
      <div className={`${styles.bubble} ${sender === 'user' ? styles.userBubble : styles.aiBubble}`}>
        <p>{message}</p>
        {timestamp && <span className={styles.timestamp}>{timestamp}</span>}
      </div>
    </div>
  );
}
