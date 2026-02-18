import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RatingDisplay } from '../../components/record-candy/rating-display'

describe('RatingDisplay', () => {
  it('기본 props로 렌더링된다', () => {
    render(<RatingDisplay rating={7} />)
    // aria-label으로 평점 정보 확인
    expect(screen.getByRole('img', { name: '평점 7점 / 10점' })).toBeInTheDocument()
  })

  it('숫자 표시가 켜져있으면 x/10 형식으로 표시된다', () => {
    render(<RatingDisplay rating={5} showNumber />)
    expect(screen.getByText('5/10')).toBeInTheDocument()
  })

  it('showNumber=false이면 숫자가 표시되지 않는다', () => {
    render(<RatingDisplay rating={5} showNumber={false} />)
    expect(screen.queryByText('5/10')).not.toBeInTheDocument()
  })

  it('10점 초과 값은 10으로 제한된다', () => {
    render(<RatingDisplay rating={15} />)
    expect(screen.getByRole('img', { name: '평점 10점 / 10점' })).toBeInTheDocument()
  })

  it('0점 미만 값은 0으로 제한된다', () => {
    render(<RatingDisplay rating={-5} />)
    expect(screen.getByRole('img', { name: '평점 0점 / 10점' })).toBeInTheDocument()
  })

  it('sm 크기로 렌더링된다', () => {
    render(<RatingDisplay rating={5} size="sm" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('lg 크기로 렌더링된다', () => {
    render(<RatingDisplay rating={5} size="lg" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
