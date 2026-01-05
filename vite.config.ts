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
    // Ensure Konva and related libs are treated as client-only during the SSR build
    noExternal: ['react-konva', 'konva', 'lucide-react', '@google/genai'],
  },
  build: {
    assetsInlineLimit: 0,
    sourcemap: true,
  }
});