
import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
// Fix: Import vitePlugin as remix to resolve exported member error
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(),
    remix({
      buildDirectory: 'dist',
      ignoredRouteFiles: ['**/.*'],
      future: {
        v3_fetcherPersist: true,
        v3_relativeRoutingPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    optimizeDeps: {
      include: ['react-konva', 'konva'],
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@remix-run/react'],
  },
  build: {
    // Standard Remix/Hydrogen build configuration
    assetsInlineLimit: 0,
  }
});
