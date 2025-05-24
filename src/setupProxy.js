const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * This proxy configuration ensures that API calls to '/api/*' are forwarded
 * to the actual backend server, avoiding CORS issues in development.
 *
 * The backend URL is read from REACT_APP_BACKEND_URL environment variable (must include '/api' suffix).
 * Fallback: 'http://chat.xavigate.com/api'
 */
// Determine backend URLs from environment variables
// REACT_APP_BACKEND_URL should include '/api' suffix (e.g., http://host:port/api)
const rawBackend = process.env.REACT_APP_BACKEND_URL || 'http://chat.xavigate.com/api';
// Strip trailing '/api' to proxy '/api' paths correctly
const backendRoot = rawBackend.replace(/\/api\/?$/, '');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendRoot,
      changeOrigin: true,
      logLevel: 'debug',
    })
  );
  // Proxy WebSocket connections for real-time features (e.g., chat)
  // Determine WebSocket backend separately if provided
  const rawBackendWS = process.env.REACT_APP_BACKEND_WS_URL || backendRoot;
  app.use(
    '/ws',
    createProxyMiddleware({
      target: rawBackendWS,
      changeOrigin: true,
      ws: true,
      logLevel: 'debug',
    })
  );
};