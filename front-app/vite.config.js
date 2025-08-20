import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// 动态获取端口
const API_PORT = process.env.PORT || 3000;

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // mock-server 的端口
        changeOrigin: true,
      }
    }
  }
})
