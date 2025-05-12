import React from 'react';
import { COLORS, SPACING, RADII } from '../theme/tokens';

type CardVariant = 'outlined' | 'filled';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: keyof typeof SPACING;
  borderRadius?: keyof typeof RADII;
  variant?: CardVariant;
}

const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  borderRadius = 'md',
  variant = 'outlined',
  onClick,
  style = {},
  ...rest
}) => {
  const baseStyles: React.CSSProperties = {
    padding: SPACING[padding],
    borderRadius: RADII[borderRadius],
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 150ms ease',
  };

  const variants: Record<CardVariant, React.CSSProperties> = {
    outlined: {
      backgroundColor: '#FFFFFF',
      boxShadow: 'none',
      border: `1px solid ${COLORS.neutral[200]}`,
    },
    filled: {
      backgroundColor: COLORS.neutral[100],
      boxShadow: 'none',
      border: 'none',
    },
  };

  return (
    <div onClick={onClick} style={{ ...baseStyles, ...variants[variant], ...style }} {...rest}>
      {children}
    </div>
  );
};

export default Card;
