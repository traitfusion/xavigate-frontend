// src/layout/CleanLayout.tsx - Fix with the correct MobileHeader props
import React from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';

interface CleanLayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isContentPage?: boolean;
}

const CleanLayout: React.FC<CleanLayoutProps> = ({
  children,
  activeView,
  setActiveView,
  isMobile,
  sidebarOpen,
  setSidebarOpen,
  isContentPage = false
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      overflow: 'hidden', 
      width: '100%'
    }}>
      {/* Sidebar */}
      {!isContentPage && (
        <div style={{ 
          flexShrink: 0, 
          display: sidebarOpen ? 'block' : 'none' 
        }}>
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
      
      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1, 
        overflow: 'hidden'
      }}>
        {/* Header */}
        {!isContentPage && (
          <div style={{ flexShrink: 0 }}>
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
        
        {/* Content Area */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          backgroundColor: '#f9fafb', 
          padding: '0 2rem'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CleanLayout;