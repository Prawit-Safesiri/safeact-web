import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { cssCodeSplit: false },
  // พอร์ตประจำของโปรเจ็คนี้ — ไม่ชนกับโปรเจ็คอื่น (5173–5177, 4173, 8080, 8124)
  server: { port: 5180, strictPort: true },
  preview: { port: 4180, strictPort: true },
});
