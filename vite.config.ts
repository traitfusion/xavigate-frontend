// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.log('Loading environment variables:', Object.keys(env));

  return {
    plugins: [react()],
    define: {
      'import.meta.env': JSON.stringify(env)
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://chat.xavigate.com:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    }
  };
});
