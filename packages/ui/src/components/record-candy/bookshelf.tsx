'use client'

// Bookshelf: 도서 기록이 쌓일수록 책장에 한 권씩 꽂히는 래퍼 컴포넌트
// BookStackCard를 감싸는 컨테이너로, 나무 재질의 선반 위에 책들이 정렬됨

import { Children, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface BookshelfProps {
  /** BookStackCard 자식 요소들 */
  children: ReactNode
  /** 전체 도서 기록 수 */
  totalCount: number
  /** 섹션 제목 (기본: "나의 책장") */
  label?: string
  /** 선반당 최대 권 수 (기본: 4, 반응형으로 조절) */
  booksPerShelf?: number
}

// ─── 나무 재질 스타일 상수 ─────────────────────────────────────────────────

/** 선반 판자 그라데이션 */
const SHELF_PLANK_GRADIENT =
  'linear-gradient(180deg, #C4A06A 0%, #A58046 60%, #8B6832 100%)'

/** 선반 판자 그림자 */
const SHELF_PLANK_SHADOW =
  'inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.15)'

/** 책장 프레임 색상 */
const FRAME_COLOR = '#8B6832'

/** 프레임 내부 배경색 */
const FRAME_INNER_BG = '#6B4F28'

// ─── 애니메이션 variants ───────────────────────────────────────────────────

/** 선반 컨테이너: stagger로 자식(책) 순차 등장 */
const shelfContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

/** 개별 책 등장 애니메이션: 아래에서 위로 자라나는 효과 */
const bookItemVariants = {
  hidden: { opacity: 0, y: 20, scaleY: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
}

// ─── children을 선반 단위로 분할 ───────────────────────────────────────────

/** 배열을 지정된 크기의 청크로 분할 (불변) */
function chunkArray<T>(array: readonly T[], size: number): T[][] {
  if (size <= 0) return [array as T[]]
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// ─── 북엔드 장식 (빈 자리 채우기) ──────────────────────────────────────────

/** 북엔드(책꽂이 고정대) 장식 컴포넌트 */
function BookEnd() {
  return (
    <div
      className="flex h-full w-6 items-end justify-center sm:w-8"
      aria-hidden="true"
    >
      <div
        className="h-16 w-4 rounded-t-sm sm:h-20 sm:w-5"
        style={{
          background: 'linear-gradient(135deg, #A08060 0%, #7A5A40 100%)',
          boxShadow: '1px 0 3px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  )
}

// ─── 빈 책장 안내 ──────────────────────────────────────────────────────────

/** 빈 책장 안내 메시지 */
function EmptyShelfMessage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <span className="text-4xl" role="img" aria-label="빈 책장">
        📖
      </span>
      <p className="text-sm" style={{ color: '#C4A882' }}>
        아직 책장이 비어있어요
      </p>
    </div>
  )
}

// ─── 선반 컴포넌트 ─────────────────────────────────────────────────────────

interface ShelfRowProps {
  children: ReactNode[]
  emptySlots: number
}

/** 개별 선반: 나무 판자 + 책들 + 북엔드 */
function ShelfRow({ children, emptySlots }: ShelfRowProps) {
  return (
    <div className="relative">
      {/* 선반 위 책 영역 */}
      <motion.div
        className="relative z-10 flex items-end gap-2 px-3 pb-1 sm:gap-3 sm:px-4"
        variants={shelfContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {children.map((child, i) => (
          <motion.div
            key={i}
            variants={bookItemVariants}
            style={{ originY: 1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            {child}
          </motion.div>
        ))}

        {/* 빈 자리에 북엔드 배치 (최소 1개, 최대 빈 슬롯 수) */}
        {emptySlots > 0 && <BookEnd />}
      </motion.div>

      {/* 나무 선반 판자 */}
      <div
        className="relative z-20 h-3 rounded-b-sm"
        style={{
          background: SHELF_PLANK_GRADIENT,
          boxShadow: SHELF_PLANK_SHADOW,
        }}
        aria-hidden="true"
      />

      {/* 선반 지지대 (양쪽 기둥) */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {/* 왼쪽 기둥 */}
        <div
          className="absolute left-0 top-0 h-full w-1.5"
          style={{
            background: 'linear-gradient(90deg, #7A5A40 0%, #8B6832 100%)',
          }}
        />
        {/* 오른쪽 기둥 */}
        <div
          className="absolute right-0 top-0 h-full w-1.5"
          style={{
            background: 'linear-gradient(270deg, #7A5A40 0%, #8B6832 100%)',
          }}
        />
      </div>
    </div>
  )
}

// ─── 메인 Bookshelf 컴포넌트 ───────────────────────────────────────────────

/**
 * 도서 책장 시각화 컴포넌트
 *
 * BookStackCard를 감싸는 컨테이너로,
 * 나무 재질의 선반 위에 책들이 정렬되는 시각 효과를 제공.
 * 선반이 가득 차면 다음 줄(선반)이 자동 생성됨.
 */
export function Bookshelf({
  children,
  totalCount,
  label = '나의 책장',
  booksPerShelf = 4,
}: BookshelfProps) {
  // children을 배열로 변환
  const childArray = Children.toArray(children)
  const hasBooks = childArray.length > 0

  // 선반 단위로 분할
  const shelves = chunkArray(childArray, booksPerShelf)

  return (
    <section
      className="w-full overflow-hidden rounded-xl border-2 p-3 sm:p-4"
      style={{
        backgroundColor: FRAME_INNER_BG,
        borderColor: FRAME_COLOR,
        // 나무 프레임 질감: 미묘한 내부 그림자
        boxShadow:
          'inset 0 2px 8px rgba(0,0,0,0.3), inset 0 -2px 8px rgba(0,0,0,0.2)',
      }}
      aria-label={`${label} - ${totalCount}권`}
      data-testid="bookshelf"
    >
      {/* 상단 헤더 */}
      <div className="mb-3 flex items-center justify-between px-1 sm:mb-4">
        <h2 className="text-base font-bold sm:text-lg" style={{ color: '#F5E6C8' }}>
          {label}
        </h2>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold sm:text-sm"
          style={{
            backgroundColor: '#C4A06A',
            color: '#3D2B1F',
          }}
        >
          {totalCount}권
        </span>
      </div>

      {/* 선반 영역 */}
      {hasBooks ? (
        <div className="flex flex-col gap-4 sm:gap-5">
          {shelves.map((shelfBooks, shelfIndex) => (
            <ShelfRow
              key={shelfIndex}
              emptySlots={booksPerShelf - shelfBooks.length}
            >
              {shelfBooks}
            </ShelfRow>
          ))}
        </div>
      ) : (
        <EmptyShelfMessage />
      )}

      {/* 하단 바닥 판자 */}
      <div
        className="mt-3 h-2 rounded-sm sm:mt-4"
        style={{
          background: SHELF_PLANK_GRADIENT,
          boxShadow: 'inset 0 -1px 3px rgba(0,0,0,0.2)',
        }}
        aria-hidden="true"
      />
    </section>
  )
}
