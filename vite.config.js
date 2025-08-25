import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@api", replacement: "/src/api" },
      { find: "@components", replacement: "/src/components" },
      { find: "@commons", replacement: "/src/components/commons" },
      { find: "@pages", replacement: "/src/pages" },
      { find: "@layouts", replacement: "/src/layouts" },
      { find: "@stores", replacement: "/src/stores" },
      { find: "@assets", replacement: "/src/assets" },
      { find: "@museum", replacement: "/src/components/museum" },
    ],
  },
  server: {
    proxy: {
      // "/api"로 들어오는 요청을 백엔드로 프록시
      "/api": {
        target: "https://api.artium.life", // 백엔드 서버
        changeOrigin: true, // 호스트 헤더를 target으로 변경
      },
    },
  },
});
