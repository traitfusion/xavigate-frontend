import React from 'react';
import { SPACING } from '../theme/spacing';
import { FONT_SIZES, FONT_FAMILIES } from '../theme/typography';
import { COLORS } from '../theme/colors';

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
}

const Tabs: React.FC<TabsProps> = ({ tabs, value, onChange, fullWidth = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        borderBottom: `1px solid ${COLORS.neutral[300]}`,
        gap: SPACING['2'],
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;

        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            style={{
              padding: `${SPACING['1']} ${SPACING['2']}`,
              fontSize: FONT_SIZES.base,
              fontFamily: FONT_FAMILIES.body,
              background: 'none',
              border: 'none',
              borderBottom: isActive ? `2px solid ${COLORS.primary[500]}` : '2px solid transparent',
              color: isActive ? COLORS.primary[500] : COLORS.neutral[700],
              cursor: 'pointer',
              flex: fullWidth ? 1 : undefined,
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
