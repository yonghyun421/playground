'use client'

// RecordFormModal: 감상 기록 작성/수정 모달 컴포넌트
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { EmotionTag } from '@playground/ui'
import { useRecordStore } from '@/lib/store/record-store'
import { generateId } from '@playground/utils'
import type { Work, WorkType, Record, EmotionTag as EmotionTagType } from '@playground/utils'

// ==========================================
// 폼 스키마 및 타입 정의
// ==========================================

/** 지원하는 감정 태그 목록 */
const EMOTION_TAGS: EmotionTagType[] = [
  'happy',
  'sad',
  'inspired',
  'thrilled',
  'peaceful',
  'nostalgic',
  'moved',
  'funny',
]

/** 기록 폼 Zod 스키마 */
const recordFormSchema = z.object({
  rating: z.number().min(1, '평점을 선택해주세요').max(10),
  reviewDate: z.string().min(1, '감상 날짜를 선택해주세요'),
  oneLineReview: z
    .string()
    .max(100, '100자 이내로 입력해주세요')
    .optional()
    .or(z.literal('')),
  emotionTags: z.array(
    z.enum(['happy', 'sad', 'inspired', 'thrilled', 'peaceful', 'nostalgic', 'moved', 'funny'])
  ),
  rewatchIntent: z.boolean(),
})

type RecordFormValues = z.infer<typeof recordFormSchema>

// ==========================================
// 컴포넌트 Props
// ==========================================

interface RecordFormModalProps {
  /** 모달 열림 상태 */
  open: boolean
  /** 모달 열림 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void
  /** 선택된 작품 정보 */
  work: Work
  /** 작품 유형 */
  workType: WorkType
  /** 수정 모드일 때 기존 기록 */
  existingRecord?: Record
}

// ==========================================
// RecordFormModal 컴포넌트
// ==========================================

/**
 * 감상 기록 작성/수정 모달
 * - 작성 모드: existingRecord 없음 → addRecord 호출
 * - 수정 모드: existingRecord 있음 → updateRecord 호출
 */
