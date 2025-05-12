import React from 'react';
import { COLORS } from '../theme/colors';
import { RADII } from '../theme/radii';
import { SPACING } from '../theme/spacing';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  label?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  id,
  name,
  label,
}) => {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: SPACING['2'],
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {label && <span style={{ color: COLORS.neutral[900], fontSize: '14px' }}>{label}</span>}
      <div
        style={{
          position: 'relative',
          width: '40px',
          height: '20px',
          backgroundColor: checked ? COLORS.primary[500] : COLORS.neutral[300],
          borderRadius: RADII.full,
          transition: 'background-color 0.2s ease',
        }}
        onClick={() => !disabled && onChange(!checked)}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '22px' : '2px',
            width: '16px',
            height: '16px',
            backgroundColor: COLORS.white,
            borderRadius: '50%',
            transition: 'left 0.2s ease',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
          }}
        />
      </div>
    </label>
  );
};

export default Switch;
