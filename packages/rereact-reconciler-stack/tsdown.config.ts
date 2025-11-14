import process from 'node:process'
import { defineConfig } from 'tsdown'

const isDev = process.argv.includes('--watch') || process.env.NODE_ENV === 'development'

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: isDev,
})
