import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Supabaseの環境変数をビルド時に明示的に注入（重要）
// 環境変数を取り込み、Supabase設定をビルド時に埋め込む
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/', // VercelでのSPAルーティング安定化のために明示
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.svg',
          'favicon.ico',
          'robots.txt',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png'
        ],
        manifest: {
          name: 'ホストクラブ管理アプリ',
          short_name: 'ホス管',
          description: 'ホストクラブの来店・卓状況・キャスト管理アプリ',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      host: '0.0.0.0',
      port: 5173,
      protocol: 'ws'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
