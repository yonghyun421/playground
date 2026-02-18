import type { Record, SortOption } from '../types/record-candy'

/**
 * SortOption에 따라 Record 배열을 정렬
 * 불변성 패턴 준수 - 원본 배열을 변경하지 않음
 * @param records 정렬할 감상 기록 배열
 * @param sort 정렬 옵션
 * @returns 정렬된 새 배열
 */
export const sortRecords = (records: Record[], sort: SortOption): Record[] => {
  // 원본 배열을 변경하지 않도록 복사 후 정렬
  return [...records].sort((a, b) => {
    switch (sort) {
      case 'newest':
        // 최신순: 생성일 내림차순
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        // 오래된순: 생성일 오름차순
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'rating-high':
        // 평점 높은순: 내림차순 (동점이면 최신순)
        if (b.rating !== a.rating) return b.rating - a.rating
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'rating-low':
        // 평점 낮은순: 오름차순 (동점이면 최신순)
        if (a.rating !== b.rating) return a.rating - b.rating
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })
}
