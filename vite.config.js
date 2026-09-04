import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Proxy del mapa squaremap en desarrollo:
// el panel lo sirve bajo /squaremap en el mismo origen → sin CORS ni mixed content.
// En producción se necesita la misma regla en el reverse proxy (ver README).
const MAP_TARGET = "http://35.225.251.194:8080";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/squaremap": {
        target: MAP_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/squaremap/, ""),
      },
    },
  },
});
