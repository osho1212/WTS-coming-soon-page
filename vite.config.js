import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Raise the warning threshold — Three.js chunks are legitimately large
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Isolate the heaviest runtime deps so they can be cached independently
          'three-core':  ['three'],
          'three-fiber': ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'postprocessing'],
          'gsap':        ['gsap'],
          'lenis':       ['lenis'],
          'ogl':         ['ogl'],
        },
      },
    },
  },
})
