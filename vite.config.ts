import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import devApi from "./vite-dev-api";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    devApi(mode),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
