import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  fetchAuthSession,
  signOut as amplifySignOut,
} from 'aws-amplify/auth';
import { fetchUserProfile } from '../api/fetchUserProfile';

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
  traitScores?: Record<string, number>;
};

interface AuthContextType {
  user: User | null;
  idToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  ready: boolean;
  scoresLoading: boolean;
  signIn: () => void;
  signOut: () => void;
  refresh: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateTraitScores: (scores: Record<string, number>) => void;
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
  const [scoresLoading, setScoresLoading] = useState(false);

  useEffect(() => {
    fetchAuthSession()
      .then((session: any) => {
        const tokens = session.tokens;
        const id_token = tokens.idToken?.toString() ?? '';
        const access_token = tokens.accessToken?.toString() ?? '';
        const refresh_token = tokens.refreshToken?.toString() ?? '';

        setIdToken(id_token);
        setAccessToken(access_token);
        setRefreshToken(refresh_token);

        const payload = JSON.parse(atob(id_token.split('.')[1]));
        const displayName =
          payload.name ||
          payload.email ||
          payload['cognito:username'] ||
          payload.sub ||
          '';

        const newUser = {
          name: displayName,
          uuid: payload.sub,
          email: payload.email,
          onboardingCompleted: true,
        };
        setUser(newUser);
        
        // Fetch trait scores after user is set
        setScoresLoading(true);
        fetchUserProfile(payload.sub, id_token)
          .then(result => {
            if (result?.traitScores && Object.keys(result.traitScores).length > 0) {
              console.log('🎯 AuthContext: Loaded trait scores:', result.traitScores);
              setUser(prev => prev ? { ...prev, traitScores: result.traitScores } : null);
            } else {
              console.log('📝 AuthContext: No trait scores found for user');
            }
          })
          .catch(err => {
            console.log('AuthContext: Could not load trait scores:', err);
          })
          .finally(() => {
            setScoresLoading(false);
          });
      })
      .catch((err: any) => {
        console.warn('No active session:', err);
        setUser(null);
        setIdToken(null);
        setAccessToken(null);
        setRefreshToken(null);
      })
      .finally(() => {
        setReady(true);
      });
  }, []);

  const signIn = () => {
    // redirect or popup flow handled elsewhere
  };

  const signOut = async () => {
    try {
      await amplifySignOut();
    } catch {}
    setIdToken(null);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const refresh = async () => {
    try {
      const session = await fetchAuthSession();
      const tokens = (session as any).tokens;
      const id_token = tokens.idToken?.toString() ?? '';
      const access_token = tokens.accessToken?.toString() ?? '';
      const refresh_token = tokens.refreshToken?.toString() ?? '';

      setIdToken(id_token);
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
    } catch (err) {
      console.error('Token refresh failed:', err);
      await signOut();
    }
  };

  const updateTraitScores = (scores: Record<string, number>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return { ...prevUser, traitScores: scores };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        idToken,
        accessToken,
        refreshToken,
        ready,
        scoresLoading,
        signIn,
        signOut,
        refresh,
        setUser,
        updateTraitScores,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
