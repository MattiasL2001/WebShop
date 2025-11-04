import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  appType: 'spa',
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/product/': { target: 'https://localhost:7180', changeOrigin: true, secure: false },
      '/api/':     { target: 'https://localhost:7180', changeOrigin: true, secure: false },
      '/auth/':    { target: 'https://localhost:7180', changeOrigin: true, secure: false },
      '/user/':    { target: 'https://localhost:7180', changeOrigin: true, secure: false },
    }
  }
})
