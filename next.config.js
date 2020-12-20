const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withImages = require('next-images')
const withSourceMaps = require('@zeit/next-source-maps')
module.exports = withImages(withBundleAnalyzer(withSourceMaps({})))
