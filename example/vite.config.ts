import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    // plugins: [react()],
    // 使用 rereact 的 jsx runtime
    plugins: [react({ jsxImportSource: 'rereact' })],
    build: {
      sourcemap: isDev,
    },
  }
})
