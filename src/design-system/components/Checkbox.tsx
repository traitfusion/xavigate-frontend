import React from 'react';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { RADII } from '../theme/radii';
import { FONT_FAMILIES, FONT_SIZES } from '../theme/typography';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  name,
  id,
}) => {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.sm,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: FONT_FAMILIES.body,
        fontSize: FONT_SIZES.base,
        color: disabled ? COLORS.neutral[400] : COLORS.neutral[900],
      }}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: '18px',
          height: '18px',
          borderRadius: RADII.sm,
          border: `1px solid ${COLORS.neutral[300]}`,
          accentColor: COLORS.primary[500],
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />
      {label}
    </label>
  );
};

export default Checkbox;
