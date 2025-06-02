// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
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
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',         // 外部からアクセス可能にする
    port: 5173,
    strictPort: true,
    allowedHosts: 'all',
    hmr: {
      host: '0.0.0.0',
      port: 5173,
      protocol: 'ws',
    },
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    rollupOptions: {
      input: './index.html' // React Router対応：リロードで404防止
    }
  },
  resolve: {
    alias: {
      '@': '/src' // 開発時のインポート簡略化（任意）
    }
  }
});
