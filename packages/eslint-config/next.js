import base from './base.js'

export default [
  ...base,
  {
    // Next.js specific rules can be added here
    rules: {
      // Allow default exports for pages/layouts
      'import/no-default-export': 'off',
    },
  },
]
