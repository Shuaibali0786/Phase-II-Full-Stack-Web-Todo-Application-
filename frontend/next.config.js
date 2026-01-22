/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure proper transpilation for dependencies
  transpilePackages: ['framer-motion', 'lucide-react'],
};

module.exports = nextConfig;
