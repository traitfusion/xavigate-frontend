import React from 'react';
import { useScreenSize } from './useScreenSize';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({ children, style = {} }) => {
  const { isMobile, isTablet } = useScreenSize();

  const padding = isMobile ? '1rem' : isTablet ? '2rem 3rem' : '3rem 4rem';

  const maxWidth = isMobile ? '100%' : isTablet ? '768px' : '960px';

  return (
    <div
      style={{
        width: '100%',
        maxWidth,
        margin: '0 auto',
        padding,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveWrapper;
