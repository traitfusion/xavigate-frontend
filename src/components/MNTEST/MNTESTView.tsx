import React, { useEffect, useState } from 'react';
// import useNavigate if needed for routing
import MNTestForm from './MNTestForm';
import { useAuth } from '@/context/AuthContext';
import { Card, Text, Button } from '@/design-system/components';
import { submitTraitScores } from '@/api/api';
// Props for MNTESTView
interface MNTESTViewProps {
  onComplete: (scores: Record<string, number>) => void;
}

const MNTESTView: React.FC<MNTESTViewProps> = ({ onComplete }) => {
  const { user, idToken } = useAuth();
  const uuid = user?.uuid;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!uuid || !idToken) {
      setIsLoading(false);
      return;
    }

    console.log("🧐 Fetching MN result for:", uuid);
    console.log("🖺 Token preview:", idToken?.slice(0, 50));

    fetch(`/api/mntest/result?userId=${uuid}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
    })
      .then((res) => {
        if (res.status === 404) {
          console.log('❌ No test results found');
          setIsLoading(false);
          return null;
        }
        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('❌ Error loading MN profile:', err);
        setError('Could not load your profile data. Please try again later.');
        setIsLoading(false);
      });
  }, [uuid, idToken]);

  const handleComplete = async (scores: Record<string, number>) => {
    console.log("📦 Submitting scores:", scores);
    console.log("🖺 Using token:", idToken?.slice(0, 50));
    console.log("👤 Using userId:", uuid);

    try {
      localStorage.setItem(`mntest_scores_${uuid}`, JSON.stringify(scores));
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

  return (
    <div style={{ marginTop: 0, padding: '24px' }}>
      <MNTestForm onComplete={handleComplete} />
    </div>
  );
};

export default MNTESTView;
