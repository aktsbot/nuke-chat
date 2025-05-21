import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/nc": {
        target: "http://localhost:3080",
        ws: true,
      },
    },
  },
});
