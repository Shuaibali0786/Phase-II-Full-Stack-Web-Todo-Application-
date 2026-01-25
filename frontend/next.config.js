/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure proper transpilation for dependencies
  transpilePackages: ['framer-motion', 'lucide-react'],

  // Webpack configuration for improved dev performance
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Exclude problematic Windows system directories from file watching
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/System Volume Information/**',
          '**/$RECYCLE.BIN/**',
          '**/Recovery/**',
        ],
        // Reduce polling frequency to improve performance
        poll: false,
        aggregateTimeout: 300,
      };

      // Improve rebuild speed by limiting snapshot scope
      if (config.snapshot) {
        config.snapshot.managedPaths = [/^(.+?[\\/]node_modules[\\/])/];
      }
    }

    return config;
  },

  // Experimental features for faster dev experience
  experimental: {
    // Optimize package imports for faster compilation
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

module.exports = nextConfig;
