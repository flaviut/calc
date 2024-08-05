const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({
  webpack: (config, options) => {
    if (options.dev) {
      config.devtool = "cheap-module-source-map";
    }
    return config;
  },
  images: {
    loader: "imgix",
    path: "https://example.com/neverused/",
  },
  basePath: "/calc",
  reactStrictMode: true,
});
