import React from 'react';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  disabled = false,
  label,
  id,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING['1'] }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '14px',
            color: COLORS.neutral[900],
          }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          appearance: 'none',
          width: '100%',
          height: '4px',
          borderRadius: '2px',
          backgroundColor: COLORS.neutral[300],
          outline: 'none',
          accentColor: COLORS.primary[500],
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />
    </div>
  );
};

export default Slider;
