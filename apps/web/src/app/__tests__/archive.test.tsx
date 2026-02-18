// 아카이브 페이지 필터/정렬 동작 테스트
import React from 'react'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// next/navigation 모킹
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/archive',
  useParams: () => ({}),
}))

/** 필터 스토어 상태 */
let mockFilterState = {
  filter: {} as Record<string, unknown>,
  sort: 'newest',
  setFilter: vi.fn(),
  setSort: vi.fn(),
  resetFilters: vi.fn(),
}

// 필터 스토어 모킹
vi.mock('@/lib/store/filter-store', () => ({
  useFilterStore: () => mockFilterState,
}))

// 기록 스토어 모킹 (unknown[] 타입으로 명시해 never[] 타입 오류 방지)
const mockRecords = vi.fn<() => unknown[]>(() => [])
vi.mock('@/lib/store/record-store', () => ({
  useRecordStore: (selector: (state: { records: unknown[] }) => unknown) =>
    selector({ records: mockRecords() }),
}))

// @playground/ui 모킹 (새 카드 컴포넌트 포함)
vi.mock('@playground/ui', () => ({
  MovieTicketCard: ({ title }: { title: string }) => (
    <div data-testid="movie-ticket-card">{title}</div>
  ),
  BookStackCard: ({ title }: { title: string }) => (
    <div data-testid="book-stack-card">{title}</div>
  ),
  EmptyState: ({ message }: { message: string }) => (
    <div data-testid="empty-state">{message}</div>
  ),
  FilterBar: ({
    options,
    activeValue,
    onChange,
  }: {
    options: { value: string; label: string }[]
    activeValue: string
    onChange: (v: string) => void
  }) => (
    <div data-testid="filter-bar">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          data-active={activeValue === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
  SortSelect: ({
    options,
    value,
    onChange,
  }: {
    options: { value: string; label: string }[]
    value: string
    onChange: (v: string) => void
  }) => (
    <select
      data-testid="sort-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}))

// filterRecords, sortRecords 모킹
vi.mock('@playground/utils', () => ({
  filterRecords: vi.fn((records) => records),
  sortRecords: vi.fn((records) => records),
  formatRecordDate: (date: string) => date,
}))

import ArchivePage from '../archive/page'

/** 테스트용 기록 생성 */
function makeRecord(id: string, workType: 'movie' | 'book' = 'movie') {
  return {
    id,
    work: {
      id: `work-${id}`,
      title: `작품 ${id}`,
      posterUrl: 'https://example.com/poster.jpg',
      coverUrl: 'https://example.com/cover.jpg',
      year: 2024,
      director: '감독',
      author: '저자',
      genres: [] as string[],
    },
    workType,
    rating: 7,
    reviewDate: '2024-01-01T00:00:00.000Z',
    emotionTags: [] as string[],
    rewatchIntent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

describe('ArchivePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFilterState = {
      filter: {},
      sort: 'newest',
      setFilter: vi.fn(),
      setSort: vi.fn(),
      resetFilters: vi.fn(),
    }
  })

  describe('페이지 렌더링', () => {
    it('페이지 타이틀이 표시된다', () => {
      mockRecords.mockReturnValue([])
      render(<ArchivePage />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('아카이브')
    })

    it('FilterBar가 렌더링된다', () => {
      mockRecords.mockReturnValue([])
      render(<ArchivePage />)
      expect(screen.getByTestId('filter-bar')).toBeInTheDocument()
    })

    it('SortSelect가 렌더링된다', () => {
      mockRecords.mockReturnValue([])
      render(<ArchivePage />)
      expect(screen.getByTestId('sort-select')).toBeInTheDocument()
    })
  })

  describe('빈 상태', () => {
    it('기록이 없을 때 EmptyState가 표시된다', () => {
      mockRecords.mockReturnValue([])
      render(<ArchivePage />)
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })

    it('기록 총 개수가 표시된다', () => {
      mockRecords.mockReturnValue([makeRecord('1'), makeRecord('2')])
      render(<ArchivePage />)
      expect(screen.getByText(/2개/)).toBeInTheDocument()
    })
  })

  describe('기록 목록 - 영화 필터', () => {
    it('영화 필터일 때 MovieTicketCard가 렌더링된다', () => {
      // workType: 'movie' 필터 상태
      mockFilterState = { ...mockFilterState, filter: { workType: 'movie' } }
      mockRecords.mockReturnValue([makeRecord('1', 'movie'), makeRecord('2', 'movie')])
      render(<ArchivePage />)
      const cards = screen.getAllByTestId('movie-ticket-card')
      expect(cards).toHaveLength(2)
    })
  })

  describe('기록 목록 - 도서 필터', () => {
    it('도서 필터일 때 BookStackCard가 렌더링된다', () => {
      // workType: 'book' 필터 상태
      mockFilterState = { ...mockFilterState, filter: { workType: 'book' } }
      mockRecords.mockReturnValue([makeRecord('1', 'book'), makeRecord('2', 'book')])
      render(<ArchivePage />)
      const cards = screen.getAllByTestId('book-stack-card')
      expect(cards).toHaveLength(2)
    })
  })

  describe('기록 목록 - 전체 필터', () => {
    it('전체 필터일 때 영화와 도서 섹션 헤더가 표시된다', () => {
      mockRecords.mockReturnValue([
        makeRecord('1', 'movie'),
        makeRecord('2', 'book'),
      ])
      render(<ArchivePage />)
      // 섹션 헤더 확인 (전체 필터일 때 표시)
      expect(screen.getByText('🎬 영화')).toBeInTheDocument()
      expect(screen.getByText('📚 도서')).toBeInTheDocument()
    })
  })

  describe('필터 동작', () => {
    it('전체 필터 클릭 시 workType이 제거된다', async () => {
      const user = userEvent.setup()
      mockRecords.mockReturnValue([])
      const setFilter = vi.fn()
      mockFilterState = { ...mockFilterState, setFilter }
      render(<ArchivePage />)

      const allButton = screen.getByText('전체')
      await user.click(allButton)

      expect(setFilter).toHaveBeenCalledWith(
        expect.objectContaining({ workType: undefined })
      )
    })

    it('영화 필터 클릭 시 workType이 movie로 설정된다', async () => {
      const user = userEvent.setup()
      mockRecords.mockReturnValue([])
      const setFilter = vi.fn()
      mockFilterState = { ...mockFilterState, setFilter }
      render(<ArchivePage />)

      // 영화 버튼 (라벨에 🎬 포함)
      const movieButton = screen.getByText('🎬 영화')
      await user.click(movieButton)

      expect(setFilter).toHaveBeenCalledWith(
        expect.objectContaining({ workType: 'movie' })
      )
    })
  })

  describe('정렬 동작', () => {
    it('정렬 변경 시 setSort가 호출된다', async () => {
      const user = userEvent.setup()
      mockRecords.mockReturnValue([])
      const setSort = vi.fn()
      mockFilterState = { ...mockFilterState, setSort }
      render(<ArchivePage />)

      const sortSelect = screen.getByTestId('sort-select')
      await user.selectOptions(sortSelect, 'rating-high')

      expect(setSort).toHaveBeenCalledWith('rating-high')
    })
  })
})
