// src/ui-kit/components/chat/WelcomeScreen.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
  onSuggestionClick?: (text: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionClick }) => {
  const { t } = useTranslation();
  // Load suggestions from translations
  const suggestions: Array<{ title: string; question: string; context: string }> =
    t('chat.suggestions', { returnObjects: true });

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
        {t('chat.welcomeTitle')}
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
        {t('chat.welcomeDescription')}
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
          {t('chat.convoStartersTitle')}
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
        {t('chat.finalPrivacyNote')}
      </p>
    </div>
  );
};

export default WelcomeScreen;
