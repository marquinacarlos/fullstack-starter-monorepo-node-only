import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Fixed port: the API's CORS_ORIGINS depends on it.
  server: { port: 5173, strictPort: true },
});
