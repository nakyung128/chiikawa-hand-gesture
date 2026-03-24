import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // MediaPipe WASM 패키지는 Vite pre-bundling에서 제외해야 정상 동작
    exclude: ['@mediapipe/tasks-vision'],
  },
  build: {
    sourcemap: false,
  },
  server: {
    headers: {
      // SharedArrayBuffer(WASM) 사용을 위한 보안 헤더
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});
