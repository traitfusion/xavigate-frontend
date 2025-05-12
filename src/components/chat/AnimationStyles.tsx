import React from 'react';

const animationCSS = `
@keyframes pulse {
  0% {
    opacity: 0.4;
    transform: scale(0.98);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.01);
  }
  100% {
    opacity: 0.4;
    transform: scale(0.98);
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes fadeIn {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.message-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.pulsating-logo {
  animation: pulse 2s ease-in-out infinite;
}
`;

const AnimationStyles: React.FC = () => {
  return <style>{animationCSS}</style>;
};

export default AnimationStyles;
