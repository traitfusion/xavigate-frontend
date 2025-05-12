import React from 'react';
import ResponsiveWrapper from '@/layout/ResponsiveWrapper';

interface MNProfileViewProps {
  traitScores: Record<string, number>;
  onAskGPT?: (prompt: string) => void;
}

const MNProfileView: React.FC<MNProfileViewProps> = ({ traitScores, onAskGPT }) => {
  if (!traitScores || Object.keys(traitScores).length === 0) {
    return (
      <ResponsiveWrapper>
        <div style={{ color: '#4B5563', padding: '24px' }}>
          ⚠️ No trait scores found. Please complete the MNTEST first.
        </div>
      </ResponsiveWrapper>
    );
  }

  const handleClick = (trait: string, score: number) => {
    const prompt = `What does it mean if someone scores ${score.toFixed(1)} in "${trait}"? How might it shape their work, energy, or alignment?`;
    if (onAskGPT) onAskGPT(prompt);
  };

  const MI_TRAITS = [
    'Gross Bodily Intelligence',
    'Fine Bodily Intelligence',
    'Interpersonal Intelligence',
    'Logical Intelligence',
    'Linguistic Intelligence',
    'Graphic Visual Intelligence',
    'Spatial Visual Intelligence',
    'Musical Intelligence',
    'Intrapersonal Intelligence',
    'Naturalistic Intelligence',
  ];

  const MN_TRAITS = [
    'Protective Nature',
    'Educative Nature',
    'Administrative Nature',
    'Creative Nature',
    'Healing Nature',
    'Entertaining Nature',
    'Providing Nature',
    'Entrepreneurial Nature',
    'Adventurous Nature',
  ];

  const maxScore = Math.max(5, ...Object.values(traitScores));

  const getDisplayName = (key: string): string => {
    return key.replace(' Intelligence', '').replace(' Nature', '');
  };

  const renderBars = (traits: string[]) => (
    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {traits.map((trait) => {
        const score = traitScores[trait] ?? 0;
        const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
        const displayName = getDisplayName(trait);

        return (
          <div
            key={trait}
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
            onClick={() => handleClick(trait, score)}
          >
            <div
              style={{
                flex: '0 0 100px',
                fontSize: '14px',
                color: '#374151',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {displayName}
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                backgroundColor: '#E5E7EB',
                borderRadius: '4px',
                height: '16px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  backgroundColor: '#4F46E5',
                  height: '16px',
                  width: `${pct}%`,
                }}
              />
            </div>
            <div
              style={{
                flex: '0 0 auto',
                fontSize: '14px',
                fontWeight: 500,
                color: '#1F2937',
                textAlign: 'right',
                width: '3ch',
              }}
            >
              {score.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <ResponsiveWrapper style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937' }}>
          Your Multiple Natures Profile
        </h2>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937', marginBottom: '16px' }}>
          Multiple Intelligences
        </h3>
        {renderBars(MI_TRAITS)}
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937', marginBottom: '16px' }}>
          Multiple Natures
        </h3>
        {renderBars(MN_TRAITS)}
      </div>

      <p style={{ fontSize: '14px', color: '#6B7280', fontStyle: 'italic', textAlign: 'center' }}>
        Click any trait to ask the AI about what it means.
      </p>
    </ResponsiveWrapper>
  );
};

export default MNProfileView;
