import { describe, it, expect } from 'vitest'
import { createPaginationSchema, createIdSchema } from '../validation'

describe('createPaginationSchema', () => {
  const schema = createPaginationSchema()

  it('should use default values when not provided', () => {
    const result = schema.parse({})
    expect(result).toEqual({ page: 1, limit: 20 })
  })

  it('should parse valid pagination values', () => {
    const result = schema.parse({ page: 5, limit: 50 })
    expect(result).toEqual({ page: 5, limit: 50 })
  })

  it('should coerce string numbers to numbers', () => {
    const result = schema.parse({ page: '3', limit: '30' })
    expect(result).toEqual({ page: 3, limit: 30 })
  })

  it('should reject page less than 1', () => {
    expect(() => schema.parse({ page: 0 })).toThrow()
    expect(() => schema.parse({ page: -1 })).toThrow()
  })

  it('should reject limit less than 1', () => {
    expect(() => schema.parse({ limit: 0 })).toThrow()
    expect(() => schema.parse({ limit: -1 })).toThrow()
  })

  it('should reject limit greater than 100', () => {
    expect(() => schema.parse({ limit: 101 })).toThrow()
    expect(() => schema.parse({ limit: 200 })).toThrow()
  })

  it('should reject non-integer page values', () => {
    expect(() => schema.parse({ page: 1.5 })).toThrow()
  })

  it('should reject non-integer limit values', () => {
    expect(() => schema.parse({ limit: 20.5 })).toThrow()
  })

  it('should handle edge case of limit = 100', () => {
    const result = schema.parse({ limit: 100 })
    expect(result.limit).toBe(100)
  })

  it('should handle edge case of page = 1', () => {
    const result = schema.parse({ page: 1 })
    expect(result.page).toBe(1)
  })
})

describe('createIdSchema', () => {
  const schema = createIdSchema()

  it('should accept valid string ids', () => {
    const result = schema.parse('abc123')
    expect(result).toBe('abc123')
  })

  it('should accept single character ids', () => {
    const result = schema.parse('a')
    expect(result).toBe('a')
  })

  it('should reject empty strings', () => {
    expect(() => schema.parse('')).toThrow()
  })

  it('should reject non-string values', () => {
    expect(() => schema.parse(123)).toThrow()
    expect(() => schema.parse(null)).toThrow()
    expect(() => schema.parse(undefined)).toThrow()
  })

  it('should accept ids with special characters', () => {
    const result = schema.parse('abc-123_def')
    expect(result).toBe('abc-123_def')
  })

  it('should accept uuid format', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000'
    const result = schema.parse(uuid)
    expect(result).toBe(uuid)
  })
})
