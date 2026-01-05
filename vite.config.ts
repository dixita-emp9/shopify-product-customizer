import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(),
    reactRouter({
      ssr: true,
    }),
    tsconfigPaths()
  ],
  ssr: {
    noExternal: ['@shopify/hydrogen'],
    optimizeDeps: {
      include: ['@shopify/hydrogen', 'react', 'react-dom'],
    },
  },
  resolve: {
    alias: {
      // Replace Konva with empty module during SSR
      'konva': process.env.BUILD_TARGET === 'ssr' ? 'konva/lib/index-node.js' : 'konva',
      'react-konva': process.env.BUILD_TARGET === 'ssr' ? './ssr-stub.js' : 'react-konva',
    },
  },
});