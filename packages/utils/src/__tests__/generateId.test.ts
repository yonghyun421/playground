import { describe, it, expect } from 'vitest'
import { generateId } from '../record-candy/generateId'

describe('generateId', () => {
  it('문자열을 반환해야 한다', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
  })

  it('빈 문자열이 아닌 ID를 생성해야 한다', () => {
    const id = generateId()
    expect(id.length).toBeGreaterThan(0)
  })

  it('호출마다 고유한 ID를 생성해야 한다', () => {
    const ids = Array.from({ length: 100 }, () => generateId())
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(100)
  })

  it('URL 안전 문자만 포함해야 한다', () => {
    const id = generateId()
    // nanoid 기본값: A-Za-z0-9_- 문자 사용
    expect(id).toMatch(/^[A-Za-z0-9_-]+$/)
  })
})
