'use client'

// TicketCollection: 영화 티켓이 책상 위에 쌓여있는 느낌의 컬렉션 래퍼 컴포넌트
import { Children, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface TicketCollectionProps {
  /** MovieTicketCard 자식 요소들 */
  children: ReactNode
  /** 전체 영화 기록 수 */
  totalCount: number
  /** 섹션 제목 (기본: "내가 모은 티켓") */
  label?: string
}

/**
 * 인덱스 기반으로 결정론적 회전 각도를 계산한다 (-6도 ~ 6도)
 * 각 티켓이 어지럽게 흩어진 느낌을 주기 위한 것
 */
function getScatterRotation(index: number): number {
  // 소수 배수를 써서 패턴이 반복되지 않게 한다
  const seed = ((index * 7 + 3) * 13) % 120
  return ((seed - 60) / 60) * 6
}

/**
 * 인덱스 기반으로 수평 오프셋을 계산한다 (-8px ~ 8px)
 * 티켓이 정렬되지 않고 살짝 어긋나 있는 효과
 */
function getScatterX(index: number): number {
  const seed = ((index * 11 + 5) * 17) % 160
  return ((seed - 80) / 80) * 8
}

// 컨테이너 motion variants (스태거 애니메이션용)
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// 각 티켓 아이템의 motion variants
function getItemVariants(index: number) {
  const rotation = getScatterRotation(index)
  return {
    hidden: {
      opacity: 0,
      y: 30,
      rotate: rotation * 2,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: rotation,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  }
}

/**
 * 영화 티켓 컬렉션 컴포넌트
 *
 * 영화 기록이 쌓일수록 티켓이 물리적으로 쌓이는 느낌을 준다.
 * 각 티켓은 랜덤한 각도로 약간씩 겹쳐 있으며,
 * 호버 시 해당 티켓이 위로 올라오면서 강조된다.
 * viewport 진입 시 스태거 애니메이션으로 티켓이 순차 등장한다.
 *
 * 레이아웃:
 *   ┌─────────────────────────────────┐
 *   │  내가 모은 티켓  [12장]          │
 *   │                                 │
 *   │  ┌──┐ ┌──┐ ┌──┐               │
 *   │   └──┘└──┘ └──┘  (겹쳐서 배치)  │
 *   │                                 │
 *   │  총 12편의 영화를 감상했어요      │
 *   └─────────────────────────────────┘
 */
export function TicketCollection({
  children,
  totalCount,
  label = '내가 모은 티켓',
}: TicketCollectionProps) {
  const childArray = Children.toArray(children)

  return (
    <section
      data-testid="ticket-collection"
      className={[
        'relative overflow-hidden rounded-2xl',
        // 어두운 나무 테이블 느낌 배경
        'bg-gradient-to-br from-[#3E2C1C] via-[#4A3425] to-[#352318]',
        'p-4 sm:p-6 lg:p-8',
        // 테이블 질감을 위한 그림자
        'shadow-[inset_0_2px_20px_rgba(0,0,0,0.3)]',
      ].join(' ')}
    >
      {/* ──── 상단: 제목 + 티켓 수 배지 ──── */}
      <div className="mb-4 flex items-center gap-3 sm:mb-6">
        <h2 className="text-base font-bold text-[#F5EDDA] sm:text-lg">
          {label} <span aria-hidden="true">🎬</span>
        </h2>
        <span
          className={[
            'inline-flex items-center rounded-full',
            'bg-[#7C6A4E] px-2.5 py-0.5',
            'text-xs font-semibold text-[#F5EDDA]',
          ].join(' ')}
          aria-label={`총 ${totalCount}장`}
        >
          {totalCount}장
        </span>
      </div>

      {/* ──── 티켓 더미 영역 ──── */}
      {childArray.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className={[
            // 모바일: 세로 스택 (겹침 간격 줄임)
            'flex flex-col items-center gap-0 -space-y-8',
            // 태블릿+: 가로로 펼쳐진 형태
            'sm:flex-row sm:flex-wrap sm:items-start sm:justify-center sm:gap-4 sm:space-y-0 sm:-space-x-6',
            'lg:-space-x-4 lg:gap-6',
            'py-4',
          ].join(' ')}
        >
          {childArray.map((child, index) => (
            <motion.div
              key={(child as { key?: string | number }).key ?? index}
              variants={getItemVariants(index)}
              whileHover={{
                y: -12,
                zIndex: 10,
                scale: 1.05,
                rotate: 0,
                transition: { duration: 0.2 },
              }}
              style={{
                // 겹침 효과를 위한 z-index (뒤에서 앞으로)
                zIndex: index,
                // 살짝 어긋나는 수평 오프셋
                x: getScatterX(index),
              }}
              className="relative"
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // 티켓이 없을 때
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-[#8B7355]">아직 모은 티켓이 없어요</p>
        </div>
      )}

      {/* ──── 하단: 총 편수 카운터 ──── */}
      <div className="mt-4 text-center sm:mt-6">
        <p className="text-xs text-[#A89070] sm:text-sm">
          총 <span className="font-semibold text-[#F5EDDA]">{totalCount}편</span>의
          영화를 감상했어요
        </p>
      </div>
    </section>
  )
}
