type MessageBubbleProps = {
  text: string;
  timestamp: string;
  sender: 'user' | 'assistant';
};

export default function MessageBubble({ text, timestamp, sender }: MessageBubbleProps) {
  const isUser = sender === 'user';

  return (
    <div
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        backgroundColor: isUser ? '#e0f7fa' : '#f4f4f4',
        maxWidth: '85%',
        borderRadius: '12px',
        padding: '0.75rem',
        marginBottom: '0.25rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <p
        style={{
          marginBottom: '0.25rem',
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#111827',
          margin: 0,
        }}
      >
        {text}
      </p>
      <span
        style={{
          fontSize: '12px',
          color: '#888',
        }}
      >
        {timestamp}
      </span>
    </div>
  );
}
