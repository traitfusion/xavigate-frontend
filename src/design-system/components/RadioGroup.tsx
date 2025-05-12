import React from 'react';
import { COLORS } from '../theme/colors';
import { FONT_SIZES, FONT_FAMILIES } from '../theme/typography';
import { SPACING } from '../theme/spacing';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  direction?: 'row' | 'column';
  disabled?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  direction = 'column',
  disabled = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: SPACING['2'],
      }}
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING['1.5'],
            fontFamily: FONT_FAMILIES.body,
            fontSize: FONT_SIZES.base,
            color: disabled ? COLORS.neutral[400] : COLORS.neutral[900],
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            disabled={disabled}
            onChange={() => onChange(opt.value)}
            style={{
              width: '16px',
              height: '16px',
              accentColor: COLORS.primary[500],
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
