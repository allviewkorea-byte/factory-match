import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // 코드 스플리팅 - 청크 분리
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
    // 청크 크기 경고 임계값
    chunkSizeWarningLimit: 1000,
  },
  // 환경변수
  define: {
    'process.env': {},
  },
});
