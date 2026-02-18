import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { EmotionTag } from '../../components/record-candy/emotion-tag'

describe('EmotionTag', () => {
  it('감정 키에 맞는 한국어 라벨을 표시한다', () => {
    render(<EmotionTag emotion="happy" />)
    expect(screen.getByText('행복')).toBeInTheDocument()
  })

  it('모든 감정 한국어 라벨이 올바르게 매핑된다', () => {
    const emotionMap = [
      { emotion: 'happy', label: '행복' },
      { emotion: 'sad', label: '슬픔' },
      { emotion: 'inspired', label: '영감' },
      { emotion: 'thrilled', label: '설렘' },
      { emotion: 'peaceful', label: '평화' },
      { emotion: 'nostalgic', label: '향수' },
      { emotion: 'moved', label: '감동' },
      { emotion: 'funny', label: '웃김' },
    ]

    emotionMap.forEach(({ emotion, label }) => {
      const { unmount } = render(<EmotionTag emotion={emotion} />)
      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    })
  })

  it('정의되지 않은 감정은 키 자체를 라벨로 표시한다', () => {
    render(<EmotionTag emotion="unknown-emotion" />)
    expect(screen.getByText('unknown-emotion')).toBeInTheDocument()
  })

  it('선택 상태(selected=true)에서 opacity-100 클래스가 적용된다', () => {
    render(<EmotionTag emotion="happy" selected />)
    const tag = screen.getByRole('button')
    expect(tag).toHaveClass('opacity-100')
  })

  it('비선택 상태(selected=false)에서 opacity-60 클래스가 적용된다', () => {
    render(<EmotionTag emotion="happy" selected={false} />)
    const tag = screen.getByRole('button')
    expect(tag).toHaveClass('opacity-60')
  })

  it('onClick 핸들러가 있으면 클릭 시 호출된다', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<EmotionTag emotion="happy" onClick={handleClick} />)
    const tag = screen.getByRole('button', { name: '감정 태그: 행복' })
    await user.click(tag)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('sm 크기로 렌더링된다', () => {
    render(<EmotionTag emotion="happy" size="sm" />)
    const tag = screen.getByRole('button')
    expect(tag).toHaveClass('text-xs')
  })

  it('md 크기로 렌더링된다', () => {
    render(<EmotionTag emotion="happy" size="md" />)
    const tag = screen.getByRole('button')
    expect(tag).toHaveClass('text-sm')
  })

  it('접근성 aria-label이 올바르게 설정된다', () => {
    render(<EmotionTag emotion="moved" />)
    expect(screen.getByRole('button', { name: '감정 태그: 감동' })).toBeInTheDocument()
  })
})
