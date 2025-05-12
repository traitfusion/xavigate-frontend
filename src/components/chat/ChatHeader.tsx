import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserCircle } from 'lucide-react';
import { Text } from '@/design-system/components';

interface ChatHeaderProps {
  avatar: string | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ avatar }) => {
  const { user } = useAuth();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '1rem 1.5rem',
        backgroundColor: '#F9FAFB',
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      <UserCircle size={20} color="#6366F1" />
      <Text variant="subtitle" style={{ color: '#374151' }}>
        Welcome, <strong>{user?.name || 'Explorer'}</strong> — Avatar:{' '}
        <em>{avatar || 'Default'}</em>
      </Text>
    </div>
  );
};

export default ChatHeader;
