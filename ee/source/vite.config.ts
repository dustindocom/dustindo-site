import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Makes the built page open by double-clicking ee/index.html (file://) as well as over http.
// Browsers block <script type="module"> on file://, so the single bundle is loaded as a classic script.
function classicScript(): Plugin {
  return {
    name: 'ee-classic-script',
    enforce: 'post',
    transformIndexHtml(html) {
      return html
        .replace(/<script type="module" crossorigin/g, '<script defer')
        .replace(/ crossorigin/g, '')
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), classicScript()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: {
    outDir: '..', // build straight into ee/ (the playable site)
    emptyOutDir: false,
    assetsDir: 'assets/build',
    rollupOptions: { output: { format: 'iife', inlineDynamicImports: true } },
  },
  server: { port: 8443 },
})
