import { defineConfig } from 'vite';
import path from 'node:path';

// GitHub Pages hosts the site at /repo-name/, so CI sets VITE_BASE_PATH.
// Locally we leave it as "/".
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
    // Phaser 4's own bundle is larger than Vite's default 500 kB warning.
    chunkSizeWarningLimit: 2000,
  },
});
