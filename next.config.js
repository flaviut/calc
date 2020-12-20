const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withImages = require("next-images");
const withPreact = require("next-plugin-preact");
const withSourceMaps = require("@zeit/next-source-maps");
module.exports = withImages(withBundleAnalyzer(withPreact(withSourceMaps({}))));
