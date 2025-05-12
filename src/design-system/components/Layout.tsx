import React from 'react';
import type { WithChildren } from '@/design-system/types';
import { SPACING, COLORS } from '@/design-system/theme';

const Layout: React.FC<WithChildren> = ({ children }) => {
  return (
    <div
      style={{
        padding: SPACING.lg,
        maxWidth: '960px',
        margin: '0 auto',
        backgroundColor: COLORS.light,
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
};

export default Layout;
