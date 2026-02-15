import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { join } from 'path'

// Plugin to copy _redirects file to dist
const copyRedirects = () => {
  return {
    name: 'copy-redirects',
    closeBundle() {
      try {
        copyFileSync(
          join(__dirname, 'public', '_redirects'),
          join(__dirname, 'dist', '_redirects')
        )
        console.log('✅ Copied _redirects to dist')
      } catch (error) {
        console.warn('⚠️ Could not copy _redirects:', error.message)
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), copyRedirects()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['recharts']
        }
      }
    }
  },
  preview: {
    port: 3000,
    host: true
  }
})


