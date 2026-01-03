
import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {remix} from '@remix-run/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ isSsrBuild }) => ({
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
  build: {
    // When building for SSR (Hydrogen/Remix), we must specify the server entry point
    // and prevent Vite from defaulting to index.html which causes deployment failures.
    rollupOptions: isSsrBuild ? {
      input: 'server.ts',
    } : {},
  },
  ssr: {
    optimizeDeps: {
      include: ['react-konva', 'konva', 'lucide-react', '@google/genai'],
    },
    // Ensure canvas and UI libraries are handled correctly in the Oxygen worker environment
    noExternal: ['react-konva', 'konva', 'lucide-react'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@remix-run/react'],
  }
}));
