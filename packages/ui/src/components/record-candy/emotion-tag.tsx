// 감정 태그 컴포넌트 - 파스텔 컬러 칩 형태

interface EmotionTagProps {
  /** 감정 키 */
  emotion: string
  /** 선택 상태 */
  selected?: boolean
  /** 클릭 핸들러 */
  onClick?: () => void
  /** 크기 */
  size?: 'sm' | 'md'
}

/** 감정별 한국어 라벨 매핑 */
const emotionLabels: Record<string, string> = {
  happy: '행복',
  sad: '슬픔',
  inspired: '영감',
  thrilled: '설렘',
  peaceful: '평화',
  nostalgic: '향수',
  moved: '감동',
  funny: '웃김',
}

/** 감정별 배경 색상 (인라인 스타일용 CSS 변수 활용) */
const emotionColors: Record<string, { bg: string; border: string; text: string }> = {
  happy: { bg: '#FFE066', border: '#D4A800', text: '#7A5A00' },
  sad: { bg: '#7EB5E8', border: '#4A8FCC', text: '#1A3D5C' },
  inspired: { bg: '#FFB347', border: '#D4821A', text: '#7A3A00' },
  thrilled: { bg: '#FF6B8A', border: '#CC3D60', text: '#7A0A28' },
  peaceful: { bg: '#87CEAB', border: '#4A9E7A', text: '#0A4A28' },
  nostalgic: { bg: '#C9A5E0', border: '#9A6ABE', text: '#4A1A7A' },
  moved: { bg: '#FF9E9E', border: '#CC5A5A', text: '#7A1A1A' },
  funny: { bg: '#7DD87D', border: '#3DAA3D', text: '#0A4A0A' },
}

/** 기본 감정 색상 (정의되지 않은 감정) */
const defaultColor = { bg: '#F5EDEA', border: '#D4B8B0', text: '#7A5A50' }

/** 크기별 클래스 */
const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

/**
 * 감정 태그 컴포넌트
 * 각 감정별 고유 파스텔 색상으로 표시되는 칩 형태의 태그
 */
export function EmotionTag({
  emotion,
  selected = false,
  onClick,
  size = 'md',
}: EmotionTagProps) {
  const label = emotionLabels[emotion] ?? emotion
  const color = emotionColors[emotion] ?? defaultColor

  const baseStyle = {
    backgroundColor: color.bg,
    borderColor: color.border,
    color: color.text,
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      style={baseStyle}
      className={[
        'inline-flex items-center rounded-full border font-medium transition-all duration-200',
        sizeClasses[size],
        selected
          ? 'opacity-100 border-2 shadow-sm scale-105'
          : 'opacity-60 border hover:opacity-80',
        onClick ? 'cursor-pointer' : 'cursor-default',
      ].join(' ')}
      aria-pressed={onClick ? selected : undefined}
      aria-label={`감정 태그: ${label}`}
    >
      {label}
    </button>
  )
}
