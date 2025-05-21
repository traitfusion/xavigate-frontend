// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // loads your .env, .env.development, etc.
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      // only expose what you need
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(env.VITE_BACKEND_URL)
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,  // e.g. http://chat.xavigate.com:8080
          changeOrigin: true,
          secure: false,                  // for self-signed certs
          ws: true                        // proxy WebSockets if you’ve got them
        }
      }
    }
  };
});
