import React from 'react';
import { FONT_SIZES, FONT_WEIGHTS, FONT_FAMILIES } from '@/design-system/theme';
import type { WithChildren } from '@/design-system/types';

const PageTitle: React.FC<WithChildren> = ({ children }) => {
  return (
    <h1
      style={{
        fontSize: FONT_SIZES['3xl'],
        fontWeight: FONT_WEIGHTS.bold,
        fontFamily: FONT_FAMILIES.heading,
        marginBottom: '1.5rem',
        color: '#111827',
      }}
    >
      {children}
    </h1>
  );
};

export default PageTitle;
