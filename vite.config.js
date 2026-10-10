import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative assets work on both a project GitHub Pages URL and local preview.
// If you later use a custom domain, this setting can remain as-is.
export default defineConfig({
  plugins: [react()],
  base: './',
})
