import { describe, it, expect } from 'vitest'
import { filterRecords } from '../record-candy/filterRecords'
import type { Record } from '../types/record-candy'

/** 테스트용 영화 기록 생성 헬퍼 */
const makeMovieRecord = (overrides: Partial<Record> = {}): Record => ({
  id: 'test-id-1',
  workType: 'movie',
  work: {
    id: 'movie-1',
    title: '기생충',
    posterUrl: 'https://example.com/poster.jpg',
    year: 2019,
    director: '봉준호',
    genres: ['드라마', '스릴러'],
  },
  rating: 9,
  reviewDate: '2026-01-15',
  oneLineReview: '명작',
  emotionTags: ['moved', 'thrilled'],
  rewatchIntent: true,
  createdAt: '2026-01-15T12:00:00Z',
  updatedAt: '2026-01-15T12:00:00Z',
  ...overrides,
})

/** 테스트용 책 기록 생성 헬퍼 */
const makeBookRecord = (overrides: Partial<Record> = {}): Record => ({
  id: 'test-id-2',
  workType: 'book',
  work: {
    id: 'book-1',
    title: '채식주의자',
    coverUrl: 'https://example.com/cover.jpg',
    year: 2007,
    author: '한강',
    genres: ['소설'],
  },
  rating: 8,
  reviewDate: '2026-02-01',
  emotionTags: ['sad', 'moved'],
  rewatchIntent: false,
  createdAt: '2026-02-01T12:00:00Z',
  updatedAt: '2026-02-01T12:00:00Z',
  ...overrides,
})

describe('filterRecords', () => {
  const movieRecord = makeMovieRecord()
  const bookRecord = makeBookRecord()
  const records = [movieRecord, bookRecord]

  it('빈 필터로 전체 기록을 반환해야 한다', () => {
    const result = filterRecords(records, {})
    expect(result).toHaveLength(2)
  })

  it('workType 필터로 영화만 반환해야 한다', () => {
    const result = filterRecords(records, { workType: 'movie' })
    expect(result).toHaveLength(1)
    expect(result[0]!.workType).toBe('movie')
  })

  it('workType 필터로 책만 반환해야 한다', () => {
    const result = filterRecords(records, { workType: 'book' })
    expect(result).toHaveLength(1)
    expect(result[0]!.workType).toBe('book')
  })

  it('ratingMin 필터로 최소 평점 이상만 반환해야 한다', () => {
    const result = filterRecords(records, { ratingMin: 9 })
    expect(result).toHaveLength(1)
    expect(result[0]!.rating).toBeGreaterThanOrEqual(9)
  })

  it('ratingMax 필터로 최대 평점 이하만 반환해야 한다', () => {
    const result = filterRecords(records, { ratingMax: 8 })
    expect(result).toHaveLength(1)
    expect(result[0]!.rating).toBeLessThanOrEqual(8)
  })

  it('ratingMin과 ratingMax 범위 필터를 동시에 적용해야 한다', () => {
    const result = filterRecords(records, { ratingMin: 8, ratingMax: 9 })
    expect(result).toHaveLength(2)
  })

  it('year 필터로 특정 작품 연도만 반환해야 한다', () => {
    const result = filterRecords(records, { year: 2019 })
    expect(result).toHaveLength(1)
    expect(result[0]!.work.year).toBe(2019)
  })

  it('emotionTags 필터로 해당 감정 태그를 포함한 기록만 반환해야 한다', () => {
    const result = filterRecords(records, { emotionTags: ['thrilled'] })
    expect(result).toHaveLength(1)
    expect(result[0]!.emotionTags).toContain('thrilled')
  })

  it('emotionTags 필터에서 여러 태그 중 하나라도 일치하면 반환해야 한다', () => {
    // 'moved'는 영화와 책 모두에 있음
    const result = filterRecords(records, { emotionTags: ['moved'] })
    expect(result).toHaveLength(2)
  })

  it('빈 emotionTags 배열은 필터를 적용하지 않아야 한다', () => {
    const result = filterRecords(records, { emotionTags: [] })
    expect(result).toHaveLength(2)
  })

  it('복합 필터를 올바르게 적용해야 한다', () => {
    const result = filterRecords(records, {
      workType: 'movie',
      ratingMin: 9,
      emotionTags: ['moved'],
    })
    expect(result).toHaveLength(1)
    expect(result[0]!.workType).toBe('movie')
  })

  it('원본 배열을 변경하지 않아야 한다 (불변성)', () => {
    const original = [...records]
    filterRecords(records, { workType: 'movie' })
    expect(records).toEqual(original)
  })
})
