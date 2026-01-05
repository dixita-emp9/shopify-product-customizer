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
    // Prevent these browser-heavy packages from being bundled into the server-side code
    noExternal: ['react-konva', 'konva', 'lucide-react', '@google/genai'],
  },
  server: {
    // Ensure the server can watch files outside the app directory if necessary
    fs: {
      allow: ['..'],
    },
  },
  build: {
    // Assets optimization for the Oxygen environment
    assetsInlineLimit: 0,
  }
});