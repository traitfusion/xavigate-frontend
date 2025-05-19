import React, { useState, useEffect } from 'react';
import { useScreenSize } from '@/layout/useScreenSize';
import { useAuth } from '@/context/AuthContext';
import { Lock, User } from 'lucide-react';
import ResponsiveWrapper from '@/layout/ResponsiveWrapper';
import { useTranslation } from 'react-i18next';

import ProfileTab from './account-tabs/ProfileTab';
import PasswordTab from './account-tabs/PasswordTab';
import AccountSidebar from './account-tabs/AccountSidebar';

export default function AccountView() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  // Use screen size hook for responsive layout
  const { isMobile, isTablet } = useScreenSize();
  const isNarrow = isMobile || isTablet;

  return (
    <ResponsiveWrapper
      style={{
        maxWidth: '100%',
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
          {t('accountView.title')}
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#555',
            margin: 0,
          }}
        >
          {t('accountView.description')}
        </p>
      </div>

      {/* Layout: sidebar + content */}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          flexDirection: isNarrow ? 'column' : 'row',
        }}
      >
        <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main content area */}
        {(() => {
          // Calculate max width: when narrow (mobile/tablet), full width; else subtract sidebar + gap
          const sidebarWidth = isNarrow ? 0 : 240; // Sidebar occupies space only on desktop
          const contentMax = isNarrow
            ? '100%'
            : `calc(100% - ${sidebarWidth}px - 32px)`;
          return (
            <div
              style={{
                flex: 1,
                maxWidth: contentMax,
                width: '100%',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '24px',
                border: '1px solid #eee',
                boxSizing: 'border-box',
                minWidth: 0,
                overflowX: 'auto',
              }}
            >
              {activeTab === 'profile' && user && <ProfileTab user={user} />}
              {activeTab === 'password' && <PasswordTab />}
            </div>
          );
        })()}
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
        {t('accountView.footer', { year: new Date().getFullYear() })}
      </div>
    </ResponsiveWrapper>
  );
}
