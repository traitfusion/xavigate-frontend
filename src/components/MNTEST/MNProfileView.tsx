import React from 'react';
import ResponsiveWrapper from '@/layout/ResponsiveWrapper';
import { useTranslation } from 'react-i18next';
import { Card, Text, Button } from '@/design-system/components';
import MNGraph, { TraitScore } from './MNGraph';
import { useNavigate } from 'react-router-dom';

interface MNProfileViewProps {
  traitScores: Record<string, number>;
  onAskGPT?: (prompt: string) => void;
}

const MNProfileView: React.FC<MNProfileViewProps> = ({ traitScores, onAskGPT }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!traitScores || Object.keys(traitScores).length === 0) {
    return (
      <ResponsiveWrapper>
        <Card style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
          <Text variant="h3" style={{ marginBottom: '1rem' }}>
            ⚠️ No trait scores found.
          </Text>
          <Text variant="body" style={{ marginBottom: '1rem' }}>
            Please complete the MNTEST to view your profile.
          </Text>
          <Button onClick={() => navigate('/mntest')}>Take the Test</Button>
        </Card>
      </ResponsiveWrapper>
    );
  }

  const MN_TRAITS = [
    'Protective',
    'Educative',
    'Administrative',
    'Creative',
    'Healing',
    'Entertaining',
    'Providing',
    'Entrepreneurial',
    'Adventurous',
  ];

  const mnGraphScores: TraitScore[] = Object.entries(traitScores)
    .filter(([trait]) => MN_TRAITS.includes(trait))
    .map(([trait, scaled]) => ({ trait, scaled }));

  return (
    <ResponsiveWrapper style={{ maxWidth: '800px', marginTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937' }}>
          {t('profileSection.yourProfile')}
        </h2>
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '0.5rem' }}>
          {t('profileSection.traitHint')}
        </p>
      </div>

      <MNGraph scores={mnGraphScores} />

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Button onClick={() => navigate('/mntest')}>
          Retake MNTEST
        </Button>
      </div>
    </ResponsiveWrapper>
  );
};

export default MNProfileView;
