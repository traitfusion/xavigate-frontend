// src/ui-kit/components/chat/ThinkingIndicator.tsx
import React, { useState, useEffect } from 'react';

const ThinkingIndicator: React.FC = () => {
  // Randomly select a thinking phrase to make the AI feel more human
  const [thinkingPhrase, setThinkingPhrase] = useState('Reflecting...');

  // Claude-like thinking phrases
  const thinkingPhrases = [
    'Reflecting...',
    'Considering...',
    'Exploring that...',
    'Processing...',
    'Thinking...',
    'Analyzing...',
  ];

  // Set a random phrase when component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * thinkingPhrases.length);
    setThinkingPhrase(thinkingPhrases[randomIndex]);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        paddingLeft: '16px',
      }}
    >
      <div
        className="pulsating-logo"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#F9F5FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          border: '1px solid #E9D5FF',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            fill="#8B5CF6"
          />
          <path
            d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3ZM12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z"
            fill="#8B5CF6"
          />
        </svg>
      </div>
      <div
        style={{
          fontSize: '16px',
          color: '#6B7280',
          fontFamily: '"Georgia", serif',
          fontStyle: 'italic',
        }}
      >
        {thinkingPhrase}
      </div>
    </div>
  );
};

export default ThinkingIndicator;
