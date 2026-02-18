// RecordFormModal 유효성 검증 및 제출 테스트
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// next/navigation 모킹
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
}))

// Zustand 스토어 모킹
const mockAddRecord = vi.fn()
const mockUpdateRecord = vi.fn()
vi.mock('@/lib/store/record-store', () => ({
  useRecordStore: () => ({
    addRecord: mockAddRecord,
    updateRecord: mockUpdateRecord,
  }),
}))

// generateId 모킹
vi.mock('@playground/utils', () => ({
  generateId: () => 'test-id-123',
  formatRecordDate: (date: string) => date,
}))

// @playground/ui EmotionTag 모킹
vi.mock('@playground/ui', () => ({
  EmotionTag: ({
    emotion,
    onClick,
    selected,
  }: {
    emotion: string
    onClick?: () => void
    selected?: boolean
  }) => (
    <button
      type="button"
      data-testid={`emotion-tag-${emotion}`}
      data-selected={selected}
      onClick={onClick}
    >
      {emotion}
    </button>
  ),
}))

// shadcn/ui 컴포넌트 모킹
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock('@/components/ui/slider', () => ({
  Slider: ({
    onValueChange,
    value,
  }: {
    onValueChange: (vals: number[]) => void
    value: number[]
  }) => (
    <input
      data-testid="rating-slider"
      type="range"
      min={1}
      max={10}
      value={value?.[0] ?? 5}
      onChange={(e) => onValueChange([Number(e.target.value)])}
    />
  ),
}))

vi.mock('@/components/ui/textarea', () => ({
  Textarea: ({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea data-testid="one-line-review" {...props} />
  ),
}))

vi.mock('@/components/ui/toggle', () => ({
  Toggle: ({
    pressed,
    onPressedChange,
    children,
  }: {
    pressed: boolean
    onPressedChange: (p: boolean) => void
    children: React.ReactNode
  }) => (
    <button
      data-testid="rewatch-toggle"
      data-pressed={pressed}
      type="button"
      onClick={() => onPressedChange(!pressed)}
    >
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/calendar', () => ({
  Calendar: ({
    onSelect,
  }: {
    onSelect: (date: Date | undefined) => void
  }) => (
    <button
      data-testid="calendar"
      type="button"
      onClick={() => onSelect(new Date('2024-03-15'))}
    >
      날짜 선택
    </button>
  ),
}))

vi.mock('@/components/ui/popover', () => ({
  Popover: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode
    open: boolean
    onOpenChange: (o: boolean) => void
  }) => (
    <div data-testid="popover" data-open={open} onClick={() => onOpenChange(!open)}>
      {children}
    </div>
  ),
  PopoverTrigger: ({ children, asChild: _asChild }: { children: React.ReactNode; asChild?: boolean }) => (
    <div data-testid="popover-trigger">{children}</div>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-content">{children}</div>
  ),
}))

import { RecordFormModal } from '../record-form-modal'
import type { Movie } from '@playground/utils'

/** 테스트용 영화 작품 */
const testMovie: Movie = {
  id: 'movie-1',
  title: '인터스텔라',
  posterUrl: 'https://example.com/poster.jpg',
  year: 2014,
  director: '크리스토퍼 놀란',
  genres: ['SF', '드라마'],
}

