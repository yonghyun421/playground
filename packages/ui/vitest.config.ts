import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '@playground/vitest-config/base'

export default mergeConfig(baseConfig, defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
  },
}))
