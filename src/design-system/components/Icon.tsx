import React from 'react';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';

interface IconProps {
  children: React.ReactNode; // typically an imported icon component
  size?: number | string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({
  children,
  size = 20,
  color = COLORS.neutral[800],
  style = {},
  className,
  onClick,
}) => {
  return (
    <span
      onClick={onClick}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size,
        color,
        cursor: onClick ? 'pointer' : 'inherit',
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export default Icon;
