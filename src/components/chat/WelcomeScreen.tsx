// src/ui-kit/components/chat/WelcomeScreen.tsx
import React from 'react';

interface WelcomeScreenProps {
  onSuggestionClick?: (text: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    {
      title: 'Trait Recognition',
      question: 'What traits might be showing up in my daily patterns?',
      context: 'Explore your natural behavioral tendencies',
    },
    {
      title: 'Alignment Diagnosis',
      question: 'I feel drained after work meetings. Could this be misalignment?',
      context: 'Identify potential misalignments in specific contexts',
    },
    {
      title: 'Flow States',
      question: 'When do I experience flow and how can I create more of it?',
      context: 'Understand your natural alignment zones',
    },
    {
      title: 'Relationship Patterns',
      question: 'How might my traits influence my interactions with others?',
      context: 'Explore interpersonal dynamics through trait awareness',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        textAlign: 'center',
        maxWidth: '650px',
        margin: '0 auto',
        fontFamily: '"Georgia", serif',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#F9F5FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <svg
          width="40"
          height="40"
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

      <h2
        style={{
          fontSize: '26px',
          fontWeight: '600',
          marginBottom: '16px',
          color: '#111827',
          fontFamily: '"Georgia", serif',
        }}
      >
        Welcome to Your Alignment Journey
      </h2>

      <p
        style={{
          fontSize: '17px',
          lineHeight: '1.7',
          color: '#4B5563',
          marginBottom: '24px',
          maxWidth: '600px',
        }}
      >
        I'm here to help you explore your natural traits and find greater alignment in your life.
        Our conversations will be most helpful when you share specific situations, patterns, or
        questions about how you engage with the world.
      </p>

      <div
        style={{
          backgroundColor: '#F9F5FF',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          width: '100%',
          textAlign: 'left',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            color: '#6D28D9',
            marginBottom: '16px',
            fontWeight: '500',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            textAlign: 'center',
          }}
        >
          Conversation Starters
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '12px',
          }}
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick && onSuggestionClick(suggestion.question)}
              style={{
                padding: '16px',
                backgroundColor: 'white',
                border: '1px solid #E9D5FF',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F3FF';
                e.currentTarget.style.borderColor = '#C4B5FD';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#E9D5FF';
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6D28D9',
                  marginBottom: '4px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {suggestion.title}
              </span>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: '400',
                  color: '#111827',
                  marginBottom: '6px',
                  fontFamily: '"Georgia", serif',
                }}
              >
                "{suggestion.question}"
              </span>
              <span
                style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {suggestion.context}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p
        style={{
          fontSize: '15px',
          color: '#6B7280',
          fontStyle: 'italic',
          maxWidth: '450px',
          lineHeight: '1.6',
        }}
      >
        Your conversation is private and designed to help you explore alignment in your own life
      </p>
    </div>
  );
};

export default WelcomeScreen;
