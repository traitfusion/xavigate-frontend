import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'ghost' | 'primary';
  onClick?: () => void;
  style?: React.CSSProperties;
};

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const base = {
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'all 0.2s ease',
  };

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      ...base,
      backgroundColor: '#4F46E5',
      color: 'white',
      borderColor: '#4F46E5',
    },
    ghost: {
      ...base,
      backgroundColor: 'transparent',
      color: '#4F46E5',
      borderColor: '#D1D5DB',
    },
  };

  return (
    <button {...props} style={styles[variant]}>
      {children}
    </button>
  );
};

export {};
