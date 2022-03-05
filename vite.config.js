import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import Windi from "vite-plugin-windicss";
import Components from "unplugin-vue-components/vite";

const _dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "./client",
  resolve: {
    alias: {
      "@": resolve(_dirname, "./client/src"),
    },
  },
  plugins: [
    vue(),
    Windi({
      config: resolve(_dirname, "windi.config.js"),
    }),
    Components({
      dirs: ["src/components"],
      extensions: ["vue"],
      deep: true,
    }),
    VitePWA({
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: false,
        sourcemap: true,
      },
      manifest: {
        name: "measurify",
        short_name: "measurify",
        description: "Measure your listening history and get stats",
        theme_color: "#0b0b0b",
        background_color: "#0b0b0b",
        display: "standalone",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
