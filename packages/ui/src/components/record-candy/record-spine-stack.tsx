'use client'

// RecordSpineStack: 책등 쌓기 시각화 컴포넌트
// 각 감상 기록을 파스텔 색상의 가로 바로 세로 스택하여 표시
import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

// 감정별 바 배경/텍스트/테두리 색상
const spineColors: Record<string, { bg: string; text: string; border: string }> = {
  happy:    { bg: '#FFF3CD', text: '#7A5A00', border: '#FFE066' },
  sad:      { bg: '#D6EAF8', text: '#1A3D5C', border: '#7EB5E8' },
  inspired: { bg: '#FDEBD0', text: '#7A3A00', border: '#FFB347' },
  thrilled: { bg: '#FADBD8', text: '#7A0A28', border: '#FF6B8A' },
  peaceful: { bg: '#D5F5E3', text: '#0A4A28', border: '#87CEAB' },
  nostalgic:{ bg: '#E8DAEF', text: '#4A1A7A', border: '#C9A5E0' },
  moved:    { bg: '#FDEDEC', text: '#7A1A1A', border: '#FF9E9E' },
  funny:    { bg: '#D4EFDF', text: '#0A4A0A', border: '#7DD87D' },
}

// 작품 타입별 기본 색상
const defaultMovieColor = { bg: '#FFE8EC', text: '#7A2A3A', border: '#FFB5C2' }
const defaultBookColor  = { bg: '#E8F5F0', text: '#1A4A3A', border: '#87CEAB' }

// 작품 타입별 아이콘
const workTypeIcon = {
  movie: '\uD83C\uDFAC',
  book: '\uD83D\uDCDA',
}

/** 감정 태그에서 바 색상을 결정 */
function getSpineColor(
  emotionTags: string[],
  workType: 'movie' | 'book',
): { bg: string; text: string; border: string } {
  // 첫 번째 감정 태그에 매칭되는 색상 사용
  for (const tag of emotionTags) {
    const color = spineColors[tag]
    if (color) return color
  }
  // 감정 태그 없으면 작품 타입별 기본색
  return workType === 'movie' ? defaultMovieColor : defaultBookColor
}

/** 캔디 평점 도트를 렌더링 */
function CandyDots({ rating }: { rating: number }) {
  const clamped = Math.min(10, Math.max(0, Math.round(rating)))
  return (
    <div className="flex items-center gap-0.5 shrink-0" aria-label={`평점 ${clamped}점`}>
      {Array.from({ length: clamped }, (_, i) => (
        <span
          key={i}
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: '#FFB5C2' }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

// --- RecordSpine: 개별 바 ---

interface RecordSpineProps {
  /** 기록 고유 ID */
  id: string
  /** 작품 제목 */
  title: string
  /** 감독 또는 저자 */
  subtitle: string
  /** 작품 타입 */
  workType: 'movie' | 'book'
  /** 평점 (1-10) */
  rating: number
  /** 감정 태그 목록 */
  emotionTags: string[]
  /** 한줄 감상 (선택) */
  oneLineReview?: string
  /** 감상 날짜 */
  reviewDate: string
  /** 클릭 핸들러 */
  onClick?: () => void
}

// 개별 바 애니메이션 variants
const spineVariants = {
  hidden: { opacity: 0, x: -20, scaleX: 0.8 },
  visible: {
    opacity: 1,
    x: 0,
    scaleX: 1,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
}

/**
 * 개별 책등 바 컴포넌트
 * 감정 태그 기반 파스텔 색상, 평점에 비례하는 너비
 */
export function RecordSpine({
  id,
  title,
  subtitle,
  workType,
  rating,
  emotionTags,
  oneLineReview,
  reviewDate,
  onClick,
}: RecordSpineProps) {
  const color = getSpineColor(emotionTags, workType)
  // 평점에 비례하는 너비 (최소 40%, 최대 100%)
  const widthPercent = Math.max(40, rating * 10)

  return (
    <motion.div
      data-testid={`record-spine-${id}`}
      variants={spineVariants}
      whileHover={{ x: 8, boxShadow: '4px 4px 12px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      className={[
        'rounded-xl border-2 px-4 py-3 transition-colors duration-200',
        onClick ? 'cursor-pointer' : '',
      ].join(' ')}
      style={{
        width: `${widthPercent}%`,
        backgroundColor: color.bg,
        borderColor: color.border,
        color: color.text,
      }}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter') onClick()
      } : undefined}
      aria-label={`${title} 감상 기록`}
    >
      {/* 상단: 아이콘 + 제목 + 부제목 + 날짜 + 캔디 평점 */}
      <div className="flex items-center gap-2">
        {/* 작품 타입 아이콘 */}
        <span className="text-base shrink-0" aria-hidden="true">
          {workTypeIcon[workType]}
        </span>

        {/* 제목 + 부제목 + 날짜 */}
        <div className="flex items-baseline gap-1.5 min-w-0 flex-1">
          <span className="font-bold text-sm truncate">{title}</span>
          <span className="text-xs opacity-70 truncate shrink-0">
            {subtitle}
          </span>
          <span className="text-xs opacity-50 shrink-0">{reviewDate}</span>
        </div>

        {/* 캔디 평점 */}
        <CandyDots rating={rating} />
      </div>

      {/* 한줄 감상 (있을 때만 표시, 바 높이 확장) */}
      {oneLineReview && (
        <p className="mt-1.5 text-xs italic opacity-80 truncate">
          &ldquo;{oneLineReview}&rdquo;
        </p>
      )}
    </motion.div>
  )
}

// --- RecordSpineStack: 컨테이너 ---

interface RecordSpineStackProps {
  /** RecordSpine 자식 요소 */
  children: ReactNode
  /** 총 기록 수 */
  totalCount: number
  /** 상단 라벨 (기본: "나의 감상 기록") */
  label?: string
}

// 컨테이너 stagger 애니메이션
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

/**
 * 책등 쌓기 컨테이너 컴포넌트
 * 상단 헤더 + 세로 스택 + 하단 안내 메시지
 */
export function RecordSpineStack({
  children,
  totalCount,
  label = '나의 감상 기록',
}: RecordSpineStackProps) {
  return (
    <section
      className="w-full rounded-2xl p-6"
      style={{ backgroundColor: '#FFF9F0' }}
      aria-label={label}
    >
      {/* 헤더 */}
      <div className="mb-6 text-center">
        <h2 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
          <span aria-hidden="true">{'\uD83C\uDF6C'}</span>
          {label}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {totalCount}개의 달콤한 기록
        </p>
      </div>

      {/* 바 스택 */}
      <motion.div
        className="flex flex-col gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {children}
      </motion.div>

      {/* 하단 안내 */}
      <p className="mt-6 text-center text-xs text-gray-400">
        {'\uD83C\uDF6C'} 달콤한 기록을 더 쌓아보세요!
      </p>
    </section>
  )
}
