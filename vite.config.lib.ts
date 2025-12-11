import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// Library build configuration
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/lib'],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
  define: {
    global: 'globalThis',
  },
  publicDir: false, // Don't copy public folder to dist
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'RedocWithMermaid',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // Externalize all dependencies - users will install them
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'redoc',
        'mermaid',
        'styled-components',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          redoc: 'Redoc',
          mermaid: 'mermaid',
          'styled-components': 'styled',
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
})