export function RecordFormModal({
  open,
  onOpenChange,
  work,
  workType,
  existingRecord,
}: RecordFormModalProps) {
  const { addRecord, updateRecord } = useRecordStore()
  const [calendarOpen, setCalendarOpen] = useState(false)

  const isEditMode = existingRecord !== undefined

  // react-hook-form 초기화 (기존 기록이 있으면 기본값으로 설정)
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RecordFormValues>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      rating: existingRecord?.rating ?? 5,
      reviewDate: existingRecord?.reviewDate ?? '',
      oneLineReview: existingRecord?.oneLineReview ?? '',
      emotionTags: existingRecord?.emotionTags ?? [],
      rewatchIntent: existingRecord?.rewatchIntent ?? false,
    },
  })

  const watchedRating = watch('rating')
  const watchedReviewDate = watch('reviewDate')
  const watchedEmotionTags = watch('emotionTags')
  const watchedRewatchIntent = watch('rewatchIntent')

  /** 감정 태그 토글 (선택/해제) */
  const handleEmotionTagToggle = (tag: EmotionTagType) => {
    const current = watchedEmotionTags
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag]
    setValue('emotionTags', updated)
  }

  /** 폼 제출 처리 */
  const onSubmit = (data: RecordFormValues) => {
    if (isEditMode && existingRecord) {
      // 수정 모드: updateRecord 호출
      updateRecord(existingRecord.id, {
        rating: data.rating,
        reviewDate: data.reviewDate,
        oneLineReview: data.oneLineReview || undefined,
        emotionTags: data.emotionTags,
        rewatchIntent: data.rewatchIntent,
      })
    } else {
      // 작성 모드: addRecord 호출
      addRecord({
        id: generateId(),
        work,
        workType,
        rating: data.rating,
        reviewDate: data.reviewDate,
        oneLineReview: data.oneLineReview || undefined,
        emotionTags: data.emotionTags,
        rewatchIntent: data.rewatchIntent,
      })
    }

    onOpenChange(false)
  }

  // 작품 제목 추출
  const workTitle = work.title

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {isEditMode ? '기록 수정' : '감상 기록 남기기'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {workType === 'movie' ? '🎬' : '📚'} {workTitle}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* 평점 슬라이더 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                평점 <span className="text-destructive">*</span>
              </label>
              <span className="text-lg font-bold text-primary">
                {watchedRating} / 10
              </span>
            </div>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[field.value]}
                  onValueChange={(vals) => field.onChange(vals[0])}
                  className="w-full"
                />
              )}
            />
            {errors.rating && (
              <p className="text-xs text-destructive">{errors.rating.message}</p>
            )}
          </div>

          {/* 감상 날짜 선택 (Calendar + Popover) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              감상 날짜 <span className="text-destructive">*</span>
            </label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={[
                    'flex w-full items-center gap-2 rounded-xl border border-border',
                    'bg-input px-3 py-2 text-sm',
                    'transition-all duration-200 hover:border-primary/50',
                    'focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    !watchedReviewDate ? 'text-muted-foreground' : 'text-foreground',
                  ].join(' ')}
                >
                  <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {watchedReviewDate
                    ? format(new Date(watchedReviewDate), 'yyyy년 MM월 dd일', { locale: ko })
                    : '날짜를 선택해주세요'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watchedReviewDate ? new Date(watchedReviewDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setValue('reviewDate', date.toISOString())
                      setCalendarOpen(false)
                    }
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.reviewDate && (
              <p className="text-xs text-destructive">{errors.reviewDate.message}</p>
            )}
          </div>

          {/* 한줄 감상 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                한줄 감상 <span className="text-xs text-muted-foreground">(선택)</span>
              </label>
              <span className="text-xs text-muted-foreground">
                {watch('oneLineReview')?.length ?? 0} / 100
              </span>
            </div>
            <Controller
              name="oneLineReview"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="이 작품을 한 문장으로 표현한다면?"
                  maxLength={100}
                  rows={2}
                  className="resize-none rounded-xl"
                />
              )}
            />
            {errors.oneLineReview && (
              <p className="text-xs text-destructive">{errors.oneLineReview.message}</p>
            )}
          </div>

          {/* 감정 태그 다중 선택 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              감정 태그 <span className="text-xs text-muted-foreground">(선택, 복수 선택 가능)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTION_TAGS.map((tag) => (
                <EmotionTag
                  key={tag}
                  emotion={tag}
                  selected={watchedEmotionTags.includes(tag)}
                  onClick={() => handleEmotionTagToggle(tag)}
                  size="md"
                />
              ))}
            </div>
          </div>

          {/* 재감상 의향 토글 */}
          <div className="flex items-center justify-between rounded-xl bg-muted p-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {workType === 'movie' ? '재관람' : '재독'} 의향
              </span>
              <span className="text-xs text-muted-foreground">
                다시 {workType === 'movie' ? '보고' : '읽고'} 싶으신가요?
              </span>
            </div>
            <Toggle
              pressed={watchedRewatchIntent}
              onPressedChange={(pressed) => setValue('rewatchIntent', pressed)}
              variant="outline"
              className={[
                'min-w-16 rounded-xl font-medium transition-all duration-200',
                watchedRewatchIntent
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground',
              ].join(' ')}
              aria-label="재감상 의향 토글"
            >
              {watchedRewatchIntent ? '있음' : '없음'}
            </Toggle>
          </div>

          {/* 제출 버튼 */}
          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className={[
                'rounded-xl px-4 py-2 text-sm font-medium',
                'bg-muted text-muted-foreground',
                'hover:bg-muted/80 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              ].join(' ')}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={[
                'rounded-xl px-6 py-2 text-sm font-semibold',
                'bg-primary text-primary-foreground',
                'hover:opacity-90 hover:shadow-md transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              {isEditMode ? '수정 완료' : '기록 저장'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
