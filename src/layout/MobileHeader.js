import React, { useState, useEffect } from 'react';

export default function MobileHeader({ onToggle }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid #ddd',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      <button
        onClick={onToggle}
        style={{
          fontSize: '1.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginRight: '1rem',
        }}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Xavigate</h1>
    </div>
  );
}
