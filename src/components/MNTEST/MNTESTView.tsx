import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MNTestForm from './MNTestForm';
import { useAuth } from '@/context/AuthContext';
import { Card, Text, Button } from '@/design-system/components';

const MNTESTView: React.FC = () => {
  const { user, idToken } = useAuth();
  const uuid = user?.uuid;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const RESULT_URL = '/api/mntest'; // GET: uses Vite/CRA proxy for fetching results
  const SUBMIT_URL = '/api/mntest/submit'; // POST: submission endpoint via proxy

  useEffect(() => {
    if (!uuid || !idToken) {
      setIsLoading(false);
      return;
    }

    console.log("🧠 Fetching MN result for:", uuid);
    console.log("🪪 Token preview:", idToken?.slice(0, 50));

    fetch(`${RESULT_URL}/result?userId=${uuid}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
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
    console.log("🪪 Using token:", idToken?.slice(0, 50));
    console.log("👤 Using userId:", uuid);

    try {
      localStorage.setItem(`mntest_scores_${uuid}`, JSON.stringify(scores));
    } catch {}

    if (uuid && idToken) {
      try {
        const res = await fetch(SUBMIT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ userId: uuid, traitScores: scores }),
        });

        console.log("📡 Response status:", res.status);

        if (!res.ok) {
          const text = await res.text();
          console.warn(`❌ Submit failed: ${res.status}`, text);
        } else {
          console.log("✅ Submit successful!");
        }
      } catch (err) {
        console.error('🚨 Error submitting MNTEST:', err);
      }
    }

    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/mntest-profile'); // redirect to profile screen
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
    <div style={{ padding: '24px' }}>
      <MNTestForm onComplete={handleComplete} />
    </div>
  );
};

export default MNTESTView;
