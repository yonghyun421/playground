import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { EmptyState } from '../../components/record-candy/empty-state'

describe('EmptyState', () => {
  it('메시지가 표시된다', () => {
    render(<EmptyState message="기록이 없습니다" />)
    expect(screen.getByText('기록이 없습니다')).toBeInTheDocument()
  })

  it('설명이 있으면 표시된다', () => {
    render(
      <EmptyState
        message="기록이 없습니다"
        description="첫 번째 감상을 기록해 보세요"
      />
    )
    expect(screen.getByText('첫 번째 감상을 기록해 보세요')).toBeInTheDocument()
  })

  it('설명이 없으면 표시되지 않는다', () => {
    render(<EmptyState message="기록이 없습니다" />)
    expect(
      screen.queryByText('첫 번째 감상을 기록해 보세요')
    ).not.toBeInTheDocument()
  })

  it('기본 아이콘(🍬)이 표시된다', () => {
    render(<EmptyState message="기록이 없습니다" />)
    expect(screen.getByText('🍬')).toBeInTheDocument()
  })

  it('커스텀 아이콘이 표시된다', () => {
    render(<EmptyState message="기록이 없습니다" icon="🎬" />)
    expect(screen.getByText('🎬')).toBeInTheDocument()
  })

  it('actionLabel과 onAction이 있으면 CTA 버튼이 표시된다', () => {
    const handleAction = vi.fn()
    render(
      <EmptyState
        message="기록이 없습니다"
        actionLabel="기록 추가하기"
        onAction={handleAction}
      />
    )
    expect(screen.getByRole('button', { name: '기록 추가하기' })).toBeInTheDocument()
  })

  it('actionLabel이 없으면 CTA 버튼이 표시되지 않는다', () => {
    render(<EmptyState message="기록이 없습니다" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('CTA 버튼 클릭 시 onAction이 호출된다', async () => {
    const user = userEvent.setup()
    const handleAction = vi.fn()
    render(
      <EmptyState
        message="기록이 없습니다"
        actionLabel="기록 추가하기"
        onAction={handleAction}
      />
    )
    const button = screen.getByRole('button', { name: '기록 추가하기' })
    await user.click(button)
    expect(handleAction).toHaveBeenCalledTimes(1)
  })

  it('role=status 접근성 속성이 설정된다', () => {
    render(<EmptyState message="기록이 없습니다" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
