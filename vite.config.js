import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import WindiCSS from "vite-plugin-windicss";
import Components from "unplugin-vue-components/vite";

const _dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "./client",
  plugins: [
    vue(),
    WindiCSS(),
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
        name: "Spotiworm",
        short_name: "Spotiworm",
        description: "Track your listening history and get stats",
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
  resolve: {
    alias: {
      "@": resolve(_dirname, "./client/src"),
    },
  },
});
