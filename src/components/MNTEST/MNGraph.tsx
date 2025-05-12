import React from 'react';
import { Card, Text, Slider, Tag } from '@/design-system/components';

export type TraitScore = {
  trait: string;
  scaled: number; // e.g. 7.5 (1–10 scale)
};

interface MNGraphProps {
  scores: TraitScore[];
}

const MNGraph: React.FC<MNGraphProps> = ({ scores }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {scores.map(({ trait, scaled }) => (
        <Card key={trait} style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text variant="body">{trait}</Text>
            <Tag label={`${scaled.toFixed(1)}/10`} />
          </div>
          <Slider value={scaled} min={0} max={10} onChange={() => {}} disabled />
        </Card>
      ))}
    </div>
  );
};

export default MNGraph;
