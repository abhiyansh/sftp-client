import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/connect': 'http://localhost:3000',
      '/disconnect': 'http://localhost:3000',
      '/files': 'http://localhost:3000',
      '/config': 'http://localhost:3000',
    },
  },
});
