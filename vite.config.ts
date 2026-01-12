import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Gzip compression
    compression({
      algorithms: ['gzip'],
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    // Brotli compression for even better compression
    compression({
      algorithms: ['brotliCompress'],
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    // Service Worker for caching and offline support
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'vite.svg'],
      manifest: {
        name: 'Dr V Hair Clinic',
        short_name: 'Dr V Hair',
        description: 'Leading hair restoration clinic specializing in FUE and FUT hair transplants',
        theme_color: '#112D4E',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        // Cache critical assets aggressively
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,avif,PNG,JPG,JPEG}'],
        // Increase cache size limits for better performance
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Aggressive image caching with CacheFirst strategy
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|PNG|JPG|JPEG)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache-v1',
              expiration: {
                maxEntries: 150, // Increased from 60
                maxAgeSeconds: 60 * 60 * 24 * 90 // 90 days for long-term caching
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache all assets from /assets/ with high priority
            urlPattern: /\/assets\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-assets-cache-v1',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year - local assets rarely change
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
  ],
  build: {
    sourcemap: false,
    minify: 'terser',
    cssMinify: true,
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline small assets as base64
    chunkSizeWarningLimit: 800,
    // Optimize asset handling for better caching
    assetsDir: 'assets',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          // Use content hash for long-term caching
          if (name && /\.(png|jpe?g|gif|webp|avif|svg|PNG|JPG|JPEG)$/i.test(name)) return 'assets/img/[name]-[hash][extname]';
          if (name && /\.(woff2?|ttf|otf|eot)$/.test(name)) return 'assets/fonts/[name]-[hash][extname]';
          if (name && /\.(css)$/.test(name)) return 'assets/css/[name]-[hash][extname]';
          return 'assets/[name]-[hash][extname]';
        },
        manualChunks(id) {
          // Enhanced vendor chunking for better caching and code splitting
          if (id.includes('node_modules')) {
            // Core React libraries
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // Icon library
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Other dependencies
            return 'vendor';
          }

          // Split application code by feature
          if (id.includes('/components/')) {
            // Lazy-loaded page components
            if (id.includes('ServiceDetails') || id.includes('pages/')) {
              return 'pages';
            }
            // Above-the-fold critical components
            if (id.includes('Header') || id.includes('Hero')) {
              return 'critical';
            }
            // Below-the-fold components
            return 'components';
          }

          // Utilities and helpers
          if (id.includes('/utils/') || id.includes('/hooks/')) {
            return 'utils';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: [],
  },
  server: {
    allowedHosts: [
      'jami-unmended-puzzlingly.ngrok-free.dev',
      '.ngrok-free.dev', // Allow all ngrok free domains
      '.ngrok.io', // Allow all ngrok domains
    ],
    headers: {
      // Enable long-term caching for static assets (STEP 2 from performance optimization)
      'Cache-Control': 'public, immutable, max-age=31536000', // 1 year
    },
  },
});
