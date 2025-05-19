import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // 追加：外部トンネル経由のホスト名をすべて許可
    allowedHosts: 'all',
    hmr: {
      host: '0.0.0.0',
      port: 5173,
      protocol: 'ws',
    },
  },
})
