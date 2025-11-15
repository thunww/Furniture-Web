import { defineConfig } from "vite";
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Nếu muốn cố định cổng
    open: true,  // Tự động mở trình duyệt khi chạy
    hmr: false,
    host: true,
    allowedHosts: [
      '2330ca8c13d9.ngrok-free.app'
    ],
    
  },
  optimizeDeps: {
    exclude: ['react-csv']
  },
  css: {
    postcss: "./postcss.config.js",  // Kiểm tra dòng này
  },
});