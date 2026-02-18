// 검색 결과 카드 컴포넌트 - TMDB/Google Books 검색 결과 표시용

interface SearchResultCardProps {
  /** 작품 제목 */
  title: string
  /** 포스터/커버 이미지 URL */
  imageUrl: string
  /** 출시/출판 연도 */
  year: number
  /** 감독명 또는 저자명 */
  subtitle: string
  /** 작품 타입 */
  workType: 'movie' | 'book'
  /** 카드 클릭 핸들러 */
  onClick?: () => void
}

/** 작품 타입별 레이블 */
const workTypeLabel = {
  movie: '영화',
  book: '도서',
}

/** 작품 타입별 배경 색상 */
const workTypeBadgeClass = {
  movie: 'bg-primary/80 text-primary-foreground',
  book: 'bg-secondary/80 text-secondary-foreground',
}

/**
 * 검색 결과 카드 컴포넌트
 * 작품 검색 시 결과 목록에서 사용되는 가로형 카드
 */
export function SearchResultCard({
  title,
  imageUrl,
  year,
  subtitle,
  workType,
  onClick,
}: SearchResultCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-center gap-2.5 rounded-lg border border-border',
        'bg-card p-2.5 text-left overflow-hidden',
        'transition-all duration-200',
        'hover:bg-muted hover:shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      ].join(' ')}
      aria-label={`${title} (${year}) - ${subtitle} 선택`}
    >
      {/* 썸네일 이미지 (세로 포스터 비율) */}
      <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded-md">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title} 썸네일`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          /* 이미지 없을 때 플레이스홀더 */
          <div className="flex h-full w-full items-center justify-center bg-muted text-lg">
            {workType === 'movie' ? '🎬' : '📚'}
          </div>
        )}
      </div>

      {/* 작품 정보 - 한 줄 컴팩트 레이아웃 */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* 제목 */}
        <h4 className="truncate text-sm font-semibold text-card-foreground">
          {title}
        </h4>

        {/* 부제목 · 연도 · 타입을 한 줄로 */}
        <p className="truncate text-xs text-muted-foreground">
          {subtitle}
          {year > 0 && <span> · {year}년</span>}
          <span> · </span>
          <span
            className={`inline-flex rounded-full px-1.5 py-px text-xs font-medium ${workTypeBadgeClass[workType]}`}
          >
            {workTypeLabel[workType]}
          </span>
        </p>
      </div>

      {/* 선택 화살표 아이콘 */}
      <svg
        className="h-4 w-4 flex-shrink-0 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  )
}
