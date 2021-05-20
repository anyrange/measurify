module.exports = {
  pwa: {
    manifestOptions: {
      name: "Spotiworm",
      short_name: "Spotiworm",
      display: "standalone",
      theme_color: "#000000",
    },
    themeColor: "#414141",
    msTileColor: "#414141",
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
