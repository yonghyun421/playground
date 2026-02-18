import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SearchResultCard } from '../../components/record-candy/search-result-card'

const defaultProps = {
  title: '기생충',
  imageUrl: 'https://example.com/poster.jpg',
  year: 2019,
  subtitle: '봉준호',
  workType: 'movie' as const,
}

describe('SearchResultCard', () => {
  it('기본 props로 렌더링된다', () => {
    render(<SearchResultCard {...defaultProps} />)
    expect(screen.getByText('기생충')).toBeInTheDocument()
  })

  it('감독/저자명이 표시된다', () => {
    render(<SearchResultCard {...defaultProps} />)
    expect(screen.getByText('봉준호')).toBeInTheDocument()
  })

  it('출시 연도가 표시된다', () => {
    render(<SearchResultCard {...defaultProps} year={2019} />)
    expect(screen.getByText('2019년')).toBeInTheDocument()
  })

  it('영화 타입 배지가 표시된다', () => {
    render(<SearchResultCard {...defaultProps} workType="movie" />)
    expect(screen.getByText('영화')).toBeInTheDocument()
  })

  it('도서 타입 배지가 표시된다', () => {
    render(<SearchResultCard {...defaultProps} workType="book" />)
    expect(screen.getByText('도서')).toBeInTheDocument()
  })

  it('이미지가 있으면 img 태그가 렌더링된다', () => {
    render(<SearchResultCard {...defaultProps} />)
    const img = screen.getByAltText('기생충 썸네일')
    expect(img).toBeInTheDocument()
  })

  it('이미지가 없으면 플레이스홀더가 표시된다', () => {
    render(<SearchResultCard {...defaultProps} imageUrl="" />)
    expect(screen.queryByAltText('기생충 썸네일')).not.toBeInTheDocument()
  })

  it('onClick 핸들러가 있으면 클릭 시 호출된다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<SearchResultCard {...defaultProps} onClick={handleClick} />)
    const card = screen.getByRole('button')
    await user.click(card)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('접근성 aria-label이 올바르게 설정된다', () => {
    render(<SearchResultCard {...defaultProps} />)
    expect(
      screen.getByRole('button', { name: '기생충 (2019) - 봉준호 선택' })
    ).toBeInTheDocument()
  })
})
