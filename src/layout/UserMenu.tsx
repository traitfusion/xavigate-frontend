import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  ChevronUp,
  User,
  Settings,
  LogOut,
  Info,
  HelpCircle,
  Shield,
  FileText,
} from 'lucide-react';

type UserMenuProps = {
  setActiveView: (view: string) => void;
};

export default function UserMenu({ setActiveView }: UserMenuProps) {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setUserMenuOpen(false);
    }, 300);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const menuItemStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.85rem',
  };

  return (
    <div
      ref={menuRef}
      style={{
        padding: '1rem',
        borderTop: '1px solid #eee',
        position: 'relative',
      }}
    >
      <div
        onClick={() => setUserMenuOpen((prev) => !prev)}
        style={{
          fontSize: '0.85rem',
          padding: '0.5rem',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: userMenuOpen ? '#f3f4f6' : 'transparent',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <User size={14} style={{ marginRight: '8px', flexShrink: 0 }} />
          <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 1 }}>
            {user?.name || 'Anonymous'}
          </strong>
        </div>
        <ChevronUp
          size={14}
          style={{
            transform: userMenuOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </div>

      {userMenuOpen && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '1rem',
            right: '1rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            marginBottom: '0.5rem',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
          }}
        >
          {/* 1. Terms of Service */}
          <div
            onClick={() => {
              navigate('/terms');
              setUserMenuOpen(false);
            }}
            style={menuItemStyle}
          >
            <FileText size={14} style={{ marginRight: '16px', color: '#f59e0b' }} />
            {t('menu.terms')}
          </div>

          {/* 2. Privacy Policy */}
          <div
            onClick={() => {
              navigate('/privacy');
              setUserMenuOpen(false);
            }}
            style={menuItemStyle}
          >
            <Shield size={14} style={{ marginRight: '16px', color: '#10b981' }} />
            {t('menu.privacy')}
          </div>

          {/* 3. About Xavigate */}
          <div
            onClick={() => {
              navigate('/about');
              setUserMenuOpen(false);
            }}
            style={menuItemStyle}
          >
            <Info size={14} style={{ marginRight: '16px', color: '#4f46e5' }} />
            {t('menu.about')}
          </div>

          {/* 4. Help Center */}
          <div
            onClick={() => {
              navigate('/help');
              setUserMenuOpen(false);
            }}
            style={menuItemStyle}
          >
            <HelpCircle size={14} style={{ marginRight: '16px', color: '#3b82f6' }} />
            {t('menu.help')}
          </div>

          {/* 5. Account Settings */}
          <div
            onClick={() => {
              setActiveView('account');
              setUserMenuOpen(false);
            }}
            style={menuItemStyle}
          >
            <Settings size={14} style={{ marginRight: '16px' }} />
            {t('menu.accountSettings')}
          </div>

          {/* 6. Sign Out */}
          <div
            onClick={() => {
              signOut();
              setUserMenuOpen(false);
              // redirect to login screen
              navigate('/login');
            }}
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              color: '#f43f5e',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            <LogOut size={14} style={{ marginRight: '16px' }} />
            {t('menu.signOut')}
          </div>
        </div>
      )}
    </div>
  );
}
