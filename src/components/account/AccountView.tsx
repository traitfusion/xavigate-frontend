import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lock, User } from 'lucide-react';

import ProfileTab from './account-tabs/ProfileTab';
import PasswordTab from './account-tabs/PasswordTab';
import AccountSidebar from './account-tabs/AccountSidebar';

export default function AccountView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Account Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#111',
            margin: '0 0 8px 0',
          }}
        >
          Account Settings
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#555',
            margin: 0,
          }}
        >
          Manage your profile and account settings
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '32px',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        {/* Sidebar */}
        <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main content area */}
        <div
          style={{
            flex: '1',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            border: '1px solid #eee',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {activeTab === 'profile' && user && <ProfileTab user={user} />}
          {activeTab === 'password' && <PasswordTab />}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '32px',
          padding: '16px 0',
          borderTop: '1px solid #eee',
          textAlign: 'center',
          color: '#666',
          fontSize: '12px',
        }}
      >
        © 2025 Xavigate. All rights reserved.
      </div>
    </div>
  );
}
