import { defineConfig, loadEnv } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [
      hydrogen(),
      reactRouter(),
      tsconfigPaths(),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './app'), // Standard practice to point to app folder
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    optimizeDeps: {
      include: ['@shopify/hydrogen'],
    },
  };
});
