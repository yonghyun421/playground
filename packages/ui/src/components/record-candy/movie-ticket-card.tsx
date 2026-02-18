'use client'

// MovieTicketCard: 영화 감상을 티켓 스텁 형태로 표현하는 카드 컴포넌트
import { motion } from 'framer-motion'
import { EmotionTag } from './emotion-tag'
import { RatingDisplay } from './rating-display'

interface MovieTicketCardProps {
  /** 기록 고유 ID */
  id: string
  /** 영화 제목 */
  title: string
  /** 포스터 이미지 URL */
  posterUrl: string
  /** 개봉 연도 */
  year: number
  /** 감독 이름 */
  director: string
  /** 평점 (1-10) */
  rating: number
  /** 감정 태그 목록 */
  emotionTags: string[]
  /** 한줄 감상 (선택) */
  oneLineReview?: string
  /** 감상 날짜 */
  reviewDate: string
  /** 카드 클릭 핸들러 */
  onClick?: () => void
}

/**
 * id를 기반으로 결정론적 회전 각도를 계산한다 (-1도 ~ 1도)
 * 각 카드가 약간씩 다른 기울기를 가져 실제 티켓처럼 보이게 한다
 */
function getRotationDegree(id: string): number {
  const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return ((sum % 20) - 10) / 10
}

/**
 * 영화 티켓 카드 컴포넌트
 *
 * 영화를 감상할 때마다 티켓을 모으는 느낌을 주는 카드 UI.
 * 왼쪽 포스터 + 세로 점선 + 오른쪽 정보 섹션으로 구성되며,
 * 하단에는 ADMIT ONE 스트립과 바코드 장식이 있다.
 *
 * 레이아웃:
 *   [포스터] │ 제목
 *            │ 감독 · 연도
 *            │ 🍬🍬🍬🍬🍬 8/10
 *            │ #태그 #태그
 *            │ "한줄평"
 *            │ ─────
 *            │ 📅 날짜
 *   ◯────────┼────────────────◯
 *   ADMIT ONE        RECORD CANDY
 */
export function MovieTicketCard({
  id,
  title,
  posterUrl,
  year,
  director,
  rating,
  emotionTags,
  oneLineReview,
  reviewDate,
  onClick,
}: MovieTicketCardProps) {
  // 최대 3개 태그만 표시
  const visibleTags = emotionTags.slice(0, 3)
  // id 해시 기반 기울기 각도
  const rotation = getRotationDegree(id)

  return (
    <motion.article
      data-testid={`movie-ticket-card-${id}`}
      onClick={onClick}
      style={{ rotate: rotation }}
      whileHover={{
        y: -4,
        rotate: 0,
        boxShadow: '0 20px 48px rgba(0,0,0,0.20)',
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={[
        'group relative overflow-hidden rounded-xl',
        // 모바일: 풀 너비 / 태블릿 이상: 고정 너비
        'w-full sm:w-[360px]',
        // 크림색 티켓 배경 + 테두리
        'bg-[#FFFDF5] border border-[#E8DEC8]',
        'shadow-md',
        onClick ? 'cursor-pointer' : '',
      ].join(' ')}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      aria-label={`${title} 영화 티켓`}
    >
      {/* ──── 상단 콘텐츠: 포스터 + 정보 ──── */}
      <div className="flex min-h-[160px]">
        {/* 왼쪽: 포스터 이미지 영역 */}
        <div className="relative w-[110px] flex-shrink-0">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${title} 포스터`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            // 포스터 없을 때 대체 이모지
            <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-[#F5EDD8] text-4xl">
              🎬
            </div>
          )}
        </div>

        {/* 세로 점선 구분선 (포스터 / 정보 사이) */}
        <div className="flex-shrink-0 self-stretch border-l-2 border-dashed border-[#D4C9A8]" />

        {/* 오른쪽: 영화 정보 */}
        <div className="flex flex-1 flex-col gap-1.5 overflow-hidden p-3">
          {/* 제목 */}
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#3D2B1A]">
            {title}
          </h3>

          {/* 감독 · 연도 */}
          <p className="text-xs text-[#8B7355]">
            {director} · {year}년
          </p>

          {/* 평점 */}
          <RatingDisplay rating={rating} size="sm" showNumber />

          {/* 감정 태그 (최대 3개) */}
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {visibleTags.map((emotion) => (
                <EmotionTag key={emotion} emotion={emotion} size="sm" selected />
              ))}
            </div>
          )}

          {/* 한줄평 */}
          {oneLineReview && (
            <p className="line-clamp-2 text-xs italic text-[#8B7355]">
              &ldquo;{oneLineReview}&rdquo;
            </p>
          )}

          {/* 날짜 구분선 + 감상 날짜 */}
          <div className="mt-auto border-t border-[#E8DEC8] pt-1.5">
            <time className="text-xs text-[#8B7355]" dateTime={reviewDate}>
              📅 {reviewDate}
            </time>
          </div>
        </div>
      </div>

      {/* ──── 펀치홀 + 수평 점선 구분선 ──── */}
      <div className="relative">
        {/* 수평 점선 */}
        <div className="border-t-2 border-dashed border-[#D4C9A8]" />

        {/*
         * 펀치홀 반원 노치
         * overflow-hidden 카드 내에서 원의 절반만 보여 반원 노치처럼 표현된다.
         * 배경색을 페이지 배경과 맞춰 구멍 뚫린 효과를 연출한다.
         */}
        <div
          className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-[#D4C9A8] bg-slate-50"
          aria-hidden="true"
        />
        <div
          className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-[#D4C9A8] bg-slate-50"
          aria-hidden="true"
        />
      </div>

      {/* ──── 하단 스트립: ADMIT ONE + RECORD CANDY ──── */}
      <div className="relative flex items-center justify-between overflow-hidden bg-[#7C6A4E] px-4 py-2">
        {/*
         * 바코드 장식 - CSS repeating-linear-gradient로 세로줄 패턴 구현
         * 실제 티켓의 바코드처럼 보이는 순수 CSS 장식 요소
         */}
        <div
          className="absolute inset-y-0 right-4 w-10 opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #fff 0px, #fff 2px, transparent 2px, transparent 5px)',
          }}
          aria-hidden="true"
        />

        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#F5EDDA]">
          Admit One
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#F5EDDA]">
          Record Candy
        </span>
      </div>
    </motion.article>
  )
}
