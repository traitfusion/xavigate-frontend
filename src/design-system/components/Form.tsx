import React from 'react';
import { SPACING } from '../theme/spacing';

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  spacing?: keyof typeof SPACING | string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  spacing = SPACING['4'],
  disabled = false,
  style = {},
}) => {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: typeof spacing === 'string' ? spacing : SPACING[spacing],
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        ...style,
      }}
    >
      {children}
    </form>
  );
};

export default Form;
