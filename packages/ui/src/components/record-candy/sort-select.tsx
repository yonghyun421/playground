// 정렬 드롭다운 컴포넌트

interface SortOption {
  /** 정렬 값 */
  value: string
  /** 정렬 표시 라벨 */
  label: string
}

interface SortSelectProps {
  /** 정렬 옵션 목록 */
  options: SortOption[]
  /** 현재 선택된 정렬 값 */
  value: string
  /** 정렬 변경 핸들러 */
  onChange: (value: string) => void
  /** 추가 클래스 */
  className?: string
}

/**
 * 정렬 드롭다운 컴포넌트
 * 네이티브 select를 커스텀 스타일로 래핑
 */
export function SortSelect({
  options,
  value,
  onChange,
  className = '',
}: SortSelectProps) {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* 정렬 아이콘 */}
      <svg
        className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
        />
      </svg>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'appearance-none rounded-xl border border-border',
          'bg-card py-2 pl-9 pr-8 text-sm font-medium text-card-foreground',
          'transition-all duration-200',
          'hover:border-primary/50',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'cursor-pointer',
        ].join(' ')}
        aria-label="정렬 기준 선택"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* 드롭다운 화살표 */}
      <svg
        className="pointer-events-none absolute right-2.5 h-4 w-4 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  )
}
