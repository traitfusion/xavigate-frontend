const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * This proxy configuration ensures that API calls to '/api/*' are forwarded
 * to the actual backend server, avoiding CORS issues in development.
 *
 * The backend URL is read from REACT_APP_BACKEND_URL environment variable (must include '/api' suffix).
 * Fallback: 'http://chat.xavigate.com:8080/api'
 */
// Proxy target: backend root URL without '/api' suffix
const target = process.env.REACT_APP_BACKEND_URL || 'http://chat.xavigate.com:8080';

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      logLevel: 'debug',
    })
  );
  // Proxy WebSocket connections for real-time features (e.g., chat)
  app.use(
    '/ws',
    createProxyMiddleware({
      target: process.env.REACT_APP_BACKEND_WS_URL || process.env.REACT_APP_BACKEND_URL?.replace(/\/api\/?$/, '') || 'http://chat.xavigate.com:8080',
      changeOrigin: true,
      ws: true,
      logLevel: 'debug',
    })
  );
};