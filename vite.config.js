import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  root: 'src/frontend',
  plugins: [svelte(), tailwindcss()],

  server: {
    port: 5173
  },

  resolve: {
    alias: {
      '$lib': path.resolve('src/frontend/lib')
    }
  },

  publicDir: 'public',

  build: {
    outDir: '../../dist',
    emptyOutDir: true
  }
})