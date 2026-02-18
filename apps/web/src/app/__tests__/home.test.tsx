// 홈 페이지 단위/통합 테스트
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// next/navigation 모킹
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  useParams: () => ({}),
}))

// Zustand 스토어 모킹 (unknown[] 타입으로 명시해 never[] 타입 오류 방지)
const mockRecords = vi.fn<() => unknown[]>(() => [])
vi.mock('@/lib/store/record-store', () => ({
  useRecordStore: (selector: (state: { records: unknown[] }) => unknown) =>
    selector({ records: mockRecords() }),
}))

// @playground/ui 모킹 (framer-motion 의존성 제거, 새 카드 컴포넌트 포함)
vi.mock('@playground/ui', () => ({
  MovieTicketCard: ({ title, onClick }: { title: string; onClick?: () => void }) => (
    <div data-testid="movie-ticket-card" onClick={onClick} role="button">
      {title}
    </div>
  ),
  BookStackCard: ({ title, onClick }: { title: string; onClick?: () => void }) => (
    <div data-testid="book-stack-card" onClick={onClick} role="button">
      {title}
    </div>
  ),
  EmptyState: ({
    message,
    actionLabel,
    onAction,
  }: {
    message: string
    actionLabel?: string
    onAction?: () => void
  }) => (
    <div data-testid="empty-state">
      <p>{message}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  ),
}))

// @playground/utils 모킹
vi.mock('@playground/utils', () => ({
  formatRecordDate: (date: string) => date,
}))

import HomePage from '../page'

/** 테스트용 영화 기록 생성 */
function makeMovieRecord(id: string, rating: number) {
  return {
    id,
    work: {
      id: `work-${id}`,
      title: `영화 ${id}`,
      posterUrl: 'https://example.com/poster.jpg',
      year: 2024,
      director: '홍길동',
      genres: ['드라마'],
    },
    workType: 'movie' as const,
    rating,
    reviewDate: '2024-01-01T00:00:00.000Z',
    emotionTags: [] as string[],
    rewatchIntent: false,
    createdAt: new Date(Date.now() - Number(id) * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/** 테스트용 도서 기록 생성 */
function makeBookRecord(id: string, rating: number) {
  return {
    id,
    work: {
      id: `work-${id}`,
      title: `책 ${id}`,
      coverUrl: 'https://example.com/cover.jpg',
      year: 2024,
      author: '홍길동',
      genres: ['소설'],
    },
    workType: 'book' as const,
    rating,
    reviewDate: '2024-01-01T00:00:00.000Z',
    emotionTags: [] as string[],
    rewatchIntent: false,
    createdAt: new Date(Date.now() - Number(id) * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('히어로 섹션', () => {
    it('Record Candy 타이틀이 렌더링된다', () => {
      mockRecords.mockReturnValue([])
      render(<HomePage />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Record Candy')
    })

    it('서브텍스트가 표시된다', () => {
      mockRecords.mockReturnValue([])
      render(<HomePage />)
      expect(screen.getByText('영화와 책의 달콤한 기록')).toBeInTheDocument()
    })
  })

  describe('통계 카드', () => {
    it('기록이 없을 때 0으로 표시된다', () => {
      mockRecords.mockReturnValue([])
      render(<HomePage />)
      // 총 기록, 영화, 도서 모두 0
      const zeros = screen.getAllByText('0')
      expect(zeros.length).toBeGreaterThanOrEqual(3)
    })

    it('기록이 있을 때 올바른 통계를 표시한다', () => {
      mockRecords.mockReturnValue([
        makeMovieRecord('1', 8),
        makeMovieRecord('2', 6),
      ])
      render(<HomePage />)

      // 총 기록 2개 (여러 개의 '2'가 있을 수 있으므로 getAllByText 사용)
      const twos = screen.getAllByText('2')
      expect(twos.length).toBeGreaterThanOrEqual(2)
    })

    it('평균 평점이 올바르게 계산된다', () => {
      mockRecords.mockReturnValue([
        makeMovieRecord('1', 8),
        makeMovieRecord('2', 6),
      ])
      render(<HomePage />)
      // 평균 7.0
      expect(screen.getByText('7.0')).toBeInTheDocument()
    })
  })

  describe('빈 상태', () => {
    it('기록이 없을 때 EmptyState가 표시된다', () => {
      mockRecords.mockReturnValue([])
      render(<HomePage />)
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })

    it('빈 상태에서 "검색하러 가기" CTA가 표시된다', () => {
      mockRecords.mockReturnValue([])
      render(<HomePage />)
      expect(screen.getByText('검색하러 가기')).toBeInTheDocument()
    })
  })

  describe('최근 영화 섹션', () => {
    it('영화 기록이 있을 때 MovieTicketCard가 렌더링된다', () => {
      mockRecords.mockReturnValue([makeMovieRecord('1', 8)])
      render(<HomePage />)
      expect(screen.getByTestId('movie-ticket-card')).toBeInTheDocument()
    })

    it('영화는 최대 3개까지만 표시된다', () => {
      // 4개 영화 기록 생성
      const records = Array.from({ length: 4 }, (_, i) =>
        makeMovieRecord(String(i + 1), 7)
      )
      mockRecords.mockReturnValue(records)
      render(<HomePage />)
      const cards = screen.getAllByTestId('movie-ticket-card')
      expect(cards).toHaveLength(3)
    })

    it('전체 보기 버튼이 영화 기록이 있을 때 표시된다', () => {
      mockRecords.mockReturnValue([makeMovieRecord('1', 8)])
      render(<HomePage />)
      expect(screen.getByText('전체 보기 →')).toBeInTheDocument()
    })
  })

  describe('최근 도서 섹션', () => {
    it('도서 기록이 있을 때 BookStackCard가 렌더링된다', () => {
      mockRecords.mockReturnValue([makeBookRecord('1', 8)])
      render(<HomePage />)
      expect(screen.getByTestId('book-stack-card')).toBeInTheDocument()
    })

    it('도서는 최대 5개까지만 표시된다', () => {
      // 6개 도서 기록 생성
      const records = Array.from({ length: 6 }, (_, i) =>
        makeBookRecord(String(i + 1), 7)
      )
      mockRecords.mockReturnValue(records)
      render(<HomePage />)
      const cards = screen.getAllByTestId('book-stack-card')
      expect(cards).toHaveLength(5)
    })
  })

  describe('기록이 없을 때', () => {
    it('전체 보기 버튼이 없다', () => {
      mockRecords.mockReturnValue([])
      render(<HomePage />)
      expect(screen.queryByText('전체 보기 →')).not.toBeInTheDocument()
    })
  })
})
