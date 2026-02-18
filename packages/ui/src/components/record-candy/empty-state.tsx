// 빈 상태 컴포넌트 - 데이터 없을 때 안내 UI

import type { ReactNode } from 'react'

interface EmptyStateProps {
  /** 아이콘 (이모지 문자열 또는 ReactNode) */
  icon?: ReactNode
  /** 메인 메시지 */
  message: string
  /** 부가 설명 */
  description?: string
  /** CTA 버튼 텍스트 */
  actionLabel?: string
  /** CTA 버튼 클릭 핸들러 */
  onAction?: () => void
}

/**
 * 빈 상태 컴포넌트
 * 아이콘 + 메시지 + CTA 버튼으로 구성된 빈 화면 안내
 */
export function EmptyState({
  icon = '🍬',
  message,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center"
      role="status"
      aria-label={message}
    >
      {/* 아이콘 */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-4xl">
        {icon}
      </div>

      {/* 메시지 */}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-foreground">{message}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* CTA 버튼 */}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={[
            'rounded-full px-6 py-2.5 text-sm font-semibold',
            'bg-primary text-primary-foreground',
            'transition-all duration-200',
            'hover:opacity-90 hover:shadow-md',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          ].join(' ')}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
