import { describe, it, expect } from 'vitest'
import { sortRecords } from '../record-candy/sortRecords'
import type { Record } from '../types/record-candy'

/** 테스트용 기록 생성 헬퍼 */
const makeRecord = (id: string, rating: number, createdAt: string): Record => ({
  id,
  workType: 'movie',
  work: {
    id,
    title: `영화 ${id}`,
    posterUrl: 'https://example.com/poster.jpg',
    year: 2020,
    director: '감독',
    genres: ['드라마'],
  },
  rating,
  reviewDate: '2026-01-01',
  emotionTags: ['happy'],
  rewatchIntent: false,
  createdAt,
  updatedAt: createdAt,
})

describe('sortRecords', () => {
  const older = makeRecord('a', 7, '2026-01-01T00:00:00Z')
  const middle = makeRecord('b', 9, '2026-01-15T00:00:00Z')
  const newer = makeRecord('c', 5, '2026-02-01T00:00:00Z')
  const records = [middle, older, newer]

  it("'newest' 정렬: 최신 생성 순으로 반환해야 한다", () => {
    const result = sortRecords(records, 'newest')
    expect(result[0]!.id).toBe('c') // 2026-02-01
    expect(result[1]!.id).toBe('b') // 2026-01-15
    expect(result[2]!.id).toBe('a') // 2026-01-01
  })

  it("'oldest' 정렬: 오래된 생성 순으로 반환해야 한다", () => {
    const result = sortRecords(records, 'oldest')
    expect(result[0]!.id).toBe('a') // 2026-01-01
    expect(result[1]!.id).toBe('b') // 2026-01-15
    expect(result[2]!.id).toBe('c') // 2026-02-01
  })

  it("'rating-high' 정렬: 평점 높은 순으로 반환해야 한다", () => {
    const result = sortRecords(records, 'rating-high')
    expect(result[0]!.rating).toBe(9) // b
    expect(result[1]!.rating).toBe(7) // a
    expect(result[2]!.rating).toBe(5) // c
  })

  it("'rating-low' 정렬: 평점 낮은 순으로 반환해야 한다", () => {
    const result = sortRecords(records, 'rating-low')
    expect(result[0]!.rating).toBe(5) // c
    expect(result[1]!.rating).toBe(7) // a
    expect(result[2]!.rating).toBe(9) // b
  })

  it('동점인 경우 최신 생성 순으로 2차 정렬해야 한다', () => {
    const tie1 = makeRecord('x', 8, '2026-01-01T00:00:00Z')
    const tie2 = makeRecord('y', 8, '2026-02-01T00:00:00Z')
    const result = sortRecords([tie1, tie2], 'rating-high')
    // 동점이면 최신(y)이 먼저
    expect(result[0]!.id).toBe('y')
    expect(result[1]!.id).toBe('x')
  })

  it('원본 배열을 변경하지 않아야 한다 (불변성)', () => {
    const original = [middle, older, newer]
    const originalIds = original.map((r) => r.id)
    sortRecords(original, 'newest')
    expect(original.map((r) => r.id)).toEqual(originalIds)
  })

  it('빈 배열을 입력하면 빈 배열을 반환해야 한다', () => {
    expect(sortRecords([], 'newest')).toEqual([])
  })

  it('단일 요소 배열을 그대로 반환해야 한다', () => {
    const result = sortRecords([older], 'newest')
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('a')
  })
})
