import React from 'react';
import { Lock, User } from 'lucide-react';

type AccountSidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function AccountSidebar({ activeTab, setActiveTab }: AccountSidebarProps) {
  return (
    <div
      style={{
        width: window.innerWidth < 768 ? '100%' : '240px',
        flexShrink: 0,
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: '#666',
            marginBottom: '8px',
            letterSpacing: '0.05em',
          }}
        >
          Personal
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: window.innerWidth < 768 ? 'row' : 'column',
            gap: '8px',
          }}
        >
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'profile' ? '#eef2ff' : 'transparent',
              color: activeTab === 'profile' ? '#4338ca' : '#333',
              fontWeight: activeTab === 'profile' ? 600 : 400,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <User size={16} style={{ marginRight: '8px' }} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'password' ? '#eef2ff' : 'transparent',
              color: activeTab === 'password' ? '#4338ca' : '#333',
              fontWeight: activeTab === 'password' ? 600 : 400,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <Lock size={16} style={{ marginRight: '8px' }} />
            Password
          </button>
        </div>
      </div>
    </div>
  );
}
