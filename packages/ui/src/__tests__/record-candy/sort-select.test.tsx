import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SortSelect } from '../../components/record-candy/sort-select'

const options = [
  { value: 'latest', label: '최신순' },
  { value: 'rating', label: '평점순' },
  { value: 'title', label: '제목순' },
]

describe('SortSelect', () => {
  it('모든 옵션이 렌더링된다', () => {
    render(<SortSelect options={options} value="latest" onChange={vi.fn()} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('최신순')).toBeInTheDocument()
    expect(screen.getByText('평점순')).toBeInTheDocument()
    expect(screen.getByText('제목순')).toBeInTheDocument()
  })

  it('현재 선택된 값이 표시된다', () => {
    render(<SortSelect options={options} value="rating" onChange={vi.fn()} />)
    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('rating')
  })

  it('값 변경 시 onChange가 호출된다', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<SortSelect options={options} value="latest" onChange={handleChange} />)
    await user.selectOptions(screen.getByRole('combobox'), 'rating')
    expect(handleChange).toHaveBeenCalledWith('rating')
  })

  it('aria-label이 올바르게 설정된다', () => {
    render(<SortSelect options={options} value="latest" onChange={vi.fn()} />)
    expect(
      screen.getByRole('combobox', { name: '정렬 기준 선택' })
    ).toBeInTheDocument()
  })

  it('커스텀 className이 적용된다', () => {
    const { container } = render(
      <SortSelect
        options={options}
        value="latest"
        onChange={vi.fn()}
        className="custom-class"
      />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
