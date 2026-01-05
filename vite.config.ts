import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(), 
    reactRouter(), 
    tsconfigPaths()
  ],
  build: {
    // This tells Vite not to look for an index.html as the primary entry
    ssr: true,
  },
  ssr: {
    // Explicitly point to the Oxygen server entry
    optimizeDeps: {
      include: ['@shopify/hydrogen'],
    },
  },
});
