// 필터 바 컴포넌트 - 필터 옵션 가로 스크롤 배치

import type { ReactNode } from 'react'

interface FilterOption {
  /** 필터 키 */
  value: string
  /** 필터 표시 라벨 */
  label: string
  /** 아이콘 (선택 사항) */
  icon?: ReactNode
}

interface FilterBarProps {
  /** 필터 옵션 목록 */
  options: FilterOption[]
  /** 현재 선택된 필터 값 */
  activeValue: string
  /** 필터 변경 핸들러 */
  onChange: (value: string) => void
  /** 추가 클래스 */
  className?: string
}

/**
 * 필터 바 컴포넌트
 * 가로 스크롤 가능한 필터 칩 목록
 */
export function FilterBar({
  options,
  activeValue,
  onChange,
  className = '',
}: FilterBarProps) {
  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none ${className}`}
      role="group"
      aria-label="필터 옵션"
    >
      {options.map((option) => {
        const isActive = option.value === activeValue

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              'inline-flex flex-shrink-0 items-center gap-1.5',
              'rounded-full px-4 py-1.5 text-sm font-medium',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            ].join(' ')}
            aria-pressed={isActive}
          >
            {option.icon && (
              <span aria-hidden="true">{option.icon}</span>
            )}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
