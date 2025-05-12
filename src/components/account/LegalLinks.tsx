import React from 'react';
import { Info, HelpCircle, Shield, FileText } from 'lucide-react';

export default function LegalLinks() {
  return (
    <>
      {/* Help & Info section */}
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: '#6b7280',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          Help & Info
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a
            href="/about"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#1f2937',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            <Info size={16} style={{ marginRight: '0.5rem', color: '#4f46e5' }} />
            About Xavigate
          </a>
          <a
            href="/help"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#1f2937',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            <HelpCircle size={16} style={{ marginRight: '0.5rem', color: '#3b82f6' }} />
            Help Center
          </a>
        </div>
      </div>

      {/* Legal section */}
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: '#6b7280',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          Legal
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a
            href="/privacy"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#1f2937',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            <Shield size={16} style={{ marginRight: '0.5rem', color: '#10b981' }} />
            Privacy Policy
          </a>
          <a
            href="/terms"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#1f2937',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            <FileText size={16} style={{ marginRight: '0.5rem', color: '#f59e0b' }} />
            Terms of Service
          </a>
        </div>
      </div>
    </>
  );
}
