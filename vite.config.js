import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: [
      { find: 'components', replacement: path.resolve(__dirname, 'src/components') },
      { find: 'data', replacement: path.resolve(__dirname, 'src/data') },
      { find: 'helpers', replacement: path.resolve(__dirname, 'src/helpers') },
      { find: 'layouts', replacement: path.resolve(__dirname, 'src/layouts') },
      { find: 'pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: 'routes', replacement: path.resolve(__dirname, 'src/routes') },
      { find: 'theme', replacement: path.resolve(__dirname, 'src/theme') },
      { find: 'assets', replacement: path.resolve(__dirname, 'src/assets') },
    ]
  },

  // ✅ Add this to support .lottie files
  assetsInclude: ['**/*.lottie' , '**/*.glb', '**/*.gltf'],

  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/s3-proxy': {
        target: 'https://ai3dscanning-crm.s3.ap-south-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3-proxy/, ''),
      },
      // Backend sometimes returns triple-n bucket host; keep separate proxy for valid signatures.
      '/s3-proxy-typo': {
        target: 'https://ai3dscannning-crm.s3.ap-south-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3-proxy-typo/, ''),
      },
      '/ai-api': {
        target: 'https://ai3d_api.ai3dscanning.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ai-api/, ''),
      },
    }
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'react-toastify'],
        },
      },
    },
  },
  preview: {
    port: 5000,
  },
});
