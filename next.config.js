// next.config.js
const isGithubActions = process.env.GITHUB_ACTIONS || false;
let assetPrefix = '';
let basePath = '';

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  assetPrefix: '/qiqiGame', // Ensure all assets (including images) are prefixed with /qiqiGame
  basePath: '/qiqiGame', // Ensure routing paths are prefixed with /qiqiGame
};
