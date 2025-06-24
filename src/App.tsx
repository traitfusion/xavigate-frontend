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
import { Button } from '@/design-system/components';

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

// ADD THIS IMPORT FOR CONFIG PANEL
import ConfigPanel from './components/admin/ConfigPanel';


function ContentLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  // Paths for static content pages (About, Privacy, Terms, Help)
  const staticPaths = ['/about', '/privacy', '/terms', '/help'];
  const isStaticPage = staticPaths.includes(location.pathname);
  const showLanguageSelector = !isStaticPage;

  return (
    <ResponsiveWrapper>
      <div className="content-layout">
        <div className="content-header">
          {isStaticPage ? (
            <a
              href="#"
              onClick={e => { e.preventDefault(); navigate(-1); }}
              className="back-link"
            >
              ← {t('buttons.previous')}
            </a>
          ) : (
            <button onClick={() => navigate(-1)} className="back-button">
              ← {t('buttons.previous')}
            </button>
          )}
          {showLanguageSelector && <LanguageSelector />}
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
  const { user, ready, idToken, updateTraitScores, scoresLoading } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeView, setActiveView] = useState(() => localStorage.getItem('activeView') || 'chat');
  const [forceRetake, setForceRetake] = useState(false);
  
  const traitScores = user?.traitScores || null;
  console.log('🚀 AppContent render - traitScores:', traitScores, 'scoresLoading:', scoresLoading);

  // Debug logging
  useEffect(() => {
    console.log('=== APP STATE ===');
    console.log('User UUID:', user?.uuid);
    console.log('Trait Scores:', traitScores);
    console.log('Scores Loading:', scoresLoading);
    console.log('Active View:', activeView);
    console.log('Ready:', ready);
    console.log('=================');
  }, [user, traitScores, scoresLoading, activeView, ready]);
  
  // Log when scores actually arrive
  useEffect(() => {
    if (user?.traitScores) {
      console.log('🎉 SCORES ARRIVED IN APP:', user.traitScores);
    }
  }, [user?.traitScores]);

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
            backendUrl={import.meta.env?.VITE_BACKEND_URL?.replace(/\/api\/?$/, '') }
            onSave={(profile) => console.log('✅ Avatar saved:', profile)}
          />
        );
      case 'account':
        return <AccountView />;
      case 'mntest':
        console.log('🎮 MNTEST VIEW RENDER:');
        console.log('  - ready:', ready);
        console.log('  - scoresLoading:', scoresLoading); 
        console.log('  - traitScores:', traitScores);
        console.log('  - forceRetake:', forceRetake);
        console.log('  - user:', user);
        
        // Always wait for loading to complete
        if (!ready || scoresLoading) {
          console.log('🎮 Showing loading state');
          return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>⏳</span>
              </div>
              <p>Loading...</p>
            </div>
          );
        }
        
        // If we have scores and not forcing retake, show profile
        if (traitScores && Object.keys(traitScores).length > 0 && !forceRetake) {
          console.log('🎮 Showing profile view with scores');
          return (
            <div style={{ padding: 0, margin: 0 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '16px',
                marginBottom: '8px',
                padding: '0 32px'
              }}>
                <Button
                  variant="primary"
                  onClick={() => {
                    updateTraitScores({});
                    setForceRetake(true);
                    localStorage.removeItem(`mntest_scores_${user?.uuid}`);
                  }}
                >
                  Take Test Again
                </Button>
              </div>
              <MNProfileView traitScores={traitScores} />
            </div>
          );
        }
        
        // Otherwise show the test form
        console.log('🎮 Showing test form - no scores found or forceRetake:', forceRetake);
        return (
          <MNTESTView
            forceRetake={forceRetake}
            onComplete={(scores) => {
              console.log('MNTESTView onComplete called with scores:', scores);
              updateTraitScores(scores);
              setForceRetake(false);
            }}
          />
        );
      case 'uikit':
        return <UIKitPlayground />;
      default:
        return <div><h1>{t('common.unknownView')}</h1></div>;
    }
  };

  // Loading state
  if (!ready) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            borderWidth: '4px',
            borderStyle: 'solid',
            borderColor: '#6366f1',
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}></div>
          <p>{t('common.loading')}</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }
  
  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Handle onboarding - if user has trait scores, they've completed onboarding
  const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true' || 
                              (traitScores && Object.keys(traitScores).length > 0);
  
  // Set onboarding completed if user has scores
  useEffect(() => {
    if (traitScores && Object.keys(traitScores).length > 0) {
      localStorage.setItem('onboardingCompleted', 'true');
    }
  }, [traitScores]);
  
  if (!onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // NEW LAYOUT STRUCTURE with inline styles
  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      overflow: 'hidden' 
    }}>
      {/* Sidebar */}
      {!isContentPage && (
        <div style={{ display: sidebarOpen ? 'block' : 'none' }}>
          <Sidebar
            setActiveView={(view: string) => {
              setActiveView(view);
              if (isMobile) setSidebarOpen(false);
            }}
            isVisible={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeView={activeView}
          />
        </div>
      )}
      
      {/* Main content area */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100vh'
      }}>
        {/* Mobile header */}
        {!isContentPage && (
          <div style={{ margin: 0, padding: '8px 0 0 0' }}>
            <MobileHeader 
              onToggle={() => {
                if (isMobile) {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
              className="mb-0" 
            />
          </div>
        )}
        
        {/* Content area - ZERO PADDING AT TOP */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          backgroundColor: '#f9fafb',
          padding: '16px 2rem 0',
          margin: 0
        }}>
          <Routes>
            <Route path="/about" element={<ContentLayout><AboutXavigate /></ContentLayout>} />
            <Route path="/privacy" element={<ContentLayout><PrivacyPolicy /></ContentLayout>} />
            <Route path="/terms" element={<ContentLayout><Terms /></ContentLayout>} />
            <Route path="/help" element={<ContentLayout><HelpCenter /></ContentLayout>} />
            {/* ADD CONFIG PANEL ROUTE HERE */}
            <Route path="/admin/config" element={<ConfigPanel />} />
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
          <Route path="/admin/config" element={<ConfigPanel />} />
          <Route path="/*" element={<AppContent />} />
        </Route>
      </Routes>
    </Router>
  );
}