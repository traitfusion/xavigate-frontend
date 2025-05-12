import React, { forwardRef } from 'react';
import { COLORS, SPACING, RADII } from '../theme/tokens';
import { FONT_SIZES, FONT_FAMILIES, LINE_HEIGHTS } from '../theme/typography';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ disabled = false, rows = 4, style = {}, onFocus, onBlur, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        rows={rows}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = COLORS.primary.DEFAULT;
          onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = COLORS.neutral?.[300] ?? COLORS.gray;
          onBlur?.(e);
        }}
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
          resize: 'vertical',
          transition: 'border-color 0.2s ease',
          ...style,
        }}
        {...rest}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
export default Textarea;
