import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // admin-warehouse memakai 5173, korlap memakai 5174 agar bisa jalan bersamaan
    port: 5174,
    open: true,
  },
});
