import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      'shared': path.resolve(__dirname, './packages/shared/src/index.ts'),
      'rereact': path.resolve(__dirname, './packages/rereact/src/index.ts'),
      'rereact-dom': path.resolve(__dirname, './packages/rereact-dom/src/index.ts'),
      'rereact-reconciler': path.resolve(__dirname, './packages/rereact-reconciler/src/index.ts'),
      'rereact-scheduler': path.resolve(__dirname, './packages/rereact-scheduler/src/index.ts'),
    },
  },
})
