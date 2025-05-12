import React, { useState, useEffect } from 'react';
import MNTestForm from './MNTestForm';
import MNProfileView from './MNProfileView';
import { useAuth } from '@/context/AuthContext';

interface MNTESTViewProps {
  onAskGPT?: (prompt: string) => void;
}

const MNTESTView: React.FC<MNTESTViewProps> = ({ onAskGPT }) => {
  const { user } = useAuth();
  const uuid = user?.uuid;
  const [traitScores, setTraitScores] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8010';

  useEffect(() => {
    if (!uuid) {
      setIsLoading(false);
      return;
    }

    fetch(`${BACKEND_URL}/mntest/profile/${uuid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.traitScores && Object.keys(data.traitScores).length > 0) {
          setTraitScores(data.traitScores);
          setIsCompleted(true);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load MN profile:', err);
        setIsLoading(false);
      });
  }, [uuid]);

  const handleComplete = (scores: Record<string, number>) => {
    setTraitScores(scores);
    setIsCompleted(true);
  };

  const handleReset = () => {
    setIsCompleted(false);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid #E5E7EB',
            borderTopColor: '#4F46E5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        ></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {isCompleted ? (
        <div>
          <MNProfileView traitScores={traitScores} onAskGPT={onAskGPT} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '32px',
            }}
          >
            <button
              onClick={handleReset}
              style={{
                padding: '8px 16px',
                backgroundColor: '#F3F4F6',
                color: '#4B5563',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Take Test Again
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div
            style={{
              marginBottom: '32px',
              textAlign: 'center',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: '16px',
              }}
            >
              Multiple Natures Assessment
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: '#4B5563',
                lineHeight: '1.5',
              }}
            >
              This assessment will help you understand your natural traits and behavioral
              tendencies. For each statement, rate how strongly you agree on a scale of 1 (strongly
              disagree) to 5 (strongly agree).
            </p>
          </div>
          <MNTestForm onComplete={handleComplete} />
        </div>
      )}
    </div>
  );
};

export default MNTESTView;
