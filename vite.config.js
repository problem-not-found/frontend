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
  server: {
    proxy: {
      // // "/api"로 들어오는 요청을 백엔드로 프록시
      // "/api": {
      //   target: "https://api.artium.life", // 백엔드 서버
      //   changeOrigin: true, // 호스트 헤더를 target으로 변경
      // },

      // S3 이미지를 위한 프록시 (CORS 해결)
      "/s3-proxy": {
        target: "https://likelion13-artium.s3.ap-northeast-2.amazonaws.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3-proxy/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            // CORS 헤더 추가
            proxyReq.setHeader("Access-Control-Allow-Origin", "*");
          });
        },
      },
    },
  },
});
