import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// base must match the GitHub Pages project path, or assets 404
export default defineConfig({
  base: '/love-festival/',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
