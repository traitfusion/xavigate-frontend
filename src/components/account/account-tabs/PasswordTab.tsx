import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordTab: React.FC = () => {
  const [form, setForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [visible, setVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setMessage('');

    if (form.new.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters.');
      return;
    }

    if (form.new !== form.confirm) {
      setStatus('error');
      setMessage('New passwords do not match.');
      return;
    }

    console.log('Password change submitted:', form);
    setStatus('success');
    setMessage('✅ Password updated successfully.');

    setForm({ current: '', new: '', confirm: '' });
  };

  const renderInput = (label: string, key: 'current' | 'new' | 'confirm') => (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={visible[key] ? 'text' : 'password'}
          value={form[key]}
          onChange={(e) => handleChange(key, e.target.value)}
          required
          style={{
            width: '100%',
            padding: '8px 12px',
            paddingRight: '40px',
            fontSize: '14px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => ({ ...prev, [key]: !prev[key] }))}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666',
          }}
        >
          {visible[key] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '480px', width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Change Password</h2>

      <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
        Update your password to keep your account secure.
      </p>

      <form onSubmit={handleSubmit}>
        {renderInput('Current Password', 'current')}
        {renderInput('New Password', 'new')}
        {renderInput('Confirm New Password', 'confirm')}

        {status === 'error' && (
          <p style={{ color: '#b91c1c', fontSize: '13px', marginBottom: '12px' }}>{message}</p>
        )}
        {status === 'success' && (
          <p style={{ color: '#047857', fontSize: '13px', marginBottom: '12px' }}>{message}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={() => {
              setForm({ current: '', new: '', confirm: '' });
              setStatus('idle');
              setMessage('');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#4f46e5',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordTab;
