import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const basePath = process.env.GITHUB_ACTIONS ? '/busan-trip-2026/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192.svg', 'pwa-512.svg'],
      manifest: {
        name: '阿滔阿欣｜2026 釜山自由行',
        short_name: '阿滔阿欣釜山行',
        description: '阿滔阿欣 2026 釜山五天四夜自由行程與地圖。',
        lang: 'zh-TW',
        theme_color: '#bfe8f5',
        background_color: '#fffaf0',
        display: 'standalone',
        orientation: 'portrait',
        start_url: `${basePath}#day-1`,
        scope: basePath,
        icons: [
          {
            src: `${basePath}pwa-192.svg`,
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: `${basePath}pwa-512.svg`,
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,png,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/(thumb\.wikimedia\.org|upload\.wikimedia\.org|live\.staticflickr\.com)\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'busan-travel-images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/loremflickr\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'busan-image-fallbacks',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})