describe('RecordFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('렌더링', () => {
    it('open=true 일 때 모달이 표시된다', () => {
      render(
        <RecordFormModal
          open
          onOpenChange={vi.fn()}
          work={testMovie}
          workType="movie"
        />
      )
      expect(screen.getByTestId('dialog')).toBeInTheDocument()
    })

    it('open=false 일 때 모달이 숨겨진다', () => {
      render(
        <RecordFormModal
          open={false}
          onOpenChange={vi.fn()}
          work={testMovie}
          workType="movie"
        />
      )
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
    })

    it('작성 모드 타이틀이 표시된다', () => {
      render(
        <RecordFormModal
          open
          onOpenChange={vi.fn()}
          work={testMovie}
          workType="movie"
        />
      )
      expect(screen.getByText('감상 기록 남기기')).toBeInTheDocument()
    })

    it('수정 모드 타이틀이 표시된다', () => {
      const existingRecord = {
        id: 'record-1',
        work: testMovie,
        workType: 'movie' as const,
        rating: 8,
        reviewDate: '2024-01-01T00:00:00.000Z',
        emotionTags: [] as [],
        rewatchIntent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      render(
        <RecordFormModal
          open
          onOpenChange={vi.fn()}
          work={testMovie}
          workType="movie"
          existingRecord={existingRecord}
        />
      )
      expect(screen.getByText('기록 수정')).toBeInTheDocument()
    })

    it('8개 감정 태그가 모두 표시된다', () => {
      render(
        <RecordFormModal
          open
          onOpenChange={vi.fn()}
          work={testMovie}
          workType="movie"
        />
      )
      const emotions = ['happy', 'sad', 'inspired', 'thrilled', 'peaceful', 'nostalgic', 'moved', 'funny']
      emotions.forEach((emotion) => {
        expect(screen.getByTestId(`emotion-tag-${emotion}`)).toBeInTheDocument()
      })
    })
  })

  describe('감정 태그 선택', () => {
    it('감정 태그를 클릭하면 selected 상태가 변경된다', async () => {
      const user = userEvent.setup()
      render(
        <RecordFormModal
          open
          onOpenChange={vi.fn()}
          work={testMovie}
          workType="movie"
        />
      )

      const happyTag = screen.getByTestId('emotion-tag-happy')
      // 초기에는 선택되지 않음
      expect(happyTag).toHaveAttribute('data-selected', 'false')

      await user.click(happyTag)
      // 클릭 후 selected
      expect(happyTag).toHaveAttribute('data-selected', 'true')
    })

    it('선택된 감정 태그를 다시 클릭하면 해제된다', async () => {
      const user = userEvent.setup()
      render(
        <RecordFormModal
          open
          onOpenChange={vi.fn()}
          work={testMovie}
          workType="movie"
        />
      )

      const happyTag = screen.getByTestId('emotion-tag-happy')
      await user.click(happyTag) // 선택
      await user.click(happyTag) // 해제

      expect(happyTag).toHaveAttribute('data-selected', 'false')
    })
  })

  describe('재감상 토글', () => {
    it('토글 버튼이 렌더링된다', () => {
      render(
        <RecordFormModal
          open
          onOpenChange={vi.fn()}
          work={testMovie}
          workType="movie"
        />
      )
      expect(screen.getByTestId('rewatch-toggle')).toBeInTheDocument()
    })

    it('토글 클릭 시 상태가 변경된다', async () => {
      const user = userEvent.setup()
      render(
        <RecordFormModal
          open
          onOpenChange={vi.fn()}
          work={testMovie}
          workType="movie"
        />
      )

      const toggle = screen.getByTestId('rewatch-toggle')
      expect(toggle).toHaveAttribute('data-pressed', 'false')

      await user.click(toggle)
      expect(toggle).toHaveAttribute('data-pressed', 'true')
    })
  })

  describe('유효성 검증', () => {
    it('reviewDate 없이 제출하면 에러 메시지가 표시된다', async () => {
      const user = userEvent.setup()
      render(
        <RecordFormModal
          open
          onOpenChange={vi.fn()}
          work={testMovie}
          workType="movie"
        />
      )

      const submitButton = screen.getByText('기록 저장')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('감상 날짜를 선택해주세요')).toBeInTheDocument()
      })
    })
  })

  describe('폼 제출', () => {
    it('작성 모드에서 날짜 선택 후 제출하면 addRecord가 호출된다', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      render(
        <RecordFormModal
          open
          onOpenChange={onOpenChange}
          work={testMovie}
          workType="movie"
        />
      )

      // 날짜 선택 (캘린더 모킹 - 클릭 시 날짜 선택)
      const calendarButton = screen.getByTestId('calendar')
      await user.click(calendarButton)

      const submitButton = screen.getByText('기록 저장')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockAddRecord).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'test-id-123',
            work: testMovie,
            workType: 'movie',
          })
        )
      })
    })

    it('취소 버튼 클릭 시 onOpenChange(false)가 호출된다', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      render(
        <RecordFormModal
          open
          onOpenChange={onOpenChange}
          work={testMovie}
          workType="movie"
        />
      )

      await user.click(screen.getByText('취소'))
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
