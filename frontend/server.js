/**
 * Production server for AWS App Runner
 * Serves the built Vite application
 */
import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')))

// Handle client-side routing - return index.html for all routes
app.get('*', (req, res) => {
  try {
    const indexPath = join(__dirname, 'dist', 'index.html')
    const indexHtml = readFileSync(indexPath, 'utf-8')
    res.setHeader('Content-Type', 'text/html')
    res.send(indexHtml)
  } catch (error) {
    console.error('Error serving index.html:', error)
    res.status(500).send('Error loading application')
  }
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📦 Serving files from: ${join(__dirname, 'dist')}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`)
})

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  process.exit(0)
})

