module.exports = {
  pwa: {
    manifestOptions: {
      name: "Spotiworm",
      short_name: "Spotiworm",
      display: "standalone",
      themeColor: "#0b0b0b",
      msTileColor: "#0b0b0b",
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
    ],
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "./src/sw.js",
      swDest: "service-worker.js",
    },
  },
};
