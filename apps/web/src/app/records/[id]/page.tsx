'use client'

// /records/[id] 상세 페이지 - 감상 기록 상세 보기
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { RatingDisplay, EmotionTag } from '@playground/ui'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { RecordFormModal } from '@/components/records/record-form-modal'
import { useRecordStore } from '@/lib/store/record-store'
import { formatRecordDate } from '@playground/utils'
import type { Movie, Book } from '@playground/utils'
import { ArrowLeftIcon, PencilIcon, TrashIcon } from 'lucide-react'

/** 영화/책 기록에서 이미지 URL 추출 */
function getImageUrl(work: Movie | Book, workType: 'movie' | 'book'): string {
  if (workType === 'movie') {
    return (work as Movie).posterUrl
  }
  return (work as Book).coverUrl
}

/** 영화/책에서 제작자 이름 추출 */
function getCreatorName(work: Movie | Book, workType: 'movie' | 'book'): string {
  if (workType === 'movie') {
    return `감독: ${(work as Movie).director}`
  }
  return `저자: ${(work as Book).author}`
}

/**
 * /records/[id] 상세 페이지
 * - 작품 정보 + 내 기록 상세 표시
 * - 편집 버튼: RecordFormModal 열기
 * - 삭제 버튼: 확인 다이얼로그 → deleteRecord
 */
export default function RecordDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? ''

  const { getRecordById, deleteRecord } = useRecordStore()
  const record = getRecordById(id)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // 기록이 없는 경우 (삭제됐거나 잘못된 ID)
  if (!record) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pb-20 md:pb-0">
        <span className="text-5xl" aria-hidden="true">😢</span>
        <h1 className="text-xl font-semibold text-foreground">기록을 찾을 수 없어요</h1>
        <p className="text-sm text-muted-foreground">삭제되었거나 잘못된 경로입니다</p>
        <button
          type="button"
          onClick={() => router.push('/archive')}
          className={[
            'rounded-xl px-6 py-2.5 text-sm font-semibold',
            'bg-primary text-primary-foreground',
            'hover:opacity-90 transition-all duration-200',
          ].join(' ')}
        >
          아카이브로 이동
        </button>
      </div>
    )
  }

  const imageUrl = getImageUrl(record.work, record.workType)
  const creatorName = getCreatorName(record.work, record.workType)

  /** 삭제 확인 후 기록 삭제 */
  const handleDelete = () => {
    deleteRecord(record.id)
    setDeleteDialogOpen(false)
    router.push('/archive')
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <button
          type="button"
          onClick={() => router.back()}
          className={[
            'mb-6 flex items-center gap-2 text-sm font-medium',
            'text-muted-foreground hover:text-foreground',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg',
          ].join(' ')}
          aria-label="이전 페이지로 이동"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          뒤로가기
        </button>

        {/* 작품 정보 + 기록 */}
        <div className="rounded-3xl bg-card border border-border shadow-sm overflow-hidden">
          {/* 포스터/커버 상단 배너 */}
          <div className="relative h-48 overflow-hidden bg-muted sm:h-64">
            <img
              src={imageUrl}
              alt={`${record.work.title} 포스터`}
              className="w-full h-full object-cover object-center opacity-60"
              loading="eager"
            />
            {/* 그라디언트 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

            {/* 작품 타입 배지 */}
            <span className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
              {record.workType === 'movie' ? '🎬 영화' : '📚 도서'}
            </span>

            {/* 작품 포스터 (좌측 하단 겹치기) */}
            <div className="absolute bottom-0 left-6 translate-y-1/3">
              <div className="h-28 w-20 overflow-hidden rounded-xl border-2 border-card shadow-lg sm:h-36 sm:w-24">
                <img
                  src={imageUrl}
                  alt={`${record.work.title} 포스터`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 작품 정보 + 내 기록 */}
          <div className="px-6 pt-16 pb-6 sm:pt-20">
            {/* 작품 기본 정보 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {record.work.title}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{record.work.year}년</span>
                <span aria-hidden="true">·</span>
                <span>{creatorName}</span>
              </div>
              {record.work.genres.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {record.work.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 구분선 */}
            <div className="mb-6 border-t border-border" />

            {/* 내 기록 */}
            <div className="flex flex-col gap-5">
              {/* 평점 (큰 사이즈) */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  평점
                </p>
                <RatingDisplay rating={record.rating} size="lg" showNumber />
              </div>

              {/* 한줄 감상 */}
              {record.oneLineReview && (
                <div>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    한줄 감상
                  </p>
                  <blockquote className="border-l-4 border-primary pl-4 italic text-foreground">
                    {record.oneLineReview}
                  </blockquote>
                </div>
              )}

              {/* 감정 태그 */}
              {record.emotionTags.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    감정 태그
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {record.emotionTags.map((tag) => (
                      <EmotionTag
                        key={tag}
                        emotion={tag}
                        selected
                        size="md"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 재감상 의향 + 감상 날짜 */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    재감상 의향
                  </p>
                  <span
                    className={[
                      'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
                      record.rewatchIntent
                        ? 'bg-primary/20 text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    ].join(' ')}
                  >
                    {record.rewatchIntent ? '✓ 있음' : '✗ 없음'}
                  </span>
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    감상 날짜
                  </p>
                  <time
                    dateTime={record.reviewDate}
                    className="text-sm text-foreground"
                  >
                    {formatRecordDate(record.reviewDate)}
                  </time>
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="my-6 border-t border-border" />

            {/* 액션 버튼 */}
            <div className="flex items-center justify-end gap-3">
              {/* 편집 버튼 */}
              <button
                type="button"
                onClick={() => setEditModalOpen(true)}
                className={[
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold',
                  'bg-secondary text-secondary-foreground',
                  'hover:opacity-90 hover:shadow-sm transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                ].join(' ')}
                aria-label="감상 기록 편집"
              >
                <PencilIcon className="h-4 w-4" aria-hidden="true" />
                편집
              </button>

              {/* 삭제 버튼 */}
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(true)}
                className={[
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold',
                  'bg-destructive/10 text-destructive',
                  'hover:bg-destructive/20 hover:shadow-sm transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                ].join(' ')}
                aria-label="감상 기록 삭제"
              >
                <TrashIcon className="h-4 w-4" aria-hidden="true" />
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 편집 모달 */}
      {editModalOpen && (
        <RecordFormModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          work={record.work}
          workType={record.workType}
          existingRecord={record}
        />
      )}

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>기록 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{record.work.title}</strong>의 감상 기록을
            삭제할까요? 이 작업은 되돌릴 수 없습니다.
          </p>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setDeleteDialogOpen(false)}
              className={[
                'rounded-xl px-4 py-2 text-sm font-medium',
                'bg-muted text-muted-foreground hover:bg-muted/80',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              ].join(' ')}
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className={[
                'rounded-xl px-4 py-2 text-sm font-semibold',
                'bg-destructive text-white',
                'hover:opacity-90 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              ].join(' ')}
            >
              삭제
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
