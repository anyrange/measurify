import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import Vue from "@vitejs/plugin-vue"
import Windi from "vite-plugin-windicss"
import Components from "unplugin-vue-components/vite"

const _dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(_dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  plugins: [
    Vue(),
    Windi(),
    Components({
      dirs: ["src/components"],
      extensions: ["vue"],
      deep: true,
      dts: true,
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
        description: "Measure your listening history",
        theme_color: "#121212",
        background_color: "#121212",
        display: "standalone",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
})
