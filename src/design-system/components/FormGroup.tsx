import React from 'react';
import { FONT_FAMILIES, FONT_SIZES } from '../theme/typography';
import { SPACING } from '../theme/spacing';
import { COLORS } from '../theme/colors';

interface FormGroupProps {
  label?: string;
  htmlFor?: string;
  children: React.ReactNode;
  helperText?: string;
  error?: string;
  required?: boolean;
  style?: React.CSSProperties;
}

const FormGroup: React.FC<FormGroupProps> = ({
  label,
  htmlFor,
  children,
  helperText,
  error,
  required = false,
  style = {},
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING['1'], ...style }}>
      {label && (
        <label
          htmlFor={htmlFor}
          style={{
            fontFamily: FONT_FAMILIES.body,
            fontSize: FONT_SIZES.sm,
            color: COLORS.neutral[900],
          }}
        >
          {label}
          {required && <span style={{ color: COLORS.primary[500] }}> *</span>}
        </label>
      )}

      {children}

      {helperText && !error && (
        <small
          style={{
            fontSize: FONT_SIZES.sm,
            color: COLORS.neutral[600],
          }}
        >
          {helperText}
        </small>
      )}

      {error && (
        <small
          style={{
            fontSize: FONT_SIZES.sm,
            color: COLORS.primary[500],
          }}
        >
          {error}
        </small>
      )}
    </div>
  );
};

export default FormGroup;
