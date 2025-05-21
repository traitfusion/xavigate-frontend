import React from 'react';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/Xavigate_Logo.svg';
import { useScreenSize } from '@/layout/useScreenSize';
import UserMenu from './UserMenu';
// Language selector for choosing app language
import { LanguageSelector } from '@/components/language';
import { Text, Button } from '@/design-system/components';
import Icon from '@/design-system/components/Icon';
import { COLORS } from '@/design-system/theme/colors';
import { SPACING } from '@/design-system/theme/spacing';
import { MessageSquare, Compass, User, UserCircle, X } from 'lucide-react';

type SidebarProps = {
  setActiveView: (view: string) => void;
  isVisible: boolean;
  onClose: () => void;
  activeView?: string;
};

export default function Sidebar({ setActiveView, isVisible, onClose, activeView }: SidebarProps) {
  const { t } = useTranslation();
  const { isMobile } = useScreenSize();
  if (!isVisible) return null;

  const navItems = [
    {
      id: 'chat',
      label: t('navigation.chat'),
      icon: (
        <Icon size={18} color={COLORS.primary[500]} style={{ marginRight: SPACING['2'] }}>
          <MessageSquare />
        </Icon>
      ),
    },
    {
      id: 'mntest',
      label: t('navigation.assessment'),
      icon: (
        <Icon size={18} color={COLORS.accent.green[500]} style={{ marginRight: SPACING['2'] }}>
          <User />
        </Icon>
      ),
    },
  ];

  return (
    <div
      style={{
        // Full-height sidebar with bottom-fixed actions
        width: isMobile ? '200px' : '260px',
        minWidth: isMobile ? '200px' : '260px',
        backgroundColor: '#fff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: isMobile ? 100 : undefined,
        padding: '1.5rem 1rem',
        boxSizing: 'border-box',
      }}
    >
      {/* Logo (and close on mobile) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <img
          src={logo}
          alt="Xavigate logo"
          style={{ maxWidth: '120px', height: 'auto', margin: 0 }}
        />
        {isMobile && (
          <Button variant="ghost" onClick={onClose} style={{ padding: 4, minWidth: 'auto' }}>
            <X size={20} color="#6B7280" />
          </Button>
        )}
      </div>

      {/* Navigation items */}
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => setActiveView(item.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            textAlign: 'left',
            backgroundColor: item.id === activeView ? '#eef2ff' : 'transparent',
            color: item.id === activeView ? '#4338ca' : '#111827',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            fontWeight: item.id === activeView ? 600 : 400,
            fontSize: '0.95rem',
            cursor: 'pointer',
            marginBottom: '0.25rem',
            minWidth: 'auto',
          }}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Language selector above user menu */}
        <LanguageSelector />
        <UserMenu setActiveView={setActiveView} />
      </div>
    </div>
  );
}
