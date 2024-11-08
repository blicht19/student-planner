import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const devMode = mode === 'development';
  const proxy = devMode ? {
    '/backend': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/backend/, ''),
    }
  } : undefined;

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly'
      }
    }
  }
})
