import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          { src: 'sitemap.xml', dest: '.' }
        ]
      })
    ],

    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
        }
      }
    },

    define: {
      'process.env.VITE_BACKEND_URL': JSON.stringify(env.VITE_BACKEND_URL)
    }
  }
})
