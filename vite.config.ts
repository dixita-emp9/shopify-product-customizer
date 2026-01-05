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
    // Ensure browser-only libraries are not bundled for the server-side environment
    noExternal: ['react-konva', 'konva', 'lucide-react', '@google/genai'],
  },
  build: {
    // Optimization for Oxygen platform
    assetsInlineLimit: 0,
  }
});