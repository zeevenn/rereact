import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // React 15 使用经典 JSX transform
      jsxRuntime: 'classic',
    }),
  ],
})
