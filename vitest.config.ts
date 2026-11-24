import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Unit tests do not need the React/Tailwind plugins or local service settings.
  envDir: false,
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    allowOnly: false,
    passWithNoTests: false,
  },
})
