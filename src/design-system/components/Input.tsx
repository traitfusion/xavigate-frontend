import React, { forwardRef } from 'react';
import { COLORS, SPACING, RADII } from '../theme/tokens';
import { FONT_SIZES, FONT_FAMILIES, LINE_HEIGHTS } from '../theme/typography';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ disabled = false, style = {}, ...rest }, ref) => (
    <input
      ref={ref}
      disabled={disabled}
      style={{
        width: '100%',
        padding: `${SPACING.sm} ${SPACING.md}`,
        fontSize: FONT_SIZES.base,
        fontFamily: FONT_FAMILIES.body,
        lineHeight: LINE_HEIGHTS.normal,
        borderRadius: RADII.md,
        border: `1px solid ${COLORS.neutral?.[300] ?? COLORS.gray}`,
        backgroundColor: disabled ? (COLORS.neutral?.[100] ?? COLORS.light) : COLORS.white,
        color: COLORS.dark,
        transition: 'border-color 0.2s ease',
        ...style,
      }}
      {...rest}
    />
  ),
);
Input.displayName = 'Input';
export default Input;
