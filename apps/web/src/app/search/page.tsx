'use client'

// 작품 검색 페이지 - 영화(TMDB) / 책(Open Library) 탭 전환 및 검색 기능
import { useState, useEffect, useCallback } from 'react'
import { SearchResultCard } from '@playground/ui'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { RecordFormModal } from '@/components/records/record-form-modal'
import { searchMovies } from '@/lib/api/tmdb'
import { searchBooks } from '@/lib/api/openlib'
import { useSearchStore } from '@/lib/store/search-store'
import type { Movie, Book, WorkType } from '@playground/utils'

// 탭 타입 정의
type SearchTab = 'movie' | 'book'

/** 로딩 스피너 컴포넌트 */
function LoadingSpinner() {
  return (
    <div
      className="flex items-center justify-center py-16"
      role="status"
      aria-label="검색 중"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="ml-3 text-sm text-muted-foreground">검색 중...</span>
    </div>
  )
}

/** 빈 결과 컴포넌트 */
function EmptyResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl">🔍</span>
      <p className="mt-3 text-base font-medium text-foreground">
        검색 결과가 없습니다
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        &quot;{query}&quot;에 대한 결과를 찾을 수 없어요.
      </p>
    </div>
  )
}

/** 에러 메시지 컴포넌트 */
function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center"
      role="alert"
    >
      <span className="text-4xl">⚠️</span>
      <p className="mt-3 text-base font-medium text-destructive">
        검색 중 오류가 발생했습니다
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

/** 초기 안내 컴포넌트 */
function SearchPrompt({ tab }: { tab: SearchTab }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl">{tab === 'movie' ? '🎬' : '📚'}</span>
      <p className="mt-4 text-base font-medium text-foreground">
        {tab === 'movie' ? '영화를 검색해보세요' : '책을 검색해보세요'}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        제목, 감독, 배우 등으로 검색할 수 있어요
      </p>
    </div>
  )
}

export default function SearchPage() {
  const { selectedWork, selectedWorkType, selectWork, clearSelectedWork } = useSearchStore()

  // 기록 작성 모달 열림 상태
  const [modalOpen, setModalOpen] = useState(false)

  // 검색어 입력 상태
  const [inputValue, setInputValue] = useState('')
  // 디바운스된 쿼리 (300ms 지연)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  // 현재 활성 탭
  const [activeTab, setActiveTab] = useState<SearchTab>('movie')

  // 영화/책 검색 결과 상태
  const [movies, setMovies] = useState<Movie[]>([])
  const [books, setBooks] = useState<Book[]>([])

  // 로딩/에러 상태
  const [isLoadingMovies, setIsLoadingMovies] = useState(false)
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)
  const [movieError, setMovieError] = useState<string | null>(null)
  const [bookError, setBookError] = useState<string | null>(null)

  // selectedWork가 설정되면 기록 작성 모달 열기
  useEffect(() => {
    if (selectedWork && selectedWorkType) {
      setModalOpen(true)
    }
  }, [selectedWork, selectedWorkType])

  /** 모달 닫힐 때 선택된 작품 초기화 */
  const handleModalClose = useCallback(
    (open: boolean) => {
      setModalOpen(open)
      if (!open) {
        clearSelectedWork()
      }
    },
    [clearSelectedWork]
  )

  // 입력값 변경 300ms 후 debouncedQuery 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue])

  // 영화 검색 실행
  const fetchMovies = useCallback(async (query: string) => {
    if (!query) {
      setMovies([])
      setMovieError(null)
      return
    }
    setIsLoadingMovies(true)
    setMovieError(null)
    try {
      const results = await searchMovies(query)
      setMovies(results)
    } catch (error) {
      setMovieError(
        error instanceof Error ? error.message : '영화 검색에 실패했습니다'
      )
      setMovies([])
    } finally {
      setIsLoadingMovies(false)
    }
  }, [])

  // 책 검색 실행
  const fetchBooks = useCallback(async (query: string) => {
    if (!query) {
      setBooks([])
      setBookError(null)
      return
    }
    setIsLoadingBooks(true)
    setBookError(null)
    try {
      const results = await searchBooks(query)
      setBooks(results)
    } catch (error) {
      setBookError(
        error instanceof Error ? error.message : '책 검색에 실패했습니다'
      )
      setBooks([])
    } finally {
      setIsLoadingBooks(false)
    }
  }, [])

  // debouncedQuery 변경 시 두 API 동시 호출
  useEffect(() => {
    void fetchMovies(debouncedQuery)
    void fetchBooks(debouncedQuery)
  }, [debouncedQuery, fetchMovies, fetchBooks])

  /** 영화 카드 클릭 핸들러 */
  const handleMovieSelect = useCallback(
    (movie: Movie) => {
      selectWork(movie, 'movie' as WorkType)
    },
    [selectWork]
  )

  /** 책 카드 클릭 핸들러 */
  const handleBookSelect = useCallback(
    (book: Book) => {
      selectWork(book, 'book' as WorkType)
    },
    [selectWork]
  )

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* 페이지 타이틀 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">작품 검색</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          감상할 영화나 책을 검색해서 기록을 남겨보세요
        </p>
      </div>

      {/* 검색 입력창 */}
      <div className="mb-6">
        <Input
          type="search"
          placeholder="영화 또는 책 제목을 입력하세요..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="h-11 text-base"
          aria-label="작품 검색"
        />
      </div>

      {/* 탭 전환 및 검색 결과 */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as SearchTab)}
      >
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="movie" className="flex-1 sm:flex-none">
            🎬 영화
            {movies.length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {movies.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="book" className="flex-1 sm:flex-none">
            📚 책
            {books.length > 0 && (
              <span className="ml-1.5 rounded-full bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                {books.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* 영화 탭 */}
        <TabsContent value="movie">
          {isLoadingMovies ? (
            <LoadingSpinner />
          ) : movieError ? (
            <ErrorMessage message={movieError} />
          ) : !debouncedQuery ? (
            <SearchPrompt tab="movie" />
          ) : movies.length === 0 ? (
            <EmptyResults query={debouncedQuery} />
          ) : (
            /* 컴팩트 리스트 레이아웃 */
            <div className="grid grid-cols-1 gap-2">
              {movies.map((movie) => (
                <div key={movie.id} className="min-w-0">
                  <SearchResultCard
                    title={movie.title}
                    imageUrl={movie.posterUrl}
                    year={movie.year}
                    subtitle={movie.director || '감독 정보 없음'}
                    workType="movie"
                    onClick={() => handleMovieSelect(movie)}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 책 탭 */}
        <TabsContent value="book">
          {isLoadingBooks ? (
            <LoadingSpinner />
          ) : bookError ? (
            <ErrorMessage message={bookError} />
          ) : !debouncedQuery ? (
            <SearchPrompt tab="book" />
          ) : books.length === 0 ? (
            <EmptyResults query={debouncedQuery} />
          ) : (
            /* 컴팩트 리스트 레이아웃 */
            <div className="grid grid-cols-1 gap-2">
              {books.map((book) => (
                <div key={book.id} className="min-w-0">
                  <SearchResultCard
                    title={book.title}
                    imageUrl={book.coverUrl}
                    year={book.year}
                    subtitle={book.author || '저자 정보 없음'}
                    workType="book"
                    onClick={() => handleBookSelect(book)}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 기록 작성 모달: 작품 선택 시 자동으로 열림 */}
      {selectedWork && selectedWorkType && (
        <RecordFormModal
          open={modalOpen}
          onOpenChange={handleModalClose}
          work={selectedWork}
          workType={selectedWorkType}
        />
      )}
    </div>
  )
}
