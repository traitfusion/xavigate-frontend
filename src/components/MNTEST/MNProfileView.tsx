import React from 'react';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@/design-system/theme/tokens';
import { Card, Text } from '@/design-system/components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

export interface MNProfileViewProps {
  traitScores: Record<string, number>;
}


// Exact order of Multiple Intelligences from reference
const MULTIPLE_INTELLIGENCES = [
  'Gross Bodily',
  'Fine Bodily',
  'Interpersonal',
  'Logical',
  'Linguistic',
  'Graphic Visual',
  'Spatial Visual',
  'Musical',
  'Intrapersonal',
  'Naturalistic',
];

// Map between display labels and traitScores keys for Multiple Intelligences
const MI_KEY_MAP: Record<string, string> = {
  'Gross Bodily':   'grossBodily',
  'Fine Bodily':    'fineBodily',
  'Interpersonal':  'interpersonal',
  'Logical':        'logical',
  'Linguistic':     'linguistic',
  'Graphic Visual': 'graphicVisual',
  'Spatial Visual': 'spatialVisual',
  'Musical':        'musical',
  'Intrapersonal':  'intrapersonal',
  'Naturalistic':   'naturalistic',
};
// Exact order of Multiple Natures from reference
const MULTIPLE_NATURES = [
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

// Map between display labels and traitScores keys for Multiple Natures
const MN_KEY_MAP: Record<string, string> = {
  'Protective':     'protective',
  'Educative':      'educative',
  'Administrative': 'administrative',
  'Creative':       'creative',
  'Healing':        'healing',
  'Entertaining':   'entertaining',
  'Providing':      'providing',
  'Entrepreneurial':'entrepreneurial',
  'Adventurous':    'adventurous',
};

// Build data for recharts from labels and scores using key mapping
// Build data for recharts from labels and scores; supports both mapped and label keys
const toChartData = (
  labels: string[],
  map: Record<string, string>,
  scores: Record<string, number>
) =>
  labels.map(name => ({
    name,
    score: scores[map[name]] ?? scores[name] ?? 0
  }));

const MNProfileView: React.FC<MNProfileViewProps> = ({ traitScores }) => {
  const { t } = useTranslation();
  const miData = toChartData(MULTIPLE_INTELLIGENCES, MI_KEY_MAP, traitScores);
  const mnData = toChartData(MULTIPLE_NATURES, MN_KEY_MAP, traitScores);

  return (
    <div style={{ 
      padding: '0 32px 24px', 
      maxWidth: 960, 
      marginLeft: 'auto', 
      marginRight: 'auto',
      marginTop: 0,
      marginBottom: 0
    }}>


      {/* Multiple Intelligences Chart */}
      <Text variant="h2" style={{ marginTop: '16px', marginBottom: '1rem' }}>
        {t('profileSection.multipleIntelligences')}
      </Text>
      <Card padding="lg" style={{ marginBottom: '2rem' }}>
        <ResponsiveContainer width="100%" height={miData.length * 40}>
          <BarChart
            data={miData}
            layout="vertical"
            margin={{ top: 10, right: 30, bottom: 10, left: 16 }}
          >
            <XAxis type="number" domain={[0, 10]} />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tick={{ style: { whiteSpace: 'nowrap', overflow: 'visible' } }}
              tickFormatter={(value) =>
                t(
                  `multipleIntelligences.${MI_KEY_MAP[
                    value as unknown as string
                  ]}` as const
                )
              }
            />
            <Tooltip
              labelFormatter={(label) =>
                t(
                  `multipleIntelligences.${MI_KEY_MAP[
                    label as unknown as string
                  ]}` as const
                )
              }
            />
            <Bar dataKey="score" fill={COLORS.primary.DEFAULT}>
              <LabelList dataKey="score" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      {/* Multiple Natures Chart */}
      <Text variant="h2" style={{ marginBottom: '1rem' }}>
        {t('profileSection.multipleNatures')}
      </Text>
      <Card padding="lg">
        <ResponsiveContainer
          width="100%"
          height={mnData.length * 40}
        >
          <BarChart
            data={mnData}
            layout="vertical"
            margin={{ top: 10, right: 30, bottom: 10, left: 16 }}
          >
            <XAxis type="number" domain={[0, 10]} />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tick={{ style: { whiteSpace: 'nowrap', overflow: 'visible' } }}
              tickFormatter={(value) =>
                t(
                  `multipleNatures.${MN_KEY_MAP[
                    value as unknown as string
                  ]}` as const
                )
              }
            />
            <Tooltip
              labelFormatter={(label) =>
                t(
                  `multipleNatures.${MN_KEY_MAP[
                    label as unknown as string
                  ]}` as const
                )
              }
            />
            <Bar dataKey="score" fill={COLORS.purple.DEFAULT}>
              <LabelList dataKey="score" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default MNProfileView;