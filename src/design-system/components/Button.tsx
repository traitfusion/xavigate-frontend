import React from 'react';
import { COLORS, SPACING, RADII } from '../theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_STYLES: Record<
  ButtonVariant,
  {
    backgroundColor: string;
    color: string;
    hoverBg: string;
  }
> = {
  primary: {
    backgroundColor: COLORS.primary.DEFAULT,
    color: COLORS.white,
    hoverBg: COLORS.primary.light,
  },
  secondary: {
    backgroundColor: COLORS.neutral[300],
    color: COLORS.dark,
    hoverBg: COLORS.neutral[400],
  },
  ghost: {
    backgroundColor: 'transparent',
    color: COLORS.primary.DEFAULT,
    hoverBg: COLORS.primary.softer,
  },
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  disabled = false,
  style = {},
  children,
  ...rest
}) => {
  const vs = VARIANT_STYLES[variant];
  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${SPACING.sm} ${SPACING.md}`,
        fontSize: '14px',
        borderRadius: RADII.md,
        border: variant === 'ghost' ? 'none' : `1px solid ${vs.backgroundColor}`,
        backgroundColor: disabled ? COLORS.neutral[200] : vs.backgroundColor,
        color: disabled ? COLORS.neutral[400] : vs.color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s ease',
        ...style,
      }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = vs.hoverBg;
        }
      }}
      onMouseOut={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = vs.backgroundColor;
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.displayName = 'Button';
export default Button;
