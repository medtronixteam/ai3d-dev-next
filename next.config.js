import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Root /pages is intentionally empty. Next.js prefers it over src/pages,
// so the existing React screens stay in src/pages and routes live in /app.

const alias = {
  components: path.resolve(__dirname, 'src/components'),
  data: path.resolve(__dirname, 'src/data'),
  helpers: path.resolve(__dirname, 'src/helpers'),
  layouts: path.resolve(__dirname, 'src/layouts'),
  pages: path.resolve(__dirname, 'src/pages'),
  routes: path.resolve(__dirname, 'src/routes'),
  theme: path.resolve(__dirname, 'src/theme'),
  assets: path.resolve(__dirname, 'src/assets'),
  lib: path.resolve(__dirname, 'src/lib'),
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    disableStaticImages: true,
  },
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  },
  async redirects() {
    return [
      { source: '/about', destination: '/about-us', permanent: false },
      { source: '/services', destination: '/service', permanent: false },
      { source: '/enterprise', destination: '/3dio/enterprise', permanent: false },
      { source: '/student', destination: '/student-program', permanent: false },
      { source: '/3dio/recent-projects', destination: '/3dio/models', permanent: false },
      { source: '/subscription/cancelled', destination: '/3dio/subscription', permanent: false },
      { source: '/subscription/cancel', destination: '/3dio/subscription', permanent: false },
      { source: '/3dio/subscription/cancel', destination: '/3dio/subscription', permanent: false },
      { source: '/3dio/subscription/cancelled', destination: '/3dio/subscription', permanent: false },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/s3-proxy/:path*',
        destination: 'https://ai3dscanning-crm.s3.ap-south-1.amazonaws.com/:path*',
      },
      {
        source: '/s3-proxy-typo/:path*',
        destination: 'https://ai3dscannning-crm.s3.ap-south-1.amazonaws.com/:path*',
      },
      {
        source: '/ai-api/:path*',
        destination: 'https://ai3d_api.ai3dscanning.com/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'https://dev-backend.ai3dscanning.com/api/:path*',
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ...alias,
      'react-router-dom$': path.resolve(__dirname, 'src/lib/router-compat.jsx'),
    };

    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|avif|ico|bmp|svg|mp4|webm|glb|gltf|lottie|woff2?|ttf|eot)$/i,
      type: 'asset/resource',
    });

    return config;
  },
};

export default nextConfig;
