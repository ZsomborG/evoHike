import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: {
        tsconfigPath: './tsconfig.app.json',
      },
    }),
  ],
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'https://localhost:7275',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
