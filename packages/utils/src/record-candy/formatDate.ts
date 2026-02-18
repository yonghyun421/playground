/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅
 * @param dateStr ISO 형식 날짜 문자열 또는 Date 객체
 * @returns YYYY.MM.DD 형식의 날짜 문자열
 */
export const formatRecordDate = (dateStr: string | Date): string => {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}
