// vite.config.js
import { defineConfig } from "file:///D:/Projects/New%20folder/AI_3d_scanning/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Projects/New%20folder/AI_3d_scanning/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "D:\\Projects\\New folder\\AI_3d_scanning";
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: [
      { find: "components", replacement: path.resolve(__vite_injected_original_dirname, "src/components") },
      { find: "data", replacement: path.resolve(__vite_injected_original_dirname, "src/data") },
      { find: "helpers", replacement: path.resolve(__vite_injected_original_dirname, "src/helpers") },
      { find: "layouts", replacement: path.resolve(__vite_injected_original_dirname, "src/layouts") },
      { find: "pages", replacement: path.resolve(__vite_injected_original_dirname, "src/pages") },
      { find: "routes", replacement: path.resolve(__vite_injected_original_dirname, "src/routes") },
      { find: "theme", replacement: path.resolve(__vite_injected_original_dirname, "src/theme") },
      { find: "assets", replacement: path.resolve(__vite_injected_original_dirname, "src/assets") }
    ]
  },
  // ✅ Add this to support .lottie files
  assetsInclude: ["**/*.lottie", "**/*.glb", "**/*.gltf"],
  server: {
    host: "0.0.0.0",
    port: 3e3,
    proxy: {
      "/s3-proxy": {
        target: "https://ai3dscanning-crm.s3.ap-south-1.amazonaws.com",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/s3-proxy/, "")
      },
      // Backend sometimes returns triple-n bucket host; keep separate proxy for valid signatures.
      "/s3-proxy-typo": {
        target: "https://ai3dscannning-crm.s3.ap-south-1.amazonaws.com",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/s3-proxy-typo/, "")
      },
      "/ai-api": {
        target: "https://ai3d_api.ai3dscanning.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path2) => path2.replace(/^\/ai-api/, "")
      }
    }
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["framer-motion", "react-toastify"]
        }
      }
    }
  },
  preview: {
    port: 5e3
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxOZXcgZm9sZGVyXFxcXEFJXzNkX3NjYW5uaW5nXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxOZXcgZm9sZGVyXFxcXEFJXzNkX3NjYW5uaW5nXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Qcm9qZWN0cy9OZXclMjBmb2xkZXIvQUlfM2Rfc2Nhbm5pbmcvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IFtcclxuICAgICAgeyBmaW5kOiAnY29tcG9uZW50cycsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2NvbXBvbmVudHMnKSB9LFxyXG4gICAgICB7IGZpbmQ6ICdkYXRhJywgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvZGF0YScpIH0sXHJcbiAgICAgIHsgZmluZDogJ2hlbHBlcnMnLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9oZWxwZXJzJykgfSxcclxuICAgICAgeyBmaW5kOiAnbGF5b3V0cycsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2xheW91dHMnKSB9LFxyXG4gICAgICB7IGZpbmQ6ICdwYWdlcycsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3BhZ2VzJykgfSxcclxuICAgICAgeyBmaW5kOiAncm91dGVzJywgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvcm91dGVzJykgfSxcclxuICAgICAgeyBmaW5kOiAndGhlbWUnLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy90aGVtZScpIH0sXHJcbiAgICAgIHsgZmluZDogJ2Fzc2V0cycsIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2Fzc2V0cycpIH0sXHJcbiAgICBdXHJcbiAgfSxcclxuXHJcbiAgLy8gXHUyNzA1IEFkZCB0aGlzIHRvIHN1cHBvcnQgLmxvdHRpZSBmaWxlc1xyXG4gIGFzc2V0c0luY2x1ZGU6IFsnKiovKi5sb3R0aWUnICwgJyoqLyouZ2xiJywgJyoqLyouZ2x0ZiddLFxyXG5cclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6ICcwLjAuMC4wJyxcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL3MzLXByb3h5Jzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vYWkzZHNjYW5uaW5nLWNybS5zMy5hcC1zb3V0aC0xLmFtYXpvbmF3cy5jb20nLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvczMtcHJveHkvLCAnJyksXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIEJhY2tlbmQgc29tZXRpbWVzIHJldHVybnMgdHJpcGxlLW4gYnVja2V0IGhvc3Q7IGtlZXAgc2VwYXJhdGUgcHJveHkgZm9yIHZhbGlkIHNpZ25hdHVyZXMuXHJcbiAgICAgICcvczMtcHJveHktdHlwbyc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwczovL2FpM2RzY2Fubm5pbmctY3JtLnMzLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbScsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9zMy1wcm94eS10eXBvLywgJycpLFxyXG4gICAgICB9LFxyXG4gICAgICAnL2FpLWFwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwczovL2FpM2RfYXBpLmFpM2RzY2FubmluZy5jb20nLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICBzZWN1cmU6IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FpLWFwaS8sICcnKSxcclxuICAgICAgfSxcclxuICAgIH1cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgJ3JlYWN0LXZlbmRvcic6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcclxuICAgICAgICAgICd1aS12ZW5kb3InOiBbJ2ZyYW1lci1tb3Rpb24nLCAncmVhY3QtdG9hc3RpZnknXSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHByZXZpZXc6IHtcclxuICAgIHBvcnQ6IDUwMDAsXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlMsU0FBUyxvQkFBb0I7QUFDeFUsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsRUFBRSxNQUFNLGNBQWMsYUFBYSxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCLEVBQUU7QUFBQSxNQUM3RSxFQUFFLE1BQU0sUUFBUSxhQUFhLEtBQUssUUFBUSxrQ0FBVyxVQUFVLEVBQUU7QUFBQSxNQUNqRSxFQUFFLE1BQU0sV0FBVyxhQUFhLEtBQUssUUFBUSxrQ0FBVyxhQUFhLEVBQUU7QUFBQSxNQUN2RSxFQUFFLE1BQU0sV0FBVyxhQUFhLEtBQUssUUFBUSxrQ0FBVyxhQUFhLEVBQUU7QUFBQSxNQUN2RSxFQUFFLE1BQU0sU0FBUyxhQUFhLEtBQUssUUFBUSxrQ0FBVyxXQUFXLEVBQUU7QUFBQSxNQUNuRSxFQUFFLE1BQU0sVUFBVSxhQUFhLEtBQUssUUFBUSxrQ0FBVyxZQUFZLEVBQUU7QUFBQSxNQUNyRSxFQUFFLE1BQU0sU0FBUyxhQUFhLEtBQUssUUFBUSxrQ0FBVyxXQUFXLEVBQUU7QUFBQSxNQUNuRSxFQUFFLE1BQU0sVUFBVSxhQUFhLEtBQUssUUFBUSxrQ0FBVyxZQUFZLEVBQUU7QUFBQSxJQUN2RTtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBR0EsZUFBZSxDQUFDLGVBQWdCLFlBQVksV0FBVztBQUFBLEVBRXZELFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLGFBQWE7QUFBQSxRQUNYLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLGVBQWUsRUFBRTtBQUFBLE1BQ25EO0FBQUE7QUFBQSxNQUVBLGtCQUFrQjtBQUFBLFFBQ2hCLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLG9CQUFvQixFQUFFO0FBQUEsTUFDeEQ7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLGFBQWEsRUFBRTtBQUFBLE1BQ2pEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGNBQWM7QUFBQSxJQUNkLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLGdCQUFnQixDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxVQUN6RCxhQUFhLENBQUMsaUJBQWlCLGdCQUFnQjtBQUFBLFFBQ2pEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
