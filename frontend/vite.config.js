import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server : {
    '/api': {
      target: 'http://localhost:8000', // Backend address
      // changeOrigin: true,
      // secure: false,
    },
  },
  plugins: [react()],
})
