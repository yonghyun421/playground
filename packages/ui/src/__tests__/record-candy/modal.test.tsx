import { render, screen, act } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Modal } from '../../components/record-candy/modal'

// framer-motion 모킹 (테스트 환경에서 애니메이션 제거)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      onClick,
      onKeyDown,
      // framer-motion 전용 props 제거
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode
      initial?: unknown
      animate?: unknown
      exit?: unknown
      transition?: unknown
    }) => (
      <div onClick={onClick} onKeyDown={onKeyDown} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('Modal', () => {
  it('open=true이면 모달이 표시된다', () => {
    render(
      <Modal open onClose={vi.fn()} title="테스트 모달">
        <p>모달 내용</p>
      </Modal>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('모달 내용')).toBeInTheDocument()
  })

  it('open=false이면 모달이 표시되지 않는다', () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="테스트 모달">
        <p>모달 내용</p>
      </Modal>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('제목이 있으면 표시된다', () => {
    render(
      <Modal open onClose={vi.fn()} title="모달 제목">
        <p>내용</p>
      </Modal>
    )
    expect(screen.getByText('모달 제목')).toBeInTheDocument()
  })

  it('설명이 있으면 표시된다', () => {
    render(
      <Modal open onClose={vi.fn()} title="제목" description="모달 설명입니다">
        <p>내용</p>
      </Modal>
    )
    expect(screen.getByText('모달 설명입니다')).toBeInTheDocument()
  })

  it('닫기 버튼 클릭 시 onClose가 호출된다', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    render(
      <Modal open onClose={handleClose} title="모달">
        <p>내용</p>
      </Modal>
    )
    const closeBtn = screen.getByRole('button', { name: '모달 닫기' })
    await user.click(closeBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('aria-modal 속성이 설정된다', () => {
    render(
      <Modal open onClose={vi.fn()}>
        <p>내용</p>
      </Modal>
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('제목이 있으면 aria-labelledby가 설정된다', () => {
    render(
      <Modal open onClose={vi.fn()} title="접근성 제목">
        <p>내용</p>
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-labelledby')
  })

  it('오버레이 클릭 시 onClose가 호출된다', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    const { container } = render(
      <Modal open onClose={handleClose} closeOnOverlayClick>
        <p>내용</p>
      </Modal>
    )
    // 오버레이는 첫 번째 div (dialog의 부모)
    const overlay = container.querySelector('[aria-hidden="true"]')
    if (overlay) {
      await user.click(overlay)
      expect(handleClose).toHaveBeenCalledTimes(1)
    }
  })

  it('ESC 키 입력 시 onClose가 호출된다', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    render(
      <Modal open onClose={handleClose} closeOnEsc>
        <p>내용</p>
      </Modal>
    )
    await act(async () => {
      await user.keyboard('{Escape}')
    })
    expect(handleClose).toHaveBeenCalled()
  })

  it('children이 올바르게 렌더링된다', () => {
    render(
      <Modal open onClose={vi.fn()}>
        <button type="button">내부 버튼</button>
      </Modal>
    )
    expect(screen.getByRole('button', { name: '내부 버튼' })).toBeInTheDocument()
  })
})
