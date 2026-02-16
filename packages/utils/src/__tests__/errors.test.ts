import { describe, it, expect } from 'vitest'
import { AppError, ValidationError, NotFoundError } from '../errors'

describe('AppError', () => {
  it('should create error with message and statusCode', () => {
    const error = new AppError('Test error', 500)
    expect(error.message).toBe('Test error')
    expect(error.statusCode).toBe(500)
    expect(error.isOperational).toBe(true)
  })

  it('should set isOperational to false when specified', () => {
    const error = new AppError('Test error', 500, false)
    expect(error.isOperational).toBe(false)
  })

  it('should have correct name', () => {
    const error = new AppError('Test error', 500)
    expect(error.name).toBe('AppError')
  })

  it('should be instance of Error', () => {
    const error = new AppError('Test error', 500)
    expect(error).toBeInstanceOf(Error)
  })

  it('should have stack trace', () => {
    const error = new AppError('Test error', 500)
    expect(error.stack).toBeDefined()
  })

  it('should handle different status codes', () => {
    const error400 = new AppError('Bad request', 400)
    const error404 = new AppError('Not found', 404)
    const error500 = new AppError('Server error', 500)

    expect(error400.statusCode).toBe(400)
    expect(error404.statusCode).toBe(404)
    expect(error500.statusCode).toBe(500)
  })
})

describe('ValidationError', () => {
  it('should create error with statusCode 400', () => {
    const error = new ValidationError('Invalid input')
    expect(error.message).toBe('Invalid input')
    expect(error.statusCode).toBe(400)
    expect(error.isOperational).toBe(true)
  })

  it('should have correct name', () => {
    const error = new ValidationError('Invalid input')
    expect(error.name).toBe('ValidationError')
  })

  it('should be instance of AppError', () => {
    const error = new ValidationError('Invalid input')
    expect(error).toBeInstanceOf(AppError)
  })

  it('should be instance of Error', () => {
    const error = new ValidationError('Invalid input')
    expect(error).toBeInstanceOf(Error)
  })

  it('should handle different validation messages', () => {
    const error1 = new ValidationError('Email is required')
    const error2 = new ValidationError('Invalid format')

    expect(error1.message).toBe('Email is required')
    expect(error2.message).toBe('Invalid format')
    expect(error1.statusCode).toBe(400)
    expect(error2.statusCode).toBe(400)
  })
})

describe('NotFoundError', () => {
  it('should create error with statusCode 404', () => {
    const error = new NotFoundError('Resource not found')
    expect(error.message).toBe('Resource not found')
    expect(error.statusCode).toBe(404)
    expect(error.isOperational).toBe(true)
  })

  it('should have correct name', () => {
    const error = new NotFoundError('Resource not found')
    expect(error.name).toBe('NotFoundError')
  })

  it('should be instance of AppError', () => {
    const error = new NotFoundError('Resource not found')
    expect(error).toBeInstanceOf(AppError)
  })

  it('should be instance of Error', () => {
    const error = new NotFoundError('Resource not found')
    expect(error).toBeInstanceOf(Error)
  })

  it('should handle different not found messages', () => {
    const error1 = new NotFoundError('User not found')
    const error2 = new NotFoundError('Page not found')

    expect(error1.message).toBe('User not found')
    expect(error2.message).toBe('Page not found')
    expect(error1.statusCode).toBe(404)
    expect(error2.statusCode).toBe(404)
  })
})
