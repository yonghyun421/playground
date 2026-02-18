import { describe, it, expect } from 'vitest'
import { formatRecordDate } from '../record-candy/formatDate'

describe('formatRecordDate', () => {
  it('ISO 문자열을 YYYY.MM.DD 형식으로 변환해야 한다', () => {
    const result = formatRecordDate('2026-02-17T12:00:00Z')
    expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2}$/)
  })

  it('Date 객체를 YYYY.MM.DD 형식으로 변환해야 한다', () => {
    const date = new Date('2026-02-17T12:00:00Z')
    const result = formatRecordDate(date)
    expect(result).toMatch(/^\d{4}\.\d{2}\.\d{2}$/)
  })

  it('월과 일을 두 자리로 패딩해야 한다', () => {
    const result = formatRecordDate('2026-01-05T12:00:00Z')
    // 월과 일이 모두 0으로 패딩된 두 자리
    const parts = result.split('.')
    expect(parts[1]).toHaveLength(2)
    expect(parts[2]).toHaveLength(2)
  })

  it('구분자로 점(.)을 사용해야 한다', () => {
    const result = formatRecordDate('2026-02-17T12:00:00Z')
    expect(result).toContain('.')
    expect(result.split('.').length).toBe(3)
  })

  it('2024년 윤년 날짜를 올바르게 처리해야 한다', () => {
    const result = formatRecordDate('2024-02-29T12:00:00Z')
    expect(result).toMatch(/^2024\.02\.29$/)
  })
})
