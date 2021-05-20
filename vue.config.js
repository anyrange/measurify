module.exports = {
  pwa: {
    manifestOptions: {
      name: "Spotiworm",
      short_name: "Spotiworm",
      display: "standalone",
      background_color: "#0b0b0b",
      themeColor: "#0b0b0b",
      msTileColor: "#00a300",
    },
    icons: [
      {
        src: "./img/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "./img/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "./img/icons/android-chrome-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "./img/icons/android-chrome-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "./src/sw.js",
      swDest: "service-worker.js",
    },
  },
};
