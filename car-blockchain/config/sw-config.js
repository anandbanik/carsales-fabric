module.exports = {
  cache: {
    cacheId: "car-blockchain",
    runtimeCaching: [{
      handler: "fastest",
      urlPattern: "\/$"
    }],
    staticFileGlobs: ['dist/**/*']
  },
  manifest: {
    background: "#FFFFFF",
    title: "car-blockchain",
    short_name: "PWA",
    theme_color: "#FFFFFF"
  }
};
