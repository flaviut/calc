const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withImages = require('next-images')
const withSass = require('@zeit/next-sass')
module.exports = withSass(withImages(withBundleAnalyzer({})))
