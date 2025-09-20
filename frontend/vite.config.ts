import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Auth service - порт 8080
      '/api/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, '/auth'),
      },
      // Posts service - порт 7070  
      '/api/posts': {
        target: 'http://localhost:7070',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/posts/, '/api/posts'),
      }
    }
  }
})