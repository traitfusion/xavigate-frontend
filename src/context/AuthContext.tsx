import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login, logout, handleAuthCallback, refreshTokens, parseJwt } from '@/utils/auth';

type AvatarProfile = {
  avatar_id: string;
  prompt_framing: string;
};

type User = {
  name: string;
  uuid: string;
  email?: string;
  avatarProfile?: AvatarProfile;
  onboardingCompleted?: boolean;
};

interface AuthContextType {
  user: User | null;
  idToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  ready: boolean;
  signIn: () => void;
  signOut: () => void;
  refresh: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initAuth() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        // Handle OAuth callback
        try {
          const tokens = await handleAuthCallback();
          const { id_token, access_token, refresh_token } = tokens;
          setIdToken(id_token);
          setAccessToken(access_token);
          if (refresh_token) {
            setRefreshToken(refresh_token);
          }
          localStorage.setItem('id_token', id_token);
          localStorage.setItem('access_token', access_token);
          if (refresh_token) {
            localStorage.setItem('refresh_token', refresh_token);
          }
          const claims = parseJwt(id_token) as any;
          setUser({
            name: claims.name || '',
            uuid: claims.sub,
            email: claims.email,
            onboardingCompleted: true,
          });
          // Clean up URL
          window.history.replaceState({}, '', window.location.pathname);
        } catch (err) {
          console.error('OAuth callback failed, signing out and restarting login', err);
          // Clear stored data
          localStorage.removeItem('pkce_verifier');
          localStorage.removeItem('id_token');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // Sign out of Cognito to clear session and force fresh login
          logout();
          return;
        }
      } else {
        // Attempt to restore existing session
        const storedId = localStorage.getItem('id_token');
        const storedAccess = localStorage.getItem('access_token');
        const storedRefresh = localStorage.getItem('refresh_token');
        if (storedId && storedAccess) {
          setIdToken(storedId);
          setAccessToken(storedAccess);
          setRefreshToken(storedRefresh);
          const claims = parseJwt(storedId) as any;
          setUser({
            name: claims.name || '',
            uuid: claims.sub,
            email: claims.email,
            onboardingCompleted: true,
          });
        } else {
          // No session: start OAuth login flow
          login();
          return;
        }
      }
      setReady(true);
    }
    initAuth();
  }, []);

  const signIn = () => {
    login();
  };

  const signOut = () => {
    // Clear PKCE verifier and tokens from storage
    localStorage.removeItem('pkce_verifier');
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Clear in-memory state
    setIdToken(null);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    // Redirect to Cognito Hosted UI logout to clear server session and redirect back
    logout();
  };

  const refresh = async () => {
    if (!refreshToken) throw new Error('No refresh token available');
    try {
      const tokens = await refreshTokens(refreshToken);
      const { id_token, access_token, refresh_token: newRefresh } = tokens;
      setIdToken(id_token);
      setAccessToken(access_token);
      localStorage.setItem('id_token', id_token);
      localStorage.setItem('access_token', access_token);
      if (newRefresh) {
        setRefreshToken(newRefresh);
        localStorage.setItem('refresh_token', newRefresh);
      }
    } catch (err) {
      console.error('Refresh token error:', err);
      signOut();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        idToken,
        accessToken,
        refreshToken,
        ready,
        signIn,
        signOut,
        refresh,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}