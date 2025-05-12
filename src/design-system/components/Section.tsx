import React from 'react';
import type { WithChildren } from '@/design-system/types';
import { SPACING } from '@/design-system/theme';

interface SectionProps extends WithChildren {
  gap?: 'sm' | 'md' | 'lg';
}

const Section: React.FC<SectionProps> = ({ children, gap = 'lg' }) => {
  return <div style={{ marginBottom: SPACING[gap] }}>{children}</div>;
};

export default Section;
