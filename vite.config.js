import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@apis", replacement: "/src/apis" },
      { find: "@components", replacement: "/src/components" },
      { find: "@commons", replacement: "/src/components/commons" },
      { find: "@pages", replacement: "/src/pages" },
      { find: "@layouts", replacement: "/src/layouts" },
      { find: "@stores", replacement: "/src/stores" },
      { find: "@assets", replacement: "/src/assets" },
      { find: "@museum", replacement: "/src/components/museum" },
      { find: "@api", replacement: "/src/api" },
    ],
  },
});
