'use client'

// Record Candy 홈 페이지
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { EmptyState, RecordSpine, RecordSpineStack } from '@playground/ui'
import { useRecordStore } from '@/lib/store/record-store'
import { formatRecordDate } from '@playground/utils'
import type { Movie, Book } from '@playground/utils'

/**
 * Record Candy 홈 페이지
 * - 히어로 섹션: 타이틀 + 서브텍스트
 * - 요약 통계: 총 기록 수, 영화 수, 책 수, 평균 평점
 * - 최근 영화: MovieTicketCard 최대 3개 가로 스크롤
 * - 최근 도서: BookStackCard 최대 5개 가로 스크롤
 */
export default function HomePage() {
  const router = useRouter()
  const records = useRecordStore((state) => state.records)

  // 통계 계산 (불변성 패턴)
  const stats = useMemo(() => {
    const totalCount = records.length
    const movieCount = records.filter((r) => r.workType === 'movie').length
    const bookCount = records.filter((r) => r.workType === 'book').length
    const avgRating =
      totalCount > 0
        ? records.reduce((sum, r) => sum + r.rating, 0) / totalCount
        : 0

    return { totalCount, movieCount, bookCount, avgRating }
  }, [records])

  // 최근 기록 최신순 정렬 후 영화/도서 분리
  const sortedRecords = useMemo(
    () =>
      [...records].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [records]
  )

  // 최근 기록 최대 10개 (영화+도서 혼합)
  const recentRecords = useMemo(
    () => sortedRecords.slice(0, 10),
    [sortedRecords]
  )

  // 기록이 하나도 없으면 빈 상태 표시
  const hasNoRecords = records.length === 0

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20 px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Record Candy 🍬
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            영화와 책의 달콤한 기록
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            감상했던 작품의 기억을 달콤하게 기록해 보세요
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* 요약 통계 카드 */}
        <section aria-label="감상 기록 통계" className="mb-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon="📚"
              label="총 기록"
              value={stats.totalCount}
              unit="개"
            />
            <StatCard
              icon="🎬"
              label="영화"
              value={stats.movieCount}
              unit="편"
            />
            <StatCard
              icon="📖"
              label="도서"
              value={stats.bookCount}
              unit="권"
            />
            <StatCard
              icon="⭐"
              label="평균 평점"
              value={
                stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '-'
              }
              unit={stats.avgRating > 0 ? '/ 10' : ''}
            />
          </div>
        </section>

        {/* 최근 기록 섹션 */}
        {hasNoRecords ? (
          // 기록이 전혀 없을 때 빈 상태
          <section aria-label="최근 감상 기록">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">최근 기록</h2>
            </div>
            <EmptyState
              icon="🍬"
              message="아직 기록이 없어요"
              description="영화나 책을 감상하고 첫 번째 기록을 남겨보세요!"
              actionLabel="검색하러 가기"
              onAction={() => router.push('/search')}
            />
          </section>
        ) : (
          <section aria-label="최근 감상 기록">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                최근 기록
              </h2>
              <button
                type="button"
                onClick={() => router.push('/archive')}
                className="text-sm font-medium text-primary hover:underline focus:outline-none"
              >
                전체 보기 →
              </button>
            </div>
            {/* 책등 쌓기 시각화: 기록이 파스텔 바로 쌓이는 효과 */}
            <RecordSpineStack
              totalCount={stats.totalCount}
              label="최근 감상 기록"
            >
              {recentRecords.map((record) => {
                const subtitle =
                  record.workType === 'movie'
                    ? (record.work as Movie).director ?? ''
                    : (record.work as Book).author ?? ''
                return (
                  <RecordSpine
                    key={record.id}
                    id={record.id}
                    title={record.work.title}
                    subtitle={subtitle}
                    workType={record.workType}
                    rating={record.rating}
                    emotionTags={record.emotionTags}
                    oneLineReview={record.oneLineReview}
                    reviewDate={formatRecordDate(record.reviewDate)}
                    onClick={() => router.push(`/records/${record.id}`)}
                  />
                )
              })}
            </RecordSpineStack>
          </section>
        )}
      </div>
    </div>
  )
}

// ==========================================
// 통계 카드 컴포넌트
// ==========================================

interface StatCardProps {
  icon: string
  label: string
  value: number | string
  unit: string
}

/** 통계 카드 컴포넌트 */
function StatCard({ icon, label, value, unit }: StatCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-card p-4 shadow-sm border border-border">
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        {unit && (
          <span className="text-xs text-muted-foreground">{unit}</span>
        )}
      </div>
    </div>
  )
}
