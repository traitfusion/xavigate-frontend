import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/',
    publicDir: 'public',
    build: {
      rollupOptions: {
        input: './index.html',
      },
      outDir: 'dist',
      emptyOutDir: true,
    },
    plugins: [
      react(),
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
          target: 'http://chat.xavigate.com',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
