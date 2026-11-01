import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    plugins: [react(), tailwindcss()],
    // Fixed port: the API's CORS_ORIGINS depends on it. strictPort fails instead of moving.
    server: { port: 5174, strictPort: true },
  },
});
