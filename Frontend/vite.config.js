import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Whenever Vite sees '/api', it will secretly route it to localhost:5000
      '/api': 'http://localhost:5000'
    }
  }
})