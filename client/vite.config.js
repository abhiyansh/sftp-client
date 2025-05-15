import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {SERVER_BASE_URL} from "../shared/config.js";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/connect': SERVER_BASE_URL,
      '/disconnect': SERVER_BASE_URL,
      '/files': SERVER_BASE_URL,
      '/config': SERVER_BASE_URL,
    },
  },
});
