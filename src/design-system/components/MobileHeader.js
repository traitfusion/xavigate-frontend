import React from 'react';
import LanguageSelector from '../shared/LanguageSelector';

export default function MobileHeader({ onToggle }) {
  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        borderBottom: '1px solid #ddd',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isMobile && (
          <button
            onClick={onToggle}
            style={{
              fontSize: '1.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}
        <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Xavigate</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LanguageSelector />
      </div>
    </div>
  );
}
