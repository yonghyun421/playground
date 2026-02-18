// ==========================================
// Record Candy 핵심 타입/인터페이스 정의
// ==========================================

/** 감정 태그 - 감상 후 느낀 감정 */
export type EmotionTag =
  | 'happy'
  | 'sad'
  | 'inspired'
  | 'thrilled'
  | 'peaceful'
  | 'nostalgic'
  | 'moved'
  | 'funny'

/** 작품 유형 - 영화 또는 책 */
export type WorkType = 'movie' | 'book'

/** 영화 정보 */
export interface Movie {
  id: string
  title: string
  posterUrl: string
  year: number
  director: string
  genres: string[]
}

/** 책 정보 */
export interface Book {
  id: string
  title: string
  coverUrl: string
  year: number
  author: string
  genres: string[]
}

/** 작품 유니온 타입 */
export type Work = Movie | Book

/** 감상 기록 */
export interface Record {
  id: string
  work: Work
  workType: WorkType
  /** 평점 (1-10) */
  rating: number
  /** 감상 날짜 (ISO 형식) */
  reviewDate: string
  /** 한 줄 감상평 */
  oneLineReview?: string
  /** 감정 태그 목록 */
  emotionTags: EmotionTag[]
  /** 재감상 의향 */
  rewatchIntent: boolean
  /** 생성 시각 (ISO 형식) */
  createdAt: string
  /** 수정 시각 (ISO 형식) */
  updatedAt: string
}

/** 기록 필터 옵션 */
export interface RecordFilter {
  workType?: WorkType
  ratingMin?: number
  ratingMax?: number
  year?: number
  emotionTags?: EmotionTag[]
}

/** 정렬 옵션 */
export type SortOption = 'newest' | 'oldest' | 'rating-high' | 'rating-low'
