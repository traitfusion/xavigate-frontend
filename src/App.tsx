import React, { useState, useEffect, useRef } from 'react';
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
import { fetchUserProfile } from './api/fetchUserProfile';

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

// Connection status component
interface ConnectionStatusProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  onRetry?: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status, message, onRetry }) => {
  if (status === 'idle') return null;
  
  const statusStyles = {
    loading: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
    },
    error: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
    },
  };
  
  const style = statusStyles[status] || statusStyles.loading;
  
  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-3 mb-4 flex items-center justify-between`}>
      <div className={`${style.text} text-sm`}>
        {status === 'loading' && (
          <span className="inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
        )}
        {status === 'success' && '✅ '}
        {status === 'error' && '⚠️ '}
        {message || (
          status === 'loading' ? 'Loading...' : 
          status === 'success' ? 'Connected successfully' : 
          'Connection issue detected'
        )}
      </div>
      {status === 'error' && onRetry && (
        <button 
          onClick={onRetry}
          className="text-sm px-3 py-1 rounded border border-orange-300 hover:bg-orange-100 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

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
  const { user, ready, idToken, updateTraitScores } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeView, setActiveView] = useState(() => localStorage.getItem('activeView') || 'chat');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusProps>({ status: 'idle' });
  const [dataSource, setDataSource] = useState<'primary' | 'fallback' | 'generated' | null>(null);
  const [forceRetake, setForceRetake] = useState(false);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  
  const traitScores = user?.traitScores || null;
  console.log('🚀 AppContent render - traitScores from user:', traitScores);

  // Auth token from environment or fallback
  const AUTH_TOKEN = import.meta.env?.VITE_AUTH_TOKEN || 'foo';

  // Track if component is mounted
  const mountedRef = useRef(true);
  
  // Check backend for saved MN Test scores
  const fetchTraitScores = async () => {
    const uid = user?.uuid;
    if (!uid) return;

    console.log('🔄 fetchTraitScores called for user:', uid);
    console.log('🔄 initialFetchComplete:', initialFetchComplete);
    
    setConnectionStatus({
      status: 'loading',
      message: 'Checking for saved MN Test scores...'
    });

    const token = idToken || AUTH_TOKEN;
    try {
      console.log('📡 Calling fetchUserProfile...');
      const result = await fetchUserProfile(uid, token);
      console.log('📡 fetchUserProfile result:', result);
      
      // Check if component is still mounted before updating state
      if (!mountedRef.current) {
        console.log('⚠️ Component unmounted, skipping state update');
        return;
      }
      
      if (result?.traitScores && Object.keys(result.traitScores).length > 0) {
        console.log('✅ Found trait scores:', result.traitScores);
        updateTraitScores(result.traitScores);
        setDataSource('primary');
        setConnectionStatus({
          status: 'success',
          message: 'Scores loaded'
        });
      } else {
        console.log('❌ No trait scores found in result');
        setConnectionStatus({
          status: 'error',
          message: 'No saved scores found.',
          onRetry: fetchTraitScores
        });
      }
    } catch (error) {
      console.error('❌ Error fetching scores:', error);
      if (mountedRef.current) {
        setConnectionStatus({
          status: 'error',
          message: 'Error fetching scores.',
          onRetry: fetchTraitScores
        });
      }
    } finally {
      if (mountedRef.current) {
        setInitialFetchComplete(true);
        console.log('🏁 fetchTraitScores complete, initialFetchComplete set to true');
      }
    }
  };
  // Load trait scores on initialization
  useEffect(() => {
    mountedRef.current = true;
    
    // Add a small delay to ensure component is stable after auth
    const timeoutId = setTimeout(() => {
      if (user?.uuid && !initialFetchComplete && mountedRef.current) {
        console.log('📍 User UUID available, checking initialFetchComplete:', initialFetchComplete);
        console.log('📍 Triggering fetchTraitScores from useEffect');
        fetchTraitScores();
      }
    }, 100);
    
    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      console.log('⚠️ AppContent component unmounting!');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uuid]);

  // Debug logging
  useEffect(() => {
    console.log('=== APP STATE ===');
    console.log('User UUID:', user?.uuid);
    console.log('Backend URL:', '/api (proxied to chat.xavigate.com)');
    console.log('Trait Scores Count:', traitScores ? Object.keys(traitScores).length : 0);
    console.log('Trait Scores Object:', traitScores);
    console.log('Data Source:', dataSource);
    console.log('Connection Status:', connectionStatus.status);
    console.log('Initial Fetch Complete:', initialFetchComplete);
    console.log('Active View:', activeView);
    console.log('=================');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uuid, traitScores, dataSource, connectionStatus, initialFetchComplete, activeView]);

  // Specific debug for trait scores changes
  useEffect(() => {
    if (traitScores && Object.keys(traitScores).length > 0) {
      console.log('🎯 TRAIT SCORES UPDATED:', traitScores);
      console.log('🎯 Number of traits:', Object.keys(traitScores).length);
    }
  }, [traitScores]);

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
        // Don't render anything until initial fetch is complete
        if (!initialFetchComplete || connectionStatus.status === 'loading') {
          return (
            <ConnectionStatus
              status="loading"
              message="Checking for saved MN Test scores..."
            />
          );
        }
        
        // If we successfully loaded scores, show the profile
        if (traitScores && Object.keys(traitScores).length > 0 && !forceRetake) {
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
                    setConnectionStatus({ status: 'idle' });
                    setDataSource(null);
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
        
        // Otherwise show the test form (either no scores or forceRetake)
        return (
          <MNTESTView
            forceRetake={forceRetake}
            onComplete={(scores) => {
              console.log('MNTESTView onComplete called with scores:', scores);
              updateTraitScores(scores);
              setDataSource('primary');
              setForceRetake(false);
              setConnectionStatus({ status: 'success', message: 'Test complete' });
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

  // Handle onboarding
  const onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
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