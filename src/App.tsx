import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';

import './i18n';
import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar from './layout/Sidebar';
import MobileHeader from './layout/MobileHeader';

import ChatView from './components/chat/RagChatView';
import AvatarComposer from './components/avatar/AvatarComposer';
import AccountView from './components/account/AccountView';
import { ToastProvider } from './components/toaster/ToastProvider';

import MNTESTView from './components/MNTEST/MNTESTView';
import MNProfileView from './components/MNTEST/MNProfileView';

import AboutXavigate from './content/AboutXavigate';
import PrivacyPolicy from './content/PrivacyPolicy';
import Terms from './content/Terms';

import UIKitPlayground from './playground/UIKitPlayground';
import ResponsiveWrapper from '@/layout/ResponsiveWrapper';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AuthCallback from './components/auth/AuthCallback';
import Onboarding from './components/onboarding/Onboarding';

import { LanguageSelector } from './components/language';
import { useTranslation } from 'react-i18next';

function ContentLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <ResponsiveWrapper>
      <div className="content-layout">
        <div className="content-header">
          <button onClick={() => navigate(-1)} className="back-button">
            ← {t('buttons.previous')}
          </button>
          <LanguageSelector />
        </div>
        <div className="content-body">
          {children}
        </div>
      </div>
    </ResponsiveWrapper>
  );
}

function HelpCenter() {
  const { t } = useTranslation();
  return (
    <ResponsiveWrapper>
      <div className="help-center">
        <h1>{t('help.title')}</h1>
        <p>{t('help.welcome')}</p>
        <h2>{t('help.gettingStarted')}</h2>
        <p>{t('help.gettingStartedDesc')}</p>
        <h2>{t('help.contactSupport')}</h2>
        <p>{t('help.contactSupportDesc')}</p>
      </div>
    </ResponsiveWrapper>
  );
}

function AppContent() {
  const { user, ready, idToken } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeView, setActiveView] = useState(() => localStorage.getItem('activeView') || 'chat');
  const [traitScores, setTraitScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user?.uuid || !idToken) return;

    const fetchTraitScores = async (retries = 5) => {
      try {
        const url = `/api/mntest/result?userId=${user.uuid}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 404) {
          if (retries > 0) {
            console.log(`Trait scores not ready. Retrying in 1s... (${retries} retries left)`);
            setTimeout(() => fetchTraitScores(retries - 1), 1000);
          } else {
            console.warn('Trait scores not found after retries.');
          }
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Fetch failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        setTraitScores(data.traitScores);
        console.log('✅ Trait scores fetched:', data.traitScores);
      } catch (err) {
        console.error('Error fetching trait scores:', err);
      }
    };

    fetchTraitScores();
  }, [user?.uuid, idToken]);

  const isContentPage = ['/about', '/privacy', '/terms', '/help'].includes(location.pathname);

  useEffect(() => {
    localStorage.setItem('activeView', activeView);
  }, [activeView]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'chat':
        return <ChatView />;
      case 'avatar':
        return (
          <AvatarComposer
            uuid={user?.uuid || 'unknown'}
            backendUrl={import.meta.env.VITE_API_URL || 'http://localhost:8010'}
            onSave={(profile) => console.log('✅ Avatar saved:', profile)}
          />
        );
      case 'account':
        return <AccountView />;
      case 'mntest':
        return <MNTESTView />;

      case 'uikit':
        return <UIKitPlayground />;
      default:
        return <div><h1>{t('common.unknownView')}</h1></div>;
    }
  };

  if (!ready) return <div>{t('common.loading')}</div>;
  if (!user) return <Navigate to="/login" replace />;

  const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
  if (!onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {!isContentPage && (
        <Sidebar
          setActiveView={(view: string) => {
            setActiveView(view);
            if (isMobile) setSidebarOpen(false);
          }}
          isVisible={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeView={activeView}
        />
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {!isContentPage && (
          <MobileHeader onToggle={() => isMobile && setSidebarOpen((prev) => !prev)} />
        )}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: isContentPage ? 0 : '2rem',
            backgroundColor: '#fafafa',
          }}
        >
          <Routes>
            <Route path="/about" element={<ContentLayout><AboutXavigate /></ContentLayout>} />
            <Route path="/privacy" element={<ContentLayout><PrivacyPolicy /></ContentLayout>} />
            <Route path="/terms" element={<ContentLayout><Terms /></ContentLayout>} />
            <Route path="/help" element={<ContentLayout><HelpCenter /></ContentLayout>} />
            <Route path="/mntest" element={<MNTESTView />} />
            <Route path="*" element={renderView()} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function ProtectedLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/*" element={<AppContent />} />
        </Route>
      </Routes>
    </Router>
  );
}
