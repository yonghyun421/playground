import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { RecordCard } from '../../components/record-candy/record-card'

// framer-motion 모킹 (테스트 환경에서 애니메이션 제거)
vi.mock('framer-motion', () => ({
  motion: {
    article: ({
      children,
      onClick,
      onKeyDown,
      // framer-motion 전용 props를 제거하여 DOM 경고 방지
      whileHover: _whileHover,
      transition: _transition,
      ...props
    }: React.HTMLAttributes<HTMLElement> & {
      children?: React.ReactNode
      whileHover?: unknown
      transition?: unknown
    }) => (
      <article onClick={onClick} onKeyDown={onKeyDown} {...props}>
        {children}
      </article>
    ),
  },
}))

const defaultProps = {
  id: 'test-1',
  title: '인터스텔라',
  imageUrl: 'https://example.com/poster.jpg',
  workType: 'movie' as const,
  rating: 9,
  emotionTags: ['moved', 'inspired'],
  reviewDate: '2026-01-15',
}

describe('RecordCard', () => {
  it('기본 props로 렌더링된다', () => {
    render(<RecordCard {...defaultProps} />)
    expect(screen.getByText('인터스텔라')).toBeInTheDocument()
  })

  it('작품 타입 배지가 표시된다 (영화)', () => {
    render(<RecordCard {...defaultProps} workType="movie" />)
    expect(screen.getByText('영화')).toBeInTheDocument()
  })

  it('작품 타입 배지가 표시된다 (도서)', () => {
    render(<RecordCard {...defaultProps} workType="book" />)
    expect(screen.getByText('도서')).toBeInTheDocument()
  })

  it('포스터 이미지가 렌더링된다', () => {
    render(<RecordCard {...defaultProps} />)
    const img = screen.getByAltText('인터스텔라 포스터')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/poster.jpg')
  })

  it('감상 날짜가 표시된다', () => {
    render(<RecordCard {...defaultProps} />)
    expect(screen.getByText('2026-01-15')).toBeInTheDocument()
  })

  it('한줄 감상이 있으면 표시된다', () => {
    render(<RecordCard {...defaultProps} oneLineReview="우주의 신비를 느꼈다" />)
    expect(screen.getByText('우주의 신비를 느꼈다')).toBeInTheDocument()
  })

  it('한줄 감상이 없으면 표시되지 않는다', () => {
    render(<RecordCard {...defaultProps} oneLineReview={undefined} />)
    expect(screen.queryByText('우주의 신비를 느꼈다')).not.toBeInTheDocument()
  })

  it('감정 태그가 최대 3개까지 표시된다', () => {
    render(
      <RecordCard
        {...defaultProps}
        emotionTags={['happy', 'sad', 'inspired', 'thrilled', 'peaceful']}
      />
    )
    // 3개의 감정 태그 확인 (나머지는 +n으로 표시)
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('감정 태그가 3개 이하이면 +n 뱃지가 없다', () => {
    render(<RecordCard {...defaultProps} emotionTags={['happy', 'sad']} />)
    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument()
  })

  it('onClick 핸들러가 있으면 클릭 시 호출된다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<RecordCard {...defaultProps} onClick={handleClick} />)
    // aria-label로 카드 article 특정 (내부 버튼들과 구분)
    const card = screen.getByLabelText('인터스텔라 감상 기록')
    await user.click(card)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('data-testid 속성이 올바르게 설정된다', () => {
    render(<RecordCard {...defaultProps} />)
    expect(screen.getByTestId('record-card-test-1')).toBeInTheDocument()
  })

  it('접근성 aria-label이 올바르게 설정된다', () => {
    render(<RecordCard {...defaultProps} onClick={vi.fn()} />)
    expect(screen.getByLabelText('인터스텔라 감상 기록')).toBeInTheDocument()
  })
})
