import React, { useState } from 'react';
import { Card, Button, Text } from '@/design-system/components';
import logo from '../../assets/Xavigate_Logo.svg';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MNTestForm from '@/components/MNTEST/MNTestForm';

/**
 * Onboarding flow: 3 steps
 * Step 1: Welcome
 * Step 2: Assessment Introduction
 * Step 3: MNTEST assessment
 */
export default function Onboarding() {
  const [step, setStep] = useState<number>(1);
  // const navigate = useNavigate();
  const { user } = useAuth();
  const uuid = user?.uuid;
  const handleNext = () => setStep(prev => prev + 1);

  // Step 3: render the MNTEST form only (no profile loading)
  if (step === 3) {
    // Submission endpoint uses /api/mntest/submit via proxy
    const SUBMIT_URL = `${import.meta.env.VITE_BACKEND_URL}/mntest/submit`;
    const TOKEN = 'foo';
    const handleComplete = async (scores: Record<string, number>) => {
      if (uuid) {
        try { localStorage.setItem(`mntest_scores_${uuid}`, JSON.stringify(scores)); } catch {}
        try {
        const res = await fetch(SUBMIT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
            body: JSON.stringify({ userId: uuid, traitScores: scores }),
          });
          if (!res.ok) console.warn(`Save returned ${res.status}`);
        } catch (err) { console.error('Error saving test results:', err); }
      }
      // Mark onboarding complete so returning users skip onboarding
      localStorage.setItem('onboardingCompleted', 'true');
      localStorage.setItem('activeView', 'mntest');
      // Full reload to ensure fresh traitScores fetch
      window.location.href = '/';
    };
    return (
      <Card padding="md" style={{ maxWidth: 400, margin: '2rem auto' }}>
        <MNTestForm onComplete={handleComplete} />
      </Card>
    );
  }

  // Steps 1 & 2: display in a fixed-width Card
  return (
    <Card padding="md" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <img src={logo} alt="Xavigate logo" style={{ maxWidth: '150px', height: 'auto' }} />
      </div>

      {step === 1 && (
        <>
          <Text variant="h2" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            Welcome to Xavigate!
          </Text>
          <Text variant="body" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            Xavigate helps you discover your authentic self and navigate life with purpose. We combine ancient wisdom with modern insights to guide your personal journey of growth and self-discovery.
          </Text>
          <Text variant="body" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            Are you ready to start your adventure?
          </Text>
          <Button style={{ width: '100%' }} onClick={handleNext}>
            Next
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <Text variant="h2" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            Let{'\''}s Get to Know You
          </Text>
          <Text variant="body" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            To help you better understand yourself and provide personalized insights, you{'\''}ll take a short Personality Assessment called the MNTEST. This will help Xavigate know you better so we can offer more meaningful guidance on your journey.
          </Text>
          <Button style={{ width: '100%' }} onClick={handleNext}>
            Next
          </Button>
        </>
      )}
    </Card>
  );
}