import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Fix for Redoc: "global is not defined" error
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['redoc', 'mermaid'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})

