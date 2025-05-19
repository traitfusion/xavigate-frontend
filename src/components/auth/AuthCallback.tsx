import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleAuthCallback } from '@/utils/auth';
import { Card, Text } from '@/design-system/components';

/**
 * Component to handle OAuth2 PKCE callback and navigate to the main app.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const tokens = await handleAuthCallback();
        // Store tokens
        localStorage.setItem('id_token', tokens.id_token);
        localStorage.setItem('access_token', tokens.access_token);
        // Redirect into the app
        navigate('/', { replace: true });
      } catch (err: any) {
        console.error('Auth callback error', err);
        setError(err.message || 'Authentication failed');
      }
    })();
  }, [navigate]);

  return (
    <Card padding="md" style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      {error ? (
        <>
          <Text variant="h3" style={{ color: 'red', marginBottom: '1rem' }}>
            Authentication Error
          </Text>
          <Text variant="body">{error}</Text>
        </>
      ) : (
        <Text variant="body">Signing you in...</Text>
      )}
    </Card>
  );
}