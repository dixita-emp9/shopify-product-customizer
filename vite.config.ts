import { reactRouter } from "@react-router/dev/vite";
import { hydrogen } from "@shopify/hydrogen/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    hydrogen(),
    reactRouter(),
    tsconfigPaths(),
  ],
  ssr: {
    // These packages depend on browser globals and should not be bundled for the server
    noExternal: ['react-konva', 'konva', 'lucide-react', '@google/genai'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router', 'konva', 'react-konva'],
  },
  build: {
    // Optimizations for Oxygen deployment
    assetsInlineLimit: 0,
    rollupOptions: {
      // Ensure we don't accidentally try to bundle index.html
      input: undefined,
    }
  }
});
