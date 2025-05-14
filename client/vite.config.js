import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/connect': 'http://localhost:3000',
      '/events': 'http://localhost:3000',
      '/config': 'http://localhost:3000',
    },
  },
});
