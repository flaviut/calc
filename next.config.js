const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withSourceMaps = require("@zeit/next-source-maps");

module.exports =  withBundleAnalyzer(
    withSourceMaps({
      images: {
        loader: "imgix",
        path: "https://example.com/neverused/",
      },
      basePath: "/calc",
    })
);
