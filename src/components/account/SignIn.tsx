import React from 'react';
import { Button, Text } from '@/design-system/components';
import { Compass } from 'lucide-react';
import { login } from '@/utils/auth';
const SignIn: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '4rem auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        <Compass size={28} color="#3b82f6" />
        <Text variant="h2">Welcome to Xavigate</Text>
      </div>

      <Button
        onClick={() => login()}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Sign in with Cognito
      </Button>

      <Text variant="caption" style={{ textAlign: 'center', color: '#666' }}>
        Discover your natural traits and find your alignment
      </Text>
    </div>
  );
};

export default SignIn;
