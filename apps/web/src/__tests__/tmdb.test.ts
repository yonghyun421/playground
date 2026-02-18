// 영화 검색 API 클라이언트 단위 테스트 (TMDB 기반)
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { searchMovies, getMovieDetail } from '../lib/api/tmdb'

// fetch 전역 모킹
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// 테스트용 TMDB 응답 데이터
const mockSearchResponse = {
  results: [
    {
      id: 496243,
      title: '기생충',
      poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
      release_date: '2019-05-30',
      genre_ids: [35, 53, 18],
    },
    {
      id: 27205,
      title: '인셉션',
      poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      release_date: '2010-07-15',
      genre_ids: [28, 878, 12],
    },
  ],
  total_results: 2,
  total_pages: 1,
}

const mockMovieDetail = {
  id: 496243,
  title: '기생충',
  poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
  release_date: '2019-05-30',
  genres: [
    { id: 35, name: '코미디' },
    { id: 53, name: '스릴러' },
  ],
  credits: {
    crew: [
      { job: 'Director', name: '봉준호' },
      { job: 'Producer', name: '곽신애' },
    ],
  },
}

describe('영화 검색 API 클라이언트', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_TMDB_API_KEY', 'test-tmdb-key')
    vi.stubEnv('NEXT_PUBLIC_KAKAO_REST_API_KEY', 'test-kakao-key')
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('searchMovies', () => {
    it('검색어로 영화 목록을 반환한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      const movies = await searchMovies('기생충')

      expect(movies).toHaveLength(2)
      expect(movies[0]).toMatchObject({
        id: '496243',
        title: '기생충',
        year: 2019,
      })
    })

    it('포스터 URL이 올바르게 생성된다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      const movies = await searchMovies('기생충')

      expect(movies[0]!.posterUrl).toBe(
        'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'
      )
    })

    it('포스터가 없으면 빈 문자열을 반환한다', async () => {
      const responseWithNoPoster = {
        results: [{ ...mockSearchResponse.results[0], poster_path: null }],
        total_results: 1,
        total_pages: 1,
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseWithNoPoster),
      })

      const movies = await searchMovies('기생충')

      expect(movies[0]!.posterUrl).toBe('')
    })

    it('빈 검색어는 빈 배열을 반환한다', async () => {
      const movies = await searchMovies('')
      expect(movies).toHaveLength(0)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('공백만 있는 검색어는 빈 배열을 반환한다', async () => {
      const movies = await searchMovies('   ')
      expect(movies).toHaveLength(0)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('API 오류 시 예외를 던진다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      })

      await expect(searchMovies('기생충')).rejects.toThrow('TMDB API 오류: 401')
    })

    it('한국어 언어 파라미터가 URL에 포함된다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResponse),
      })

      await searchMovies('기생충')

      const calledUrl = mockFetch.mock.calls[0]![0] as string
      expect(calledUrl).toContain('language=ko-KR')
    })

    it('API 키가 없으면 예외를 던진다', async () => {
      vi.stubEnv('NEXT_PUBLIC_TMDB_API_KEY', '')

      await expect(searchMovies('기생충')).rejects.toThrow(
        'NEXT_PUBLIC_TMDB_API_KEY'
      )
    })
  })

  describe('getMovieDetail', () => {
    it('영화 상세 정보를 반환한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMovieDetail),
      })

      const movie = await getMovieDetail('496243')

      expect(movie).toMatchObject({
        id: '496243',
        title: '기생충',
        year: 2019,
        director: '봉준호',
        genres: ['코미디', '스릴러'],
      })
    })

    it('크레딧에 감독이 없으면 빈 문자열을 반환한다', async () => {
      const detailWithoutDirector = {
        ...mockMovieDetail,
        credits: { crew: [{ job: 'Producer', name: '곽신애' }] },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(detailWithoutDirector),
      })

      const movie = await getMovieDetail('496243')

      expect(movie.director).toBe('')
    })

    it('출시일이 없으면 year가 0이다', async () => {
      const detailWithoutDate = {
        ...mockMovieDetail,
        release_date: '',
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(detailWithoutDate),
      })

      const movie = await getMovieDetail('496243')

      expect(movie.year).toBe(0)
    })

    it('API 오류 시 예외를 던진다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(getMovieDetail('999999')).rejects.toThrow('TMDB API 오류: 404')
    })
  })
})
