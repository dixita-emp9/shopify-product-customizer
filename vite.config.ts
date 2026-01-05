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
    // These packages must not be bundled into the server-side code as they require 'window' or 'canvas'
    noExternal: ['react-konva', 'konva', 'lucide-react', '@google/genai'],
  },
  build: {
    // Standard Hydrogen optimization for the Oxygen deployment platform
    assetsInlineLimit: 0,
    sourcemap: true,
  }
});