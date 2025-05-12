import MessageBubble from './MessageBubble';

type Message = {
  sender: 'user' | 'assistant';
  text: string;
  timestamp?: string;
};

type MessageListProps = {
  messages: Message[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
};

export default function MessageList({ messages, bottomRef }: MessageListProps) {
  const grouped = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const prev = messages[i - 1];
    if (prev && prev.sender === msg.sender) {
      grouped[grouped.length - 1].messages.push(msg);
    } else {
      grouped.push({
        sender: msg.sender,
        avatar: msg.sender === 'user' ? '🧑' : '🤖',
        messages: [msg],
      });
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '1rem',
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
      }}
    >
      {grouped.map((group, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            flexDirection: group.sender === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {group.avatar}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {group.messages.map((msg, i) => (
              <MessageBubble
                key={i}
                sender={group.sender}
                text={msg.text}
                timestamp={msg.timestamp || ''}
              />
            ))}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
