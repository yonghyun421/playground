import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FilterBar } from '../../components/record-candy/filter-bar'

const options = [
  { value: 'all', label: '전체' },
  { value: 'movie', label: '영화' },
  { value: 'book', label: '도서' },
]

describe('FilterBar', () => {
  it('모든 필터 옵션이 렌더링된다', () => {
    render(<FilterBar options={options} activeValue="all" onChange={vi.fn()} />)
    expect(screen.getByText('전체')).toBeInTheDocument()
    expect(screen.getByText('영화')).toBeInTheDocument()
    expect(screen.getByText('도서')).toBeInTheDocument()
  })

  it('활성 필터에 primary 클래스가 적용된다', () => {
    render(<FilterBar options={options} activeValue="movie" onChange={vi.fn()} />)
    const movieButton = screen.getByRole('button', { name: '영화' })
    expect(movieButton).toHaveClass('bg-primary')
  })

  it('비활성 필터에 muted 클래스가 적용된다', () => {
    render(<FilterBar options={options} activeValue="movie" onChange={vi.fn()} />)
    const allButton = screen.getByRole('button', { name: '전체' })
    expect(allButton).toHaveClass('bg-muted')
  })

  it('필터 클릭 시 onChange가 해당 value로 호출된다', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<FilterBar options={options} activeValue="all" onChange={handleChange} />)
    await user.click(screen.getByRole('button', { name: '영화' }))
    expect(handleChange).toHaveBeenCalledWith('movie')
  })

  it('aria-pressed 속성이 올바르게 설정된다', () => {
    render(<FilterBar options={options} activeValue="book" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: '도서' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '영화' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('role=group 접근성 속성이 설정된다', () => {
    render(<FilterBar options={options} activeValue="all" onChange={vi.fn()} />)
    expect(screen.getByRole('group', { name: '필터 옵션' })).toBeInTheDocument()
  })

  it('아이콘이 있는 옵션에서 아이콘이 렌더링된다', () => {
    const optionsWithIcon = [
      { value: 'movie', label: '영화', icon: '🎬' },
    ]
    render(<FilterBar options={optionsWithIcon} activeValue="movie" onChange={vi.fn()} />)
    expect(screen.getByText('🎬')).toBeInTheDocument()
  })
})
