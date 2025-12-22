import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    // Code splitting by route
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui': ['@mui/material', '@mui/icons-material'],
          'utils': ['zustand', 'axios'],
        },
      },
    },
    // Optimize chunk sizes
    chunkSizeWarningLimit: 1000,
    // Source maps for production debugging (optional)
    sourcemap: process.env.VITE_ENVIRONMENT !== 'production',
    // Minify
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.VITE_ENVIRONMENT === 'production',
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})

