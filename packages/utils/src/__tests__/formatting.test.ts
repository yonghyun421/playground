import { describe, it, expect } from 'vitest'
import { formatDate, formatCurrency, truncate, slugify } from '../formatting'

describe('formatDate', () => {
  it('should format date to YYYY-MM-DD', () => {
    const date = new Date('2026-02-16T12:00:00Z')
    const result = formatDate(date)
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('should pad single digit months and days', () => {
    const date = new Date('2026-03-05T12:00:00Z')
    const result = formatDate(date)
    expect(result).toMatch(/^\d{4}-0\d-0\d$/)
  })

  it('should handle year boundary', () => {
    const date = new Date('2026-01-01T12:00:00Z')
    const result = formatDate(date)
    expect(result).toMatch(/^2026-01-01$/)
  })

  it('should handle leap year dates', () => {
    const date = new Date('2024-02-29T12:00:00Z')
    const result = formatDate(date)
    expect(result).toMatch(/^2024-02-29$/)
  })

  it('should handle different years', () => {
    const date2020 = new Date('2020-06-15T12:00:00Z')
    const date2030 = new Date('2030-12-31T12:00:00Z')

    expect(formatDate(date2020)).toMatch(/^2020-06-15$/)
    expect(formatDate(date2030)).toMatch(/^2030-12-31$/)
  })
})

describe('formatCurrency', () => {
  it('should format USD by default', () => {
    const result = formatCurrency(1234.56)
    expect(result).toBe('$1,234.56')
  })

  it('should format with specified currency', () => {
    const result = formatCurrency(1234.56, 'EUR')
    expect(result).toContain('1,234.56')
  })

  it('should handle zero amount', () => {
    const result = formatCurrency(0)
    expect(result).toBe('$0.00')
  })

  it('should handle negative amounts', () => {
    const result = formatCurrency(-1234.56)
    expect(result).toContain('-')
    expect(result).toContain('1,234.56')
  })

  it('should handle large amounts', () => {
    const result = formatCurrency(1234567.89)
    expect(result).toBe('$1,234,567.89')
  })

  it('should handle small decimal amounts', () => {
    const result = formatCurrency(0.99)
    expect(result).toBe('$0.99')
  })

  it('should round to 2 decimal places', () => {
    const result = formatCurrency(1234.567)
    expect(result).toBe('$1,234.57')
  })
})

describe('truncate', () => {
  it('should not truncate string shorter than max length', () => {
    const result = truncate('hello', 10)
    expect(result).toBe('hello')
  })

  it('should not truncate string equal to max length', () => {
    const result = truncate('hello', 5)
    expect(result).toBe('hello')
  })

  it('should truncate string longer than max length', () => {
    const result = truncate('hello world', 8)
    expect(result).toBe('hello...')
  })

  it('should handle max length less than 3', () => {
    const result = truncate('hello', 2)
    expect(result).toBe('..')
  })

  it('should handle empty string', () => {
    const result = truncate('', 10)
    expect(result).toBe('')
  })

  it('should handle exact boundary', () => {
    const result = truncate('hello world', 11)
    expect(result).toBe('hello world')
  })

  it('should truncate long text correctly', () => {
    const longText = 'This is a very long string that needs to be truncated'
    const result = truncate(longText, 20)
    expect(result).toBe('This is a very lo...')
    expect(result.length).toBe(20)
  })
})

describe('slugify', () => {
  it('should convert to lowercase', () => {
    const result = slugify('Hello World')
    expect(result).toBe('hello-world')
  })

  it('should replace spaces with hyphens', () => {
    const result = slugify('hello world test')
    expect(result).toBe('hello-world-test')
  })

  it('should remove special characters', () => {
    const result = slugify('hello@world!test#')
    expect(result).toBe('helloworldtest')
  })

  it('should replace multiple spaces with single hyphen', () => {
    const result = slugify('hello    world')
    expect(result).toBe('hello-world')
  })

  it('should trim leading and trailing spaces', () => {
    const result = slugify('  hello world  ')
    expect(result).toBe('hello-world')
  })

  it('should remove leading and trailing hyphens', () => {
    const result = slugify('---hello-world---')
    expect(result).toBe('hello-world')
  })

  it('should replace underscores with hyphens', () => {
    const result = slugify('hello_world_test')
    expect(result).toBe('hello-world-test')
  })

  it('should handle mixed case and special chars', () => {
    const result = slugify('Hello World! How Are You?')
    expect(result).toBe('hello-world-how-are-you')
  })

  it('should handle empty string', () => {
    const result = slugify('')
    expect(result).toBe('')
  })

  it('should handle string with only special characters', () => {
    const result = slugify('@#$%^&*()')
    expect(result).toBe('')
  })

  it('should preserve allowed special characters', () => {
    const result = slugify('hello-world_test')
    expect(result).toBe('hello-world-test')
  })
})
