import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // plugins: [react()],
  // 使用 rereact 的 jsx runtime
  plugins: [react({ jsxImportSource: 'rereact' })],
})
