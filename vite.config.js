import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development'

  return {
    base: '/',
    plugins: [react()],
    server: {
      proxy: isDevelopment
        ? {
            '/api': {
              target: 'http://localhost:4001',
              changeOrigin: true,
              secure: false
            }
          }
        : {}
    },
    build: {
      rollupOptions: {
        output: {
          // Separa los módulos de node_modules en chunks individuales para mejorar la carga
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0]
            }
          }
        }
      }
    }
  }
})
