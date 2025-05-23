import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.log('✅ Loaded environment variables:', Object.keys(env));

  return {
    plugins: [
      react({
        // include .js/.jsx as well as .ts/.tsx for JSX parsing
        include: ['src/**/*.{js,jsx,ts,tsx}'],
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env': JSON.stringify(env),
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://chat.xavigate.com:8080',
          changeOrigin: true,
          secure: false
        },
      },
    }
  };
});