'use client'

// /archive 아카이브 페이지 - 전체 감상 기록 목록
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import {
  MovieTicketCard,
  BookStackCard,
  TicketCollection,
  Bookshelf,
  RecordSpine,
  RecordSpineStack,
  EmptyState,
  FilterBar,
  SortSelect,
} from '@playground/ui'
import { useRecordStore } from '@/lib/store/record-store'
import { useFilterStore } from '@/lib/store/filter-store'
import { filterRecords, sortRecords, formatRecordDate } from '@playground/utils'
import type { Movie, Book, WorkType, SortOption } from '@playground/utils'

/** 작품 유형 필터 옵션 */
const WORK_TYPE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'movie', label: '🎬 영화' },
  { value: 'book', label: '📖 도서' },
]

/** 정렬 옵션 */
const SORT_OPTIONS = [
  { value: 'newest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'rating-high', label: '평점 높은순' },
  { value: 'rating-low', label: '평점 낮은순' },
]

/**
 * /archive 아카이브 페이지
 * - FilterBar: 유형(전체/영화/책) 필터
 * - SortSelect: 정렬 옵션
 * - workType에 따라 MovieTicketCard 또는 BookStackCard 렌더링
 *   - movie: 세로 리스트 (티켓 카드가 가로형이므로)
 *   - book: 그리드 (스택 카드가 세로형이므로)
 *   - all: 영화 섹션 + 도서 섹션 분리 표시
 */
export default function ArchivePage() {
  const router = useRouter()
  const records = useRecordStore((state) => state.records)
  const { filter, sort, setFilter, setSort } = useFilterStore()

  /** 현재 선택된 workType 필터 값 (FilterBar용) */
  const activeWorkType = filter.workType ?? 'all'

  /** 필터 변경 처리 */
  const handleWorkTypeChange = (value: string) => {
    if (value === 'all') {
      // 전체 선택 시 workType 필터 제거
      setFilter({ ...filter, workType: undefined })
    } else {
      setFilter({ ...filter, workType: value as WorkType })
    }
  }

  /** 정렬 변경 처리 */
  const handleSortChange = (value: string) => {
    setSort(value as SortOption)
  }

  // 필터 + 정렬 적용 (불변성 패턴)
  const filteredAndSorted = useMemo(() => {
    const filtered = filterRecords(records, filter)
    return sortRecords(filtered, sort)
  }, [records, filter, sort])

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">아카이브</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            나의 모든 감상 기록 ({records.length}개)
          </p>
        </div>

        {/* 필터 + 정렬 컨트롤 */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <FilterBar
            options={WORK_TYPE_OPTIONS}
            activeValue={activeWorkType}
            onChange={handleWorkTypeChange}
          />
          <SortSelect
            options={SORT_OPTIONS}
            value={sort}
            onChange={handleSortChange}
            className="self-end sm:self-auto"
          />
        </div>

        {/* 기록 목록 */}
        {filteredAndSorted.length === 0 ? (
          // 빈 상태
          <EmptyState
            icon={records.length === 0 ? '🍬' : '🔍'}
            message={
              records.length === 0
                ? '아직 기록이 없어요'
                : '검색 결과가 없어요'
            }
            description={
              records.length === 0
                ? '첫 번째 감상 기록을 남겨보세요!'
                : '다른 필터를 선택해보세요'
            }
            actionLabel={records.length === 0 ? '검색하러 가기' : undefined}
            onAction={
              records.length === 0
                ? () => router.push('/search')
                : undefined
            }
          />
        ) : activeWorkType === 'movie' ? (
          // 영화 필터: TicketCollection으로 티켓 더미 시각화
          <TicketCollection totalCount={filteredAndSorted.length}>
            {filteredAndSorted.map((record) => (
              <MovieTicketCard
                key={record.id}
                id={record.id}
                title={record.work.title}
                posterUrl={(record.work as Movie).posterUrl}
                year={record.work.year ?? 0}
                director={(record.work as Movie).director ?? ''}
                rating={record.rating}
                emotionTags={record.emotionTags}
                oneLineReview={record.oneLineReview}
                reviewDate={formatRecordDate(record.reviewDate)}
                onClick={() => router.push(`/records/${record.id}`)}
              />
            ))}
          </TicketCollection>
        ) : activeWorkType === 'book' ? (
          // 도서 필터: Bookshelf로 감싸서 책장 시각화
          <Bookshelf totalCount={filteredAndSorted.length}>
            {filteredAndSorted.map((record) => (
              <BookStackCard
                key={record.id}
                id={record.id}
                title={record.work.title}
                coverUrl={(record.work as Book).coverUrl}
                author={(record.work as Book).author ?? ''}
                year={record.work.year ?? 0}
                rating={record.rating}
                emotionTags={record.emotionTags}
                oneLineReview={record.oneLineReview}
                reviewDate={formatRecordDate(record.reviewDate)}
                onClick={() => router.push(`/records/${record.id}`)}
              />
            ))}
          </Bookshelf>
        ) : (
          // 전체 필터: RecordSpineStack으로 모든 기록을 책등 바로 시각화
          <RecordSpineStack
            totalCount={filteredAndSorted.length}
            label="전체 감상 기록"
          >
            {filteredAndSorted.map((record) => {
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
        )}
      </div>
    </div>
  )
}
