import React, { useState } from 'react';
import { User } from 'lucide-react';

type ProfileTabProps = {
  user: {
    name?: string;
    email?: string;
    username?: string;
  };
};

export default function ProfileTab({ user }: ProfileTabProps) {
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('✅ Profile Saved:', { firstName, lastName, username, email });
  };

  return (
    <div style={{ maxWidth: '480px', width: '100%' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
        Profile Information
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
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
            {firstName || 'Anonymous'}
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={inputStyle}
              placeholder="First Name"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={inputStyle}
              placeholder="Last Name"
            />
          </div>

          <div>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
              style={inputStyle}
              placeholder="yourusername"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="Email Address"
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
            Cancel
          </button>
          <button type="submit" style={saveButtonStyle}>
            Save Changes
          </button>
        </div>
      </form>
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
