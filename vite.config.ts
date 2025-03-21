import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'shaka-player': ['shaka-player/dist/shaka-player.ui'],
        }
      }
    }
  }
});