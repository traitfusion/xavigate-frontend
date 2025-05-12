// Environment-specific configuration
const isDocker = false; // Force to always use localhost for development

// Debug environment variables
console.log('🔧 REACT_APP_ENVIRONMENT:', process.env.REACT_APP_ENVIRONMENT);
console.log('🔧 REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// Always use localhost for API URL
export const API_URL = 'http://localhost:8010';

console.log('🔧 Final API_URL:', API_URL);
