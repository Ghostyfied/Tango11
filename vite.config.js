import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Relative base so the build works at a domain root (Netlify, tango11.nl)
  // and under a subpath (GitHub Pages) alike
  base: './',
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        pay: fileURLToPath(new URL('./pay/index.html', import.meta.url)),
      },
    },
  },
})
