
import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {remix} from '@remix-run/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(),
    remix({
      buildDirectory: 'dist',
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
      include: ['react-konva', 'konva', 'lucide-react', '@google/genai'],
    },
    // Ensure canvas and UI libraries are handled correctly in the Oxygen worker environment
    noExternal: ['react-konva', 'konva', 'lucide-react'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@remix-run/react'],
  },
  build: {
    // Oxygen-specific optimizations
    assetsInlineLimit: 0,
  }
});
