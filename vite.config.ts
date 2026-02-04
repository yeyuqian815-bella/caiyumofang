
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Vite 默认通过 import.meta.env 暴露环境变量，而不是 process.env
    // 这里将 process.env.API_KEY 映射到 import.meta.env.VITE_API_KEY，
    // 以便在代码中仍使用 process.env.API_KEY，同时兼容 Vite 的环境变量机制。
    'process.env.API_KEY': 'import.meta.env.VITE_API_KEY',
  },
});
