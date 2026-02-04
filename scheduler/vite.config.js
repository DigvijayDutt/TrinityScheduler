import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/schedulerr/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'trinity.energeticitsolutions.com'
    ],
    hmr: {
      host: 'trinity.energeticitsolutions.com',
      protocol: 'wss',
    },
  },
})
