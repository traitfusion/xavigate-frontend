import React from 'react';
import { COLORS } from '../theme/colors';
import { FONT_FAMILIES, FONT_SIZES } from '../theme/typography';
import { SPACING } from '../theme/spacing';
import { RADII } from '../theme/radii';

interface TagProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  onClick?: () => void;
  style?: React.CSSProperties;
}

const variantColors = {
  default: {
    background: COLORS.neutral[100],
    text: COLORS.neutral[800],
  },
  success: {
    background: '#d1fae5',
    text: '#065f46',
  },
  warning: {
    background: '#fef3c7',
    text: '#92400e',
  },
  error: {
    background: '#fee2e2',
    text: '#991b1b',
  },
};

const Tag: React.FC<TagProps> = ({ label, variant = 'default', onClick, style = {} }) => {
  const colorSet = variantColors[variant];

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-block',
        padding: `${SPACING['0.5']} ${SPACING['2']}`,
        fontSize: FONT_SIZES.sm,
        fontFamily: FONT_FAMILIES.body,
        backgroundColor: colorSet.background,
        color: colorSet.text,
        borderRadius: RADII.full,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        ...style,
      }}
    >
      {label}
    </span>
  );
};

export default Tag;
