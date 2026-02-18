// 카카오 책 검색 API 클라이언트 단위 테스트
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchBooks, getBookDetail } from '../lib/api/openlib'

// fetch 전역 모킹
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// 환경변수 모킹
vi.stubEnv('NEXT_PUBLIC_KAKAO_REST_API_KEY', 'test-kakao-api-key')

// 테스트용 카카오 책 검색 응답 데이터
const mockSearchResponse = {
  meta: {
    total_count: 2,
    pageable_count: 2,
    is_end: true,
  },
  documents: [
    {
      title: '해리 포터와 마법사의 돌',
      contents: '마법사 해리 포터의 이야기',
      url: 'https://search.daum.net/book/1',
      isbn: '8983920718 9788983920713',
      datetime: '1999-12-01T00:00:00.000+09:00',
      authors: ['J.K. 롤링'],
      publisher: '문학수첩',
      translators: ['김혜원'],
      price: 9800,
      sale_price: 8820,
      thumbnail: 'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F521484',
      status: '',
    },
    {
      title: '반지의 제왕',
      contents: '중간계의 모험',
      url: 'https://search.daum.net/book/2',
      isbn: '8983920726',
      datetime: '2001-11-01T00:00:00.000+09:00',
      authors: ['J.R.R. 톨킨'],
      publisher: '씨앗을뿌리는사람',
      translators: [],
      price: 12000,
      sale_price: -1,
      thumbnail: '',
      status: '',
    },
  ],
}

describe('카카오 책 검색 API 클라이언트', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('searchBooks', () => {
    it('검색어로 책 목록을 반환한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      const books = await searchBooks('해리 포터')

      expect(books).toHaveLength(2)
      expect(books[0]).toMatchObject({
        id: '8983920718',
        title: '해리 포터와 마법사의 돌',
        author: 'J.K. 롤링',
        year: 1999,
      })
    })

    it('Authorization 헤더에 KakaoAK 접두사가 포함된다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      await searchBooks('테스트')

      const callArgs = mockFetch.mock.calls[0]!
      const options = callArgs[1] as RequestInit
      expect((options.headers as Record<string, string>)['Authorization']).toBe(
        'KakaoAK test-kakao-api-key'
      )
    })

    it('썸네일 URL이 coverUrl로 매핑된다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      const books = await searchBooks('해리 포터')

      expect(books[0]!.coverUrl).toContain('kakaocdn.net')
    })

    it('썸네일이 없으면 빈 문자열을 반환한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      const books = await searchBooks('해리 포터')

      expect(books[1]!.coverUrl).toBe('')
    })

    it('ISBN에서 첫 번째 값을 ID로 사용한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      const books = await searchBooks('해리 포터')

      // '8983920718 9788983920713'에서 첫 번째 ISBN 추출
      expect(books[0]!.id).toBe('8983920718')
    })

    it('datetime에서 연도를 추출한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      const books = await searchBooks('해리 포터')

      expect(books[0]!.year).toBe(1999)
      expect(books[1]!.year).toBe(2001)
    })

    it('빈 검색어는 빈 배열을 반환한다', async () => {
      const books = await searchBooks('')
      expect(books).toHaveLength(0)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('공백만 있는 검색어는 빈 배열을 반환한다', async () => {
      const books = await searchBooks('   ')
      expect(books).toHaveLength(0)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('API 오류 시 예외를 던진다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      })

      await expect(searchBooks('해리 포터')).rejects.toThrow(
        '카카오 책 검색 API 오류: 401'
      )
    })
  })

  describe('getBookDetail', () => {
    const mockDetailResponse = {
      meta: { total_count: 1, pageable_count: 1, is_end: true },
      documents: [mockSearchResponse.documents[0]],
    }

    it('ISBN으로 책 상세 정보를 반환한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDetailResponse),
      })

      const book = await getBookDetail('8983920718')

      expect(book).toMatchObject({
        title: '해리 포터와 마법사의 돌',
        author: 'J.K. 롤링',
      })
    })

    it('ISBN target 파라미터로 검색한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDetailResponse),
      })

      await getBookDetail('8983920718')

      const calledUrl = mockFetch.mock.calls[0]![0] as string
      expect(calledUrl).toContain('target=isbn')
      expect(calledUrl).toContain('query=8983920718')
    })

    it('결과가 없으면 예외를 던진다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            meta: { total_count: 0, pageable_count: 0, is_end: true },
            documents: [],
          }),
      })

      await expect(getBookDetail('0000000000')).rejects.toThrow(
        '해당하는 책을 찾을 수 없습니다'
      )
    })

    it('API 오류 시 예외를 던진다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(getBookDetail('8983920718')).rejects.toThrow(
        '카카오 책 검색 API 오류: 500'
      )
    })
  })
})
