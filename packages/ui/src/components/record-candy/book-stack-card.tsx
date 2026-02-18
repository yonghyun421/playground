'use client'

// BookStackCard: 책이 서재에 쌓이는 느낌을 주는 세로형 카드 컴포넌트
import { motion, type Transition } from 'framer-motion'
import { EmotionTag } from './emotion-tag'
import { RatingDisplay } from './rating-display'

interface BookStackCardProps {
  /** 기록 고유 ID */
  id: string
  /** 책 제목 */
  title: string
  /** 커버 이미지 URL */
  coverUrl: string
  /** 저자 */
  author: string
  /** 출판 연도 */
  year: number
  /** 평점 (1-10) */
  rating: number
  /** 감정 태그 목록 */
  emotionTags: string[]
  /** 한줄 감상 */
  oneLineReview?: string
  /** 감상 날짜 (ISO 또는 포맷된 문자열) */
  reviewDate: string
  /** 카드 클릭 핸들러 */
  onClick?: () => void
}

/** 감정별 책등(spine) 색상 매핑 - EmotionTag와 동일한 팔레트 사용 */
const spineColorMap: Record<string, string> = {
  happy: '#FFE066',
  sad: '#7EB5E8',
  inspired: '#FFB347',
  thrilled: '#FF6B8A',
  peaceful: '#87CEAB',
  nostalgic: '#C9A5E0',
  moved: '#FF9E9E',
  funny: '#7DD87D',
}

/** 기본 책등 색상 (감정 태그 없을 때) */
const DEFAULT_SPINE_COLOR = '#C4A882'

/** 첫 번째 감정 태그 기반으로 책등 색상 반환 */
function getSpineColor(emotionTags: string[]): string {
  const firstTag = emotionTags[0]
  if (!firstTag) return DEFAULT_SPINE_COLOR
  return spineColorMap[firstTag] ?? DEFAULT_SPINE_COLOR
}

// ─── framer-motion 애니메이션 variants ────────────────────────────────────

/** 가장 뒤쪽 그림자 카드: 호버 시 더 많이 벌어짐 */
const shadowCard2Variants = {
  initial: { x: 4, y: 4, rotate: 1.5 },
  hover: { x: 9, y: 12, rotate: 2.8 },
}

/** 중간 그림자 카드: 호버 시 살짝 벌어짐 */
const shadowCard1Variants = {
  initial: { x: 2, y: 2, rotate: 0.8 },
  hover: { x: 5, y: 7, rotate: 1.4 },
}

/** 메인 카드: 호버 시 위로 올라오는 효과 */
const mainCardVariants = {
  initial: {
    y: 0,
    scale: 1,
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: '0 16px 32px rgba(0,0,0,0.20)',
  },
}

/** 공통 transition 설정 */
const cardTransition: Transition = { duration: 0.25, ease: 'easeOut' }

/**
 * 책 스택 카드 컴포넌트
 * 메인 카드 뒤에 그림자 카드 2장이 살짝 어긋나게 겹쳐,
 * 서재에 책이 쌓여 있는 느낌을 표현.
 * 호버 시 맨 위 책이 올라오는 애니메이션 적용.
 */
export function BookStackCard({
  id,
  title,
  coverUrl,
  author,
  year,
  rating,
  emotionTags,
  oneLineReview,
  reviewDate,
  onClick,
}: BookStackCardProps) {
  // 감정 태그는 공간 절약을 위해 최대 2개만 표시
  const visibleTags = emotionTags.slice(0, 2)
  const hiddenTagCount = emotionTags.length - visibleTags.length

  // 책등 색상: 첫 번째 감정 태그 색상 사용
  const spineColor = getSpineColor(emotionTags)

  return (
    // 컨테이너: hover variant를 자식 카드들에 전파
    <motion.div
      className="relative w-40 max-w-full sm:w-[200px]"
      initial="initial"
      whileHover="hover"
      data-testid={`book-stack-card-${id}`}
    >
      {/* 그림자 카드 2 (가장 뒤, 더 진한 회전) */}
      <motion.div
        variants={shadowCard2Variants}
        transition={cardTransition}
        className="absolute inset-0 rounded-2xl"
        style={{
          backgroundColor: '#F5ECD7',
          border: '1px solid rgba(180, 150, 120, 0.25)',
        }}
        aria-hidden="true"
      />

      {/* 그림자 카드 1 (중간) */}
      <motion.div
        variants={shadowCard1Variants}
        transition={cardTransition}
        className="absolute inset-0 rounded-2xl"
        style={{
          backgroundColor: '#FAF3E4',
          border: '1px solid rgba(180, 150, 120, 0.20)',
        }}
        aria-hidden="true"
      />

      {/* 메인 카드 */}
      <motion.article
        variants={mainCardVariants}
        transition={cardTransition}
        onClick={onClick}
        role={onClick ? 'button' : 'article'}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
        aria-label={`${title} 책 기록`}
        className={[
          'relative flex flex-col overflow-hidden rounded-2xl',
          onClick ? 'cursor-pointer' : '',
        ].join(' ')}
        style={{
          backgroundColor: '#FFFDF7',
          border: '1px solid rgba(180, 150, 120, 0.30)',
          // 미묘한 종이 질감 내부 그림자
          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.03)',
        }}
      >
        {/* ── 커버 이미지 영역 (3:4 비율) ─────────────── */}
        <div
          className="relative w-full overflow-hidden rounded-t-2xl"
          style={{ aspectRatio: '3 / 4' }}
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={`${title} 커버`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            // 커버 이미지 없을 때 placeholder
            <div
              className="absolute inset-0 flex items-center justify-center text-4xl"
              style={{ backgroundColor: '#F5EDEA' }}
            >
              📚
            </div>
          )}
        </div>

        {/* ── 하단 콘텐츠 (책등 + 정보) ───────────────── */}
        <div className="flex flex-1 min-h-0">
          {/* 책등(spine) 컬러 바 */}
          <div
            className="w-[5px] flex-shrink-0"
            style={{ backgroundColor: spineColor }}
            aria-hidden="true"
          />

          {/* 책 정보 */}
          <div className="flex flex-col gap-1.5 p-2.5 overflow-hidden">
            {/* 제목 */}
            <h3
              className="line-clamp-2 text-xs font-semibold leading-snug"
              style={{ color: '#3D2B1F' }}
            >
              {title}
            </h3>

            {/* 저자 · 출판 연도 */}
            <p className="truncate text-xs" style={{ color: '#7A5A50' }}>
              {author} · {year}
            </p>

            {/* 평점 (캔디 아이콘) */}
            <RatingDisplay rating={rating} size="sm" showNumber={false} />

            {/* 한줄 감상 (있을 때만 표시) */}
            {oneLineReview && (
              <p
                className="line-clamp-2 text-xs italic"
                style={{ color: '#7A5A50' }}
              >
                &ldquo;{oneLineReview}&rdquo;
              </p>
            )}

            {/* 감정 태그 */}
            {visibleTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {visibleTags.map((emotion) => (
                  <EmotionTag key={emotion} emotion={emotion} size="sm" selected />
                ))}
                {/* 초과 태그 수 표시 */}
                {hiddenTagCount > 0 && (
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs"
                    style={{ backgroundColor: '#F5EDEA', color: '#7A5A50' }}
                  >
                    +{hiddenTagCount}
                  </span>
                )}
              </div>
            )}

            {/* 감상 날짜 */}
            <time
              className="text-xs"
              dateTime={reviewDate}
              style={{ color: '#A08070' }}
            >
              📅 {reviewDate}
            </time>
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}
