import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { BookStackCard } from '../../components/record-candy/book-stack-card'

// framer-motion 모킹 (테스트 환경에서 애니메이션 제거)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      whileHover: _whileHover,
      initial: _initial,
      variants: _variants,
      transition: _transition,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode
      whileHover?: unknown
      initial?: unknown
      variants?: unknown
      transition?: unknown
    }) => <div {...props}>{children}</div>,

    article: ({
      children,
      onClick,
      onKeyDown,
      whileHover: _whileHover,
      initial: _initial,
      variants: _variants,
      transition: _transition,
      ...props
    }: React.HTMLAttributes<HTMLElement> & {
      children?: React.ReactNode
      whileHover?: unknown
      initial?: unknown
      variants?: unknown
      transition?: unknown
    }) => (
      <article onClick={onClick} onKeyDown={onKeyDown} {...props}>
        {children}
      </article>
    ),
  },
}))

const defaultProps = {
  id: 'book-1',
  title: '채식주의자',
  coverUrl: 'https://example.com/cover.jpg',
  author: '한강',
  year: 2007,
  rating: 9,
  emotionTags: ['moved', 'peaceful'],
  reviewDate: '2026-01-20',
}

describe('BookStackCard', () => {
  it('기본 props로 렌더링된다', () => {
    render(<BookStackCard {...defaultProps} />)
    expect(screen.getByText('채식주의자')).toBeInTheDocument()
  })

  it('저자와 연도가 표시된다', () => {
    render(<BookStackCard {...defaultProps} />)
    expect(screen.getByText('한강 · 2007')).toBeInTheDocument()
  })

  it('커버 이미지가 렌더링된다', () => {
    render(<BookStackCard {...defaultProps} />)
    const img = screen.getByAltText('채식주의자 커버')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/cover.jpg')
  })

  it('커버 이미지가 없으면 placeholder가 표시된다', () => {
    render(<BookStackCard {...defaultProps} coverUrl="" />)
    expect(screen.getByText('📚')).toBeInTheDocument()
  })

  it('감상 날짜가 time 엘리먼트로 표시된다', () => {
    render(<BookStackCard {...defaultProps} />)
    const time = screen.getByText(/2026-01-20/)
    expect(time).toBeInTheDocument()
    expect(time.tagName.toLowerCase()).toBe('time')
  })

  it('감상 날짜의 dateTime 속성이 올바르게 설정된다', () => {
    render(<BookStackCard {...defaultProps} />)
    const time = screen.getByText(/2026-01-20/)
    expect(time).toHaveAttribute('dateTime', '2026-01-20')
  })

  it('한줄 감상이 있으면 표시된다', () => {
    render(<BookStackCard {...defaultProps} oneLineReview="삶의 무게를 느꼈다" />)
    expect(screen.getByText(/삶의 무게를 느꼈다/)).toBeInTheDocument()
  })

  it('한줄 감상이 없으면 표시되지 않는다', () => {
    render(<BookStackCard {...defaultProps} oneLineReview={undefined} />)
    expect(screen.queryByText(/삶의 무게를 느꼈다/)).not.toBeInTheDocument()
  })

  it('감정 태그가 최대 2개까지 표시된다', () => {
    render(
      <BookStackCard
        {...defaultProps}
        emotionTags={['happy', 'sad', 'inspired', 'thrilled']}
      />
    )
    // 2개 이후는 +n 뱃지로 표시
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('감정 태그가 2개 이하이면 +n 뱃지가 없다', () => {
    render(<BookStackCard {...defaultProps} emotionTags={['happy']} />)
    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument()
  })

  it('감정 태그가 없으면 태그 영역이 렌더링되지 않는다', () => {
    render(<BookStackCard {...defaultProps} emotionTags={[]} />)
    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument()
  })

  it('onClick 핸들러가 있으면 클릭 시 호출된다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<BookStackCard {...defaultProps} onClick={handleClick} />)
    const card = screen.getByLabelText('채식주의자 책 기록')
    await user.click(card)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('onClick 핸들러가 없으면 role이 article이다', () => {
    render(<BookStackCard {...defaultProps} />)
    const card = screen.getByRole('article', { name: '채식주의자 책 기록' })
    expect(card).toBeInTheDocument()
  })

  it('onClick 핸들러가 있으면 role이 button이다', () => {
    render(<BookStackCard {...defaultProps} onClick={vi.fn()} />)
    const card = screen.getByRole('button', { name: '채식주의자 책 기록' })
    expect(card).toBeInTheDocument()
  })

  it('data-testid 속성이 올바르게 설정된다', () => {
    render(<BookStackCard {...defaultProps} />)
    expect(screen.getByTestId('book-stack-card-book-1')).toBeInTheDocument()
  })

  it('접근성 aria-label이 올바르게 설정된다', () => {
    render(<BookStackCard {...defaultProps} onClick={vi.fn()} />)
    expect(screen.getByLabelText('채식주의자 책 기록')).toBeInTheDocument()
  })

  it('Enter 키로 onClick 핸들러가 호출된다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<BookStackCard {...defaultProps} onClick={handleClick} />)
    const card = screen.getByLabelText('채식주의자 책 기록')
    card.focus()
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('평점 컴포넌트가 렌더링된다', () => {
    render(<BookStackCard {...defaultProps} />)
    // RatingDisplay는 role="img"로 렌더링됨
    expect(screen.getByRole('img', { name: /평점 9점/ })).toBeInTheDocument()
  })
})
