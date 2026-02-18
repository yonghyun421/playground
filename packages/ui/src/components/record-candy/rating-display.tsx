// 평점 표시 컴포넌트 - 캔디 아이콘(원형 도트)으로 1-10점 표현

interface RatingDisplayProps {
  /** 평점 (1-10) */
  rating: number
  /** 크기 variant */
  size?: 'sm' | 'md' | 'lg'
  /** 숫자 표시 여부 */
  showNumber?: boolean
}

/** 크기별 도트 사이즈 클래스 */
const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
}

/** 크기별 텍스트 클래스 */
const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

/** 캔디 아이콘 SVG 컴포넌트 */
function CandyIcon({
  filled,
  sizeClass,
}: {
  filled: boolean
  sizeClass: string
}) {
  return (
    <svg
      className={sizeClass}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 캔디 몸통 */}
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={filled ? '#FFB5C2' : 'none'}
        stroke={filled ? '#FF8FA3' : '#E8C5CE'}
        strokeWidth="2"
      />
      {/* 캔디 무늬 (채워진 경우) */}
      {filled && (
        <>
          <circle cx="12" cy="12" r="4" fill="#FF8FA3" opacity="0.6" />
          <circle cx="9" cy="9" r="1.5" fill="white" opacity="0.5" />
        </>
      )}
      {/* 빈 캔디 내부 */}
      {!filled && (
        <circle cx="12" cy="12" r="5" fill="#F5EDEA" />
      )}
    </svg>
  )
}

/**
 * 평점 표시 컴포넌트
 * 캔디 아이콘으로 10점 만점 평점을 시각화
 */
export function RatingDisplay({
  rating,
  size = 'md',
  showNumber = true,
}: RatingDisplayProps) {
  // 유효한 범위로 제한 (1-10)
  const clampedRating = Math.min(10, Math.max(0, Math.round(rating)))

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`평점 ${clampedRating}점 / 10점`}>
      {/* 캔디 아이콘 10개 */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 10 }, (_, index) => (
          <CandyIcon
            key={index}
            filled={index < clampedRating}
            sizeClass={sizeClasses[size]}
          />
        ))}
      </div>

      {/* 숫자 표시 */}
      {showNumber && (
        <span className={`ml-1 font-semibold text-foreground/70 ${textSizeClasses[size]}`}>
          {clampedRating}/10
        </span>
      )}
    </div>
  )
}
