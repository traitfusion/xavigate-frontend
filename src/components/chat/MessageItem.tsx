import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Message } from './types';
import { Clipboard } from 'lucide-react';

type MessageItemProps = {
  message: Message;
  isUser: boolean;
};

const MessageItem: React.FC<MessageItemProps> = ({ message, isUser }) => {
  const [copied, setCopied] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter style={materialLight} language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code
        className={className}
        style={{
          backgroundColor: '#F1F5F9',
          padding: '0.2em 0.4em',
          borderRadius: '3px',
          fontFamily: '"Menlo", "Monaco", "Courier New", monospace',
          fontSize: '0.9em',
          color: '#3B82F6',
        }}
        {...props}
      >
        {children}
      </code>
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (isUser) {
    return (
      <div
        className="message-in"
        style={{
          display: 'flex',
          justifyContent: 'flex-start', // changed from flex-end
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            backgroundColor: '#EFF6FF',
            borderRadius: '16px',
            padding: '12px 16px',
            maxWidth: '75%',
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#111827',
            fontFamily: '"Georgia", serif',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(219, 234, 254, 0.8)',
          }}
        >
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div
      className="message-in"
      style={{
        marginBottom: '16px',
        paddingLeft: '16px',
        maxWidth: '85%',
        position: 'relative',
      }}
      onMouseEnter={() => setShowIcon(true)}
      onMouseLeave={() => {
        setShowIcon(false);
        setCopied(false);
        setShowTooltip(false);
      }}
    >
      <div
        style={{
          fontSize: '16px',
          lineHeight: '1.65',
          color: '#111827',
          fontFamily: '"Georgia", serif',
          paddingBottom: '32px',
          WebkitFontSmoothing: 'antialiased',
          position: 'relative',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeBlock,
            p: ({ node, ...props }) => (
              <p style={{ marginTop: '0.4em', marginBottom: '0.4em' }} {...props} />
            ),
            h1: ({ node, ...props }) => (
              <h1
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  margin: '1em 0 0.5em',
                  color: '#111827',
                }}
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  margin: '1em 0 0.5em',
                  color: '#111827',
                }}
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '1em 0 0.5em',
                  color: '#111827',
                }}
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul style={{ paddingLeft: '1.5em', margin: '0.5em 0' }} {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol style={{ paddingLeft: '1.5em', margin: '0.5em 0' }} {...props} />
            ),
            li: ({ node, ...props }) => <li style={{ marginBottom: '0.3em' }} {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote
                style={{
                  borderLeft: '4px solid #E9D5FF',
                  paddingLeft: '1em',
                  marginLeft: 0,
                  marginRight: 0,
                  fontStyle: 'italic',
                  color: '#4B5563',
                }}
                {...props}
              />
            ),
            a: ({ node, ...props }) => (
              <a
                style={{
                  color: '#8B5CF6',
                  textDecoration: 'underline',
                }}
                {...props}
              />
            ),
            table: ({ node, ...props }) => (
              <table
                style={{ borderCollapse: 'collapse', width: '100%', margin: '1em 0' }}
                {...props}
              />
            ),
            th: ({ node, ...props }) => (
              <th
                style={{
                  border: '1px solid #E2E8F0',
                  padding: '8px 12px',
                  textAlign: 'left',
                  backgroundColor: '#F8FAFC',
                  fontWeight: '600',
                }}
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                style={{ border: '1px solid #E2E8F0', padding: '8px 12px', textAlign: 'left' }}
                {...props}
              />
            ),
          }}
        >
          {message.text}
        </ReactMarkdown>

        {/* 📎 Right-aligned copy icon with tooltip */}
        {showIcon && (
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '4px',
            }}
          >
            <div
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={handleCopy}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '24px',
                cursor: 'pointer',
              }}
            >
              {showTooltip && !copied && (
                <div
                  style={{
                    position: 'absolute',
                    top: '125%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#F3F4F6',
                    color: '#374151',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    pointerEvents: 'none',
                    opacity: 0.95,
                  }}
                >
                  Copy
                </div>
              )}

              {copied ? (
                <span style={{ color: '#111827', fontSize: '14px' }}>✔</span>
              ) : (
                <Clipboard size={16} color="#6B7280" />
              )}
            </div>
          </div>
        )}
      </div>

      {message.sources && message.sources.length > 0 && (
        <div
          style={{
            marginTop: '16px',
            fontSize: '14px',
            color: '#6B7280',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '12px 16px',
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ fontWeight: '500', marginBottom: '8px' }}>Sources:</div>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {message.sources.map((source, index) => (
              <li key={index} style={{ fontSize: '13px', marginBottom: '4px' }}>
                {source.term || source.id || `Source ${index + 1}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
