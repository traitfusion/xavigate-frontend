import React from 'react';

// Dummy message type
interface Message {
  sender: 'user' | 'assistant' | string;
  text: string;
  timestamp?: string;
}

// Dummy MessageItem component for now — replace with real one later
const MessageItem = ({ message, isUser }: { message: Message; isUser: boolean }) => (
  <div
    style={{
      textAlign: isUser ? 'right' : 'left',
      margin: '4px 0',
      padding: '8px',
      borderRadius: '6px',
      backgroundColor: isUser ? '#DCFCE7' : '#F1F5F9',
      display: 'inline-block',
      maxWidth: '80%',
    }}
  >
    {message.text}
  </div>
);

interface MessageGroupProps {
  messages: Message[];
}

const MessageGroup: React.FC<MessageGroupProps> = ({ messages }) => {
  if (messages.length === 0) return null;

  const groupedMessages = [];
  let currentGroup = [messages[0]];
  let currentSender = messages[0].sender;

  for (let i = 1; i < messages.length; i++) {
    const message = messages[i];
    if (message.sender === currentSender) {
      currentGroup.push(message);
    } else {
      groupedMessages.push({
        sender: currentSender,
        messages: [...currentGroup],
        timestamp: currentGroup[currentGroup.length - 1].timestamp || '',
      });
      currentGroup = [message];
      currentSender = message.sender;
    }
  }

  groupedMessages.push({
    sender: currentSender,
    messages: [...currentGroup],
    timestamp: currentGroup[currentGroup.length - 1].timestamp || '',
  });

  return (
    <div>
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex}>
          {group.messages.map((message, messageIndex) => (
            <MessageItem key={messageIndex} message={message} isUser={message.sender === 'user'} />
          ))}

          {groupIndex < groupedMessages.length - 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '16px 0',
                color: '#9CA3AF',
                fontSize: '12px',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              <div
                style={{
                  height: '1px',
                  flex: 1,
                  backgroundColor: '#E5E7EB',
                  marginRight: '12px',
                  maxWidth: '100px',
                }}
              />
              {group.timestamp}
              <div
                style={{
                  height: '1px',
                  flex: 1,
                  backgroundColor: '#E5E7EB',
                  marginLeft: '12px',
                  maxWidth: '100px',
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageGroup;
