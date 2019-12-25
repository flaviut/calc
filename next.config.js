const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withImages = require('next-images')
const withCSS = require('@zeit/next-css')
module.exports = withCSS(withImages(withBundleAnalyzer({})))
