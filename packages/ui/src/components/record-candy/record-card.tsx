'use client'

// RecordCard: 영화/책 감상 기록 카드 컴포넌트
import { motion } from 'framer-motion'
import { EmotionTag } from './emotion-tag'
import { RatingDisplay } from './rating-display'

interface RecordCardProps {
  /** 기록 고유 ID */
  id: string
  /** 작품 제목 */
  title: string
  /** 포스터/커버 이미지 URL */
  imageUrl: string
  /** 작품 타입 */
  workType: 'movie' | 'book'
  /** 평점 (1-10) */
  rating: number
  /** 감정 태그 목록 */
  emotionTags: string[]
  /** 한줄 감상 */
  oneLineReview?: string
  /** 감상 날짜 (ISO 문자열 또는 포맷된 문자열) */
  reviewDate: string
  /** 카드 클릭 핸들러 */
  onClick?: () => void
}

/** 작품 타입별 레이블 */
const workTypeLabel = {
  movie: '영화',
  book: '도서',
}

/** 작품 타입별 아이콘 이모지 */
const workTypeIcon = {
  movie: '🎬',
  book: '📚',
}

/**
 * 감상 기록 카드 컴포넌트
 * 포스터 이미지, 제목, 평점, 감정 태그를 표시
 * 호버 시 scale + shadow 증가 트랜지션 적용
 */
export function RecordCard({
  id,
  title,
  imageUrl,
  workType,
  rating,
  emotionTags,
  oneLineReview,
  reviewDate,
  onClick,
}: RecordCardProps) {
  // 감정 태그는 최대 3개만 표시
  const visibleTags = emotionTags.slice(0, 3)
  const hiddenTagCount = emotionTags.length - visibleTags.length

  return (
    <motion.article
      data-testid={`record-card-${id}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={[
        'group relative flex flex-col overflow-hidden rounded-2xl',
        'bg-card border border-border',
        'shadow-sm hover:shadow-md',
        'transition-shadow duration-200',
        'w-full',
        onClick ? 'cursor-pointer' : '',
      ].join(' ')}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      aria-label={`${title} 감상 기록`}
    >
      {/* 포스터/커버 이미지 영역 (2:3 비율) */}
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title} 포스터`}
            className="absolute inset-0 h-full w-full object-cover rounded-t-2xl"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-t-2xl text-4xl">
            {workTypeIcon[workType]}
          </div>
        )}
        {/* 작품 타입 배지 */}
        <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
          <span aria-hidden="true">{workTypeIcon[workType]}</span>
          {workTypeLabel[workType]}
        </span>
      </div>

      {/* 카드 콘텐츠 영역 */}
      <div className="flex flex-col gap-2 p-3 overflow-hidden">
        {/* 제목 */}
        <h3 className="line-clamp-2 text-sm font-semibold text-card-foreground leading-snug">
          {title}
        </h3>

        {/* 평점 */}
        <RatingDisplay rating={rating} size="sm" showNumber={false} />

        {/* 한줄 감상 */}
        {oneLineReview && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {oneLineReview}
          </p>
        )}

        {/* 감정 태그 */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {visibleTags.map((emotion) => (
              <EmotionTag key={emotion} emotion={emotion} size="sm" selected />
            ))}
            {hiddenTagCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                +{hiddenTagCount}
              </span>
            )}
          </div>
        )}

        {/* 감상 날짜 */}
        <time
          className="text-xs text-muted-foreground"
          dateTime={reviewDate}
        >
          {reviewDate}
        </time>
      </div>
    </motion.article>
  )
}
