import React, { useEffect, useState } from 'react';
import { QUESTIONS } from './mnTestItems';
import { useAuth } from '@/context/AuthContext';
import ResponsiveWrapper from '@/layout/ResponsiveWrapper';
import { useScreenSize } from '@/layout/useScreenSize';
import { Text, Button, FormGroup } from '@/design-system/components';

interface MNTestFormProps {
  onComplete: (traitScores: Record<string, number>) => void;
}

const MNTestForm: React.FC<MNTestFormProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const uuid = user?.uuid;

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isMobile, isTablet } = useScreenSize();

  const currentQuestion = QUESTIONS[currentIndex];
  const currentAnswer = answers[currentIndex] ?? null;

  const handleSelect = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: value }));
  };

  const handleNext = () => {
    if (!currentAnswer) return;

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const traitBuckets: Record<string, number[]> = {};
      QUESTIONS.forEach((q, i) => {
        const score = answers[i];
        if (score === undefined) return;
        if (!traitBuckets[q.trait]) traitBuckets[q.trait] = [];
        traitBuckets[q.trait].push(score);
      });

      const traitScores: Record<string, number> = {};
      Object.entries(traitBuckets).forEach(([trait, values]) => {
        const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
        traitScores[trait] = parseFloat((avg * 2).toFixed(2));
      });

      const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8010';

      if (!uuid) {
        console.error('❌ No user UUID found');
        onComplete(traitScores);
        return;
      }

      fetch(`${BACKEND_URL}/mntest/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid, traitScores }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('✅ MNTEST submitted:', data);
          onComplete(traitScores);
        })
        .catch((err) => {
          console.error('❌ Failed to submit MNTEST:', err);
          onComplete(traitScores);
        });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleClear = () => {
    const updated = { ...answers };
    delete updated[currentIndex];
    setAnswers(updated);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key;
      if (['1', '2', '3', '4', '5'].includes(key)) {
        handleSelect(parseInt(key));
      } else if (key === 'Enter' || key === 'ArrowRight') {
        handleNext();
      } else if (key === 'ArrowLeft') {
        handleBack();
      } else if (key === 'Backspace' || key === 'Delete') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentAnswer, currentIndex]);

  return (
    <ResponsiveWrapper style={{ maxWidth: '600px' }}>
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          textAlign: 'center',
        }}
      >
        <Text variant="h2" style={{ marginBottom: '24px' }}>
          Question {currentIndex + 1} of {QUESTIONS.length}
        </Text>

        <div
          style={{
            minHeight: '100px',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 1rem',
          }}
        >
          <Text variant="body" style={{ fontSize: '18px', lineHeight: '1.6' }}>
            {currentQuestion.text}
          </Text>
        </div>

        <FormGroup>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
              marginBottom: '32px',
              width: '100%',
              padding: '0 12px',
              boxSizing: 'border-box',
            }}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => handleSelect(n)}
                style={{
                  width: '48px',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: currentAnswer === n ? '#4F46E5' : '#D1D5DB',
                  backgroundColor: currentAnswer === n ? '#4F46E5' : 'transparent',
                  color: currentAnswer === n ? 'white' : '#1F2937',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </FormGroup>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
            padding: '0 12px',
          }}
        >
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentIndex === 0}
            style={{
              opacity: currentIndex === 0 ? 0.4 : 1,
            }}
          >
            ←
          </Button>

          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!currentAnswer}
            style={{
              opacity: !currentAnswer ? 0.4 : 1,
            }}
          >
            {currentIndex === QUESTIONS.length - 1 ? 'Submit' : '→'}
          </Button>
        </div>
      </div>
    </ResponsiveWrapper>
  );
};

export default MNTestForm;
