import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist_react',
  },
  server: {
    port: 1234,
    strictPort: true,
  },
});
