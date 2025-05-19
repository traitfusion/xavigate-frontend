import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { fetchUserProfile } from '@/api/fetchUserProfile';

const BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_BACKEND_URL ||
  process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_BACKEND_URL ||
  '/api';
const TOKEN = 'foo';

 type ProfileTabProps = {
  user: {
    uuid: string;
    name?: string;
    email?: string;
  };
};

export default function ProfileTab({ user }: ProfileTabProps) {
  const { t } = useTranslation();
  // Initialize form fields; will load real data from profile API
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Load existing profile data on mount
  useEffect(() => {
    if (!user?.uuid) return;
    fetchUserProfile(user.uuid)
      .then((data: any) => {
        // Map various possible keys from backend
        setFirstName(
          data.firstName || data.given_name || data.givenName || ''
        );
        setLastName(
          data.lastName || data.family_name || data.familyName || ''
        );
        setUsername(
          data.username || data.preferred_username || data.preferredUsername || ''
        );
        setEmail(data.email || data.userEmail || '');
      })
      .catch(() => {
        // Leave blank on fetch error
      });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setMessage('');
    try {
      const res = await fetch(`${BASE_URL}/profile/${user.uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ firstName, lastName, username, email }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setStatus('success');
      setMessage(t('profileTab.saveSuccess'));
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setStatus('error');
      setMessage(t('profileTab.saveError'));
    }
  };

  return (
    <div style={{ padding: '0 24px', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
        {t('profileTab.header')}
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#e0e7ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4f46e5',
          }}
        >
          <User size={32} />
        </div>
        <div style={{ marginLeft: '16px' }}>
          {/* Display full name only from profile data */}
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
            {[firstName, lastName].filter(Boolean).join(' ') || 'Anonymous'}
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>{t('profileTab.firstNameLabel')}</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={inputStyle}
              placeholder={t('profileTab.placeholderFirstName')}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>{t('profileTab.lastNameLabel')}</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={inputStyle}
              placeholder={t('profileTab.placeholderLastName')}
            />
          </div>

          <div>
            <label style={labelStyle}>{t('profileTab.usernameLabel')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
              style={inputStyle}
              placeholder={t('profileTab.placeholderUsername')}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>{t('profileTab.emailLabel')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder={t('profileTab.placeholderEmail')}
              required
            />
          </div>
        </div>

        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setFirstName('');
              setLastName('');
              setUsername('');
              setEmail('');
            }}
            style={cancelButtonStyle}
          >
            {t('profileTab.cancel')}
          </button>
          <button type="submit" style={saveButtonStyle}>
            {t('profileTab.saveChanges')}
          </button>
        </div>
      </form>
      {/* close inner container */}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '14px',
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  backgroundColor: 'white',
  color: '#333',
  fontSize: '14px',
  cursor: 'pointer',
};

const saveButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#4f46e5',
  color: 'white',
  fontSize: '14px',
  cursor: 'pointer',
};
