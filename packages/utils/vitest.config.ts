import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '@playground/vitest-config/base'

export default mergeConfig(baseConfig, defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
}))
