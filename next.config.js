// next.config.js
module.exports = {
  output: 'export', // This tells Next.js to export your site as static HTML
  swcMinify: false,
  productionBrowserSourceMaps: true,
  images: {
    unoptimized: true, // Disable image optimization during the export
  },
};
