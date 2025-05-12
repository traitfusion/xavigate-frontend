import React, { forwardRef } from 'react';
import { COLORS, SPACING, RADII } from '../theme/tokens';
import { FONT_SIZES, FONT_FAMILIES, LINE_HEIGHTS } from '../theme/typography';

export interface Option {
  label: string;
  value: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  /**
   * Array of options to render in the select dropdown.
   */
  options?: Option[];
  /**
   * Placeholder text shown as a disabled hidden option.
   */
  placeholder?: string;
  /**
   * Callback invoked with the new selected value.
   */
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ disabled = false, style = {}, options, placeholder, onChange, children, ...rest }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };
    return (
      <select
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
          boxSizing: 'border-box',
          ...style,
        }}
        onChange={handleChange}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    );
  },
);
Select.displayName = 'Select';
export default Select;
