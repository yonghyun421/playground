import type { Record, RecordFilter } from '../types/record-candy'

/**
 * RecordFilter를 적용해 Record 배열을 필터링
 * 불변성 패턴 준수 - 원본 배열을 변경하지 않음
 * @param records 필터링할 감상 기록 배열
 * @param filter 적용할 필터 옵션
 * @returns 필터가 적용된 새 배열
 */
export const filterRecords = (
  records: Record[],
  filter: RecordFilter
): Record[] => {
  return records.filter((record) => {
    // 작품 유형 필터
    if (filter.workType !== undefined && record.workType !== filter.workType) {
      return false
    }

    // 최소 평점 필터
    if (filter.ratingMin !== undefined && record.rating < filter.ratingMin) {
      return false
    }

    // 최대 평점 필터
    if (filter.ratingMax !== undefined && record.rating > filter.ratingMax) {
      return false
    }

    // 연도 필터 (작품 제작 연도 기준)
    if (filter.year !== undefined && record.work.year !== filter.year) {
      return false
    }

    // 감정 태그 필터 (지정된 태그 중 하나라도 포함하면 통과)
    if (filter.emotionTags !== undefined && filter.emotionTags.length > 0) {
      const hasMatchingTag = filter.emotionTags.some((tag) =>
        record.emotionTags.includes(tag)
      )
      if (!hasMatchingTag) {
        return false
      }
    }

    return true
  })
}
