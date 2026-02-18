import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MovieTicketCard } from '../../components/record-candy/movie-ticket-card'

// framer-motion 모킹 (테스트 환경에서 애니메이션 제거)
vi.mock('framer-motion', () => ({
  motion: {
    article: ({
      children,
      onClick,
      onKeyDown,
      // framer-motion 전용 props 제거 (DOM 경고 방지)
      whileHover: _whileHover,
      transition: _transition,
      style: _style,
      ...props
    }: React.HTMLAttributes<HTMLElement> & {
      children?: React.ReactNode
      whileHover?: unknown
      transition?: unknown
      style?: React.CSSProperties
    }) => (
      <article onClick={onClick} onKeyDown={onKeyDown} {...props}>
        {children}
      </article>
    ),
  },
}))

const defaultProps = {
  id: 'movie-1',
  title: '인터스텔라',
  posterUrl: 'https://example.com/poster.jpg',
  year: 2014,
  director: '크리스토퍼 놀란',
  rating: 9,
  emotionTags: ['moved', 'inspired'],
  reviewDate: '2024.01.15',
}

describe('MovieTicketCard', () => {
  it('기본 props로 렌더링된다', () => {
    render(<MovieTicketCard {...defaultProps} />)
    expect(screen.getByText('인터스텔라')).toBeInTheDocument()
  })

  it('감독 · 연도 정보가 표시된다', () => {
    render(<MovieTicketCard {...defaultProps} />)
    expect(screen.getByText('크리스토퍼 놀란 · 2014년')).toBeInTheDocument()
  })

  it('포스터 이미지가 렌더링된다', () => {
    render(<MovieTicketCard {...defaultProps} />)
    const img = screen.getByAltText('인터스텔라 포스터')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/poster.jpg')
  })

  it('posterUrl이 없으면 🎬 이모지가 표시된다', () => {
    render(<MovieTicketCard {...defaultProps} posterUrl="" />)
    expect(screen.getByText('🎬')).toBeInTheDocument()
  })

  it('감상 날짜가 📅 접두어와 함께 표시된다', () => {
    render(<MovieTicketCard {...defaultProps} />)
    expect(screen.getByText('📅 2024.01.15')).toBeInTheDocument()
  })

  it('한줄평이 있으면 따옴표와 함께 표시된다', () => {
    render(<MovieTicketCard {...defaultProps} oneLineReview="우주의 경이로움" />)
    // &ldquo; / &rdquo; 는 curly quote 문자로 렌더링됨
    expect(screen.getByText(/우주의 경이로움/)).toBeInTheDocument()
  })

  it('한줄평이 없으면 표시되지 않는다', () => {
    render(<MovieTicketCard {...defaultProps} oneLineReview={undefined} />)
    expect(screen.queryByText(/우주의 경이로움/)).not.toBeInTheDocument()
  })

  it('감정 태그가 최대 3개까지만 표시된다', () => {
    render(
      <MovieTicketCard
        {...defaultProps}
        emotionTags={['happy', 'sad', 'inspired', 'thrilled', 'peaceful']}
      />
    )
    // 처음 3개만 렌더링
    expect(screen.getByText('행복')).toBeInTheDocument()
    expect(screen.getByText('슬픔')).toBeInTheDocument()
    expect(screen.getByText('영감')).toBeInTheDocument()
    // 4, 5번째 태그는 렌더링되지 않음
    expect(screen.queryByText('설렘')).not.toBeInTheDocument()
    expect(screen.queryByText('평화')).not.toBeInTheDocument()
  })

  it('하단 스트립에 Admit One 텍스트가 표시된다', () => {
    render(<MovieTicketCard {...defaultProps} />)
    expect(screen.getByText('Admit One')).toBeInTheDocument()
  })

  it('하단 스트립에 Record Candy 텍스트가 표시된다', () => {
    render(<MovieTicketCard {...defaultProps} />)
    expect(screen.getByText('Record Candy')).toBeInTheDocument()
  })

  it('data-testid 속성이 id 기반으로 올바르게 설정된다', () => {
    render(<MovieTicketCard {...defaultProps} />)
    expect(screen.getByTestId('movie-ticket-card-movie-1')).toBeInTheDocument()
  })

  it('접근성 aria-label이 제목 기반으로 설정된다', () => {
    render(<MovieTicketCard {...defaultProps} />)
    expect(screen.getByLabelText('인터스텔라 영화 티켓')).toBeInTheDocument()
  })

  it('onClick 핸들러가 있으면 클릭 시 호출된다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<MovieTicketCard {...defaultProps} onClick={handleClick} />)
    const card = screen.getByLabelText('인터스텔라 영화 티켓')
    await user.click(card)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('onClick이 없으면 article role이 적용된다', () => {
    render(<MovieTicketCard {...defaultProps} />)
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('onClick이 있으면 카드에 button role이 적용된다', () => {
    render(<MovieTicketCard {...defaultProps} onClick={vi.fn()} />)
    // 카드 자체는 aria-label로 특정
    const card = screen.getByLabelText('인터스텔라 영화 티켓')
    expect(card).toHaveAttribute('role', 'button')
  })

  it('Enter 키를 누르면 onClick 핸들러가 호출된다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<MovieTicketCard {...defaultProps} onClick={handleClick} />)
    const card = screen.getByLabelText('인터스텔라 영화 티켓')
    card.focus()
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('감정 태그가 없으면 태그 영역이 렌더링되지 않는다', () => {
    render(<MovieTicketCard {...defaultProps} emotionTags={[]} />)
    // EmotionTag는 button role을 가지므로, 감정 관련 버튼이 없어야 함
    const tagButtons = screen
      .queryAllByRole('button')
      .filter((btn) => btn.getAttribute('aria-label')?.startsWith('감정 태그'))
    expect(tagButtons).toHaveLength(0)
  })
})
