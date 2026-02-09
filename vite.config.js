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

  assetsInclude: ['**/*.lottie', '**/*.glb', '**/*.gltf'],

  server: {
    host: '0.0.0.0',
    port: 3000,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  preview: {
    port: 5000,
  },
  build: {
    target: "es2018", 
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
