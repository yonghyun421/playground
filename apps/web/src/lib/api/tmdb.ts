// TMDB 영화 검색 API 클라이언트 (한국어 결과 우선)
import type { Movie } from '@playground/utils'

// TMDB API 상수
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

// TMDB 영화 검색 결과 단건 타입
interface TMDBMovie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  genre_ids: number[]
}

// TMDB 영화 상세 응답 타입
interface TMDBMovieDetail {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  genres: { id: number; name: string }[]
  credits: {
    crew: { job: string; name: string }[]
  }
}

// TMDB 검색 API 응답 타입
interface TMDBSearchResponse {
  results: TMDBMovie[]
  total_results: number
  total_pages: number
}

/** TMDB API 키 조회 */
function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY
  if (!key) {
    throw new Error('NEXT_PUBLIC_TMDB_API_KEY 환경변수가 설정되지 않았습니다')
  }
  return key
}

/**
 * TMDB 영화 검색 (한국어 + 한국 지역 우선)
 * @param query 검색어
 * @returns Movie 배열
 */
export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return []

  const apiKey = getApiKey()
  const url = new URL(`${TMDB_BASE_URL}/search/movie`)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('query', query)
  url.searchParams.set('language', 'ko-KR')
  url.searchParams.set('region', 'KR')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`TMDB API 오류: ${response.status} ${response.statusText}`)
  }

  const data: TMDBSearchResponse = await response.json()
  return data.results.map((movie) => {
    const year = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 0
    return {
      id: String(movie.id),
      title: movie.title,
      posterUrl: movie.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
        : '',
      year: Number.isNaN(year) ? 0 : year,
      director: '',
      genres: [],
    }
  })
}

/**
 * TMDB 영화 상세 정보 조회 (감독 및 장르 포함)
 * @param id TMDB 영화 ID
 * @returns Movie 객체
 */
export async function getMovieDetail(id: string): Promise<Movie> {
  const apiKey = getApiKey()
  const url = new URL(`${TMDB_BASE_URL}/movie/${id}`)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('language', 'ko-KR')
  url.searchParams.set('append_to_response', 'credits')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`TMDB API 오류: ${response.status} ${response.statusText}`)
  }

  const data: TMDBMovieDetail = await response.json()

  const director =
    data.credits.crew.find((c) => c.job === 'Director')?.name ?? ''

  const year = data.release_date
    ? new Date(data.release_date).getFullYear()
    : 0

  return {
    id: String(data.id),
    title: data.title,
    posterUrl: data.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}`
      : '',
    year: Number.isNaN(year) ? 0 : year,
    director,
    genres: data.genres.map((g) => g.name),
  }
}
