// 카카오 책 검색 API 클라이언트
import type { Book } from '@playground/utils'

// 카카오 REST API 기본 URL
const KAKAO_API_URL = 'https://dapi.kakao.com/v3/search/book'

// 카카오 책 검색 응답 내 문서 타입
interface KakaoBookDocument {
  title: string
  contents: string
  url: string
  isbn: string
  datetime: string
  authors: string[]
  publisher: string
  translators: string[]
  price: number
  sale_price: number
  thumbnail: string
  status: string
}

// 카카오 책 검색 API 응답 타입
interface KakaoBookSearchResponse {
  meta: {
    total_count: number
    pageable_count: number
    is_end: boolean
  }
  documents: KakaoBookDocument[]
}

/** 카카오 REST API 키 조회 */
function getApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_KAKAO_REST_API_KEY 환경변수가 설정되지 않았습니다')
  }
  return apiKey
}

/** 카카오 문서를 Book 타입으로 변환 */
function documentToBook(doc: KakaoBookDocument): Book {
  // ISBN에서 고유 ID 추출 (공백으로 구분된 ISBN 중 첫 번째 사용)
  const isbn = doc.isbn.split(' ').find((v) => v.length > 0) ?? doc.isbn
  // datetime에서 연도 추출
  const year = doc.datetime ? new Date(doc.datetime).getFullYear() : 0

  return {
    id: isbn || doc.title,
    title: doc.title,
    coverUrl: doc.thumbnail,
    year: Number.isNaN(year) ? 0 : year,
    author: doc.authors[0] ?? '',
    genres: [],
  }
}

/**
 * 카카오 책 검색
 * @param query 검색어
 * @returns Book 배열
 */
export async function searchBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return []

  const apiKey = getApiKey()
  const url = new URL(KAKAO_API_URL)
  url.searchParams.set('query', query.trim())
  url.searchParams.set('size', '20')

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${apiKey}`,
    },
  })

  if (!response.ok) {
    throw new Error(
      `카카오 책 검색 API 오류: ${response.status} ${response.statusText}`
    )
  }

  const data: KakaoBookSearchResponse = await response.json()
  return data.documents.map(documentToBook)
}

/**
 * 카카오 책 상세 정보 조회 (ISBN으로 검색)
 * @param isbn ISBN 번호
 * @returns Book 객체
 */
export async function getBookDetail(isbn: string): Promise<Book> {
  const apiKey = getApiKey()
  const url = new URL(KAKAO_API_URL)
  url.searchParams.set('query', isbn)
  url.searchParams.set('target', 'isbn')
  url.searchParams.set('size', '1')

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${apiKey}`,
    },
  })

  if (!response.ok) {
    throw new Error(
      `카카오 책 검색 API 오류: ${response.status} ${response.statusText}`
    )
  }

  const data: KakaoBookSearchResponse = await response.json()
  if (data.documents.length === 0) {
    throw new Error(`ISBN "${isbn}"에 해당하는 책을 찾을 수 없습니다`)
  }

  return documentToBook(data.documents[0]!)
}
