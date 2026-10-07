import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { embeddedImages } from './scripts/embedded-images.mjs'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  build: { cssCodeSplit: false, assetsInlineLimit: Number.MAX_SAFE_INTEGER },
  plugins: [react(), tailwindcss(), ...(command === 'build' ? [embeddedImages()] : [])],
}))
