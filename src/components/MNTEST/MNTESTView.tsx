// xavigate-frontend/src/components/MNTESTView.tsx
import React, { useEffect, useState } from 'react';
// import useNavigate if needed for routing
import MNTestForm from './MNTestForm';
import { useAuth } from '@/context/AuthContext';
import { Card, Text, Button } from '@/design-system/components';
import { submitTraitScores } from '@/api/api';

// Props for MNTESTView
interface MNTESTViewProps {
  onComplete: (scores: Record<string, number>) => void;
  forceRetake?: boolean;
}

const MNTESTView: React.FC<MNTESTViewProps> = ({ onComplete, forceRetake = false }) => {
  const { user, idToken } = useAuth();
  const uuid = user?.uuid;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip fetching if forceRetake is true
    if (forceRetake) {
      setIsLoading(false);
      return;
    }

    // if no user or token, skip fetch and show form
    if (!uuid || !idToken) {
      setIsLoading(false);
      return;
    }

    const fetchExisting = async () => {
      console.log("🧐 Fetching MN result for:", uuid);
      console.log("🖺 Token preview:", idToken.slice(0, 50));

      // FIXED: Use relative URL to utilize Vite proxy
      const url = `${import.meta.env.VITE_BACKEND_URL}/mntest/result?userId=${encodeURIComponent(uuid)}`;
      const opts: RequestInit = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      };

      try {
        const res = await fetch(url, opts);

        if (res.status === 404) {
          // No prior results → show the form
          setIsLoading(false);
          return;
        }

        if (res.status === 500) {
          setError('Oops, something went wrong on our end. Please try again in a minute.');
          setIsLoading(false);
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }

        // existing result found
        const json = await res.json() as { traitScores: Record<string, number> };
        console.log('✅ Existing scores:', json.traitScores);
        
        // Only call onComplete if we have valid scores
        if (json.traitScores && Object.keys(json.traitScores).length > 0) {
          onComplete(json.traitScores);
        } else {
          // No valid scores, show the test form
          console.log('📝 No valid scores found, showing test form');
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('❌ Error loading MN profile:', err);
        setError('Could not load your profile data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchExisting();
  }, [uuid, idToken, onComplete, forceRetake]);

  const handleComplete = async (scores: Record<string, number>) => {
    console.log("📦 Submitting scores:", scores);
    console.log("🖺 Using token:", idToken?.slice(0, 50));
    console.log("👤 Using userId:", uuid);

    try {
      if (uuid) {
        localStorage.setItem(`mntest_scores_${uuid}`, JSON.stringify(scores));
      }
    } catch {}

    if (uuid && idToken) {
      const success = await submitTraitScores(uuid, scores, idToken);
      if (success) {
        console.log("✅ Submit successful!");
      } else {
        console.warn("❌ Submit failed via helper function.");
      }
    }

    onComplete(scores);
    localStorage.setItem('onboardingCompleted', 'true');
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #E5E7EB',
          borderTopColor: '#4F46E5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <Card padding="md" style={{ maxWidth: 800, margin: '2rem auto' }}>
        <Text variant="h2" style={{ marginBottom: '1rem', color: '#DC2626' }}>
          Error Loading Profile
        </Text>
        <Text variant="body">{error}</Text>
        <Button onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
          Try Again
        </Button>
      </Card>
    );
  }

  // no existing result → show the test form
  return (
    <div style={{ marginTop: 0, padding: '24px' }}>
      <MNTestForm onComplete={handleComplete} />
    </div>
  );
};

export default MNTESTView;