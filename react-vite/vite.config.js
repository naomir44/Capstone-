import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    eslintPlugin({
      lintOnStart: true,
      failOnError: process.env.NODE_ENV === "production",
    }),
  ],
  server: {
    open: true,
    proxy: {
      "/api": "http://127.0.0.1:5000",
      "/socket.io": {
        target: "https://fair-share-3ygy.onrender.com",
        ws: true,
      },
    },
  },
});
