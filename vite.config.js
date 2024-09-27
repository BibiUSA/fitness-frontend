import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "/index.html", // this tells Vite where to look for the main HTML file
    },
  },
  server: {
    hmr: true, // optional: Hot module reload
    historyApiFallback: true, // <-- this is important for React Router
  },
});
