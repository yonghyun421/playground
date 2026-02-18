import { test, expect, type Page } from '@playwright/test'

/**
 * 기록 CRUD E2E 테스트
 * - 홈에서 빈 상태 확인 (기록 없을 때)
 * - localStorage에 테스트 데이터 주입 후 기록 표시 확인
 * - 아카이브 필터/정렬 동작
 * - 상세 페이지 접근 및 정보 표시
 * - 기록 삭제 플로우
 */

/** E2E 테스트용 샘플 기록 데이터 */
const TEST_RECORD_MOVIE = {
  id: 'test-record-001',
  work: {
    id: 'movie-550',
    title: '파이트 클럽',
    year: 1999,
    genres: ['드라마', '스릴러'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    director: '데이비드 핀처',
    actors: [],
    tmdbId: 550,
  },
  workType: 'movie' as const,
  rating: 9,
  reviewDate: '2024-01-15T00:00:00.000Z',
  oneLineReview: '인생 영화 중 하나',
  emotionTags: ['inspired', 'thrilled'],
  rewatchIntent: true,
  createdAt: '2024-01-15T12:00:00.000Z',
  updatedAt: '2024-01-15T12:00:00.000Z',
}

const TEST_RECORD_BOOK = {
  id: 'test-record-002',
  work: {
    id: 'book-OL82563W',
    title: '어린 왕자',
    year: 1943,
    genres: ['소설', '판타지'],
    coverUrl: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    author: '생텍쥐페리',
    isbn: '978-0156012195',
    openLibraryId: 'OL82563W',
  },
  workType: 'book' as const,
  rating: 8,
  reviewDate: '2024-02-20T00:00:00.000Z',
  oneLineReview: '어른이 읽어야 할 동화',
  emotionTags: ['moved', 'nostalgic'],
  rewatchIntent: false,
  createdAt: '2024-02-20T12:00:00.000Z',
  updatedAt: '2024-02-20T12:00:00.000Z',
}

/** localStorage에 테스트 기록 데이터 주입 */
async function injectTestRecords(
  page: Page,
  records: unknown[] = [TEST_RECORD_MOVIE, TEST_RECORD_BOOK]
) {
  await page.evaluate((data) => {
    // Zustand persist 스토어의 localStorage 키
    localStorage.setItem(
      'record-candy-records',
      JSON.stringify({ state: { records: data }, version: 0 })
    )
  }, records)
}

test.describe('기록 관리', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전 localStorage 초기화
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test.describe('홈 페이지', () => {
    test('기록이 없을 때 빈 상태가 표시된다', async ({ page }) => {
      await page.goto('/')

      // 빈 상태 메시지 확인
      await expect(page.getByText('아직 기록이 없어요')).toBeVisible()

      // 검색 버튼 표시
      await expect(page.getByRole('button', { name: '검색하러 가기' })).toBeVisible()
    })

    test('기록이 있을 때 통계 카드와 최근 기록이 표시된다', async ({ page }) => {
      await injectTestRecords(page)
      await page.reload()

      // 통계 카드 확인
      await expect(page.getByText('총 기록')).toBeVisible()

      // 최근 기록 섹션
      await expect(page.getByRole('heading', { name: '최근 기록' })).toBeVisible()
    })

    test('빈 상태에서 "검색하러 가기" 클릭 시 검색 페이지로 이동한다', async ({ page }) => {
      await page.goto('/')

      await page.getByRole('button', { name: '검색하러 가기' }).click()

      await expect(page).toHaveURL('/search')
    })

    test('기록이 있을 때 "전체 보기" 클릭 시 아카이브로 이동한다', async ({ page }) => {
      await injectTestRecords(page)
      await page.reload()

      await page.getByRole('button', { name: '전체 보기 →' }).click()

      await expect(page).toHaveURL('/archive')
    })
  })

  test.describe('아카이브 페이지', () => {
    test.beforeEach(async ({ page }) => {
      await injectTestRecords(page)
      await page.goto('/archive')
    })

    test('기록 카드 목록이 표시된다', async ({ page }) => {
      // 기록 카드들이 렌더링됨
      await expect(page.getByText('파이트 클럽')).toBeVisible()
      await expect(page.getByText('어린 왕자')).toBeVisible()
    })

    test('영화 필터 적용 시 영화 기록만 표시된다', async ({ page }) => {
      // 영화 필터 클릭
      await page.getByRole('button', { name: /영화/ }).click()

      // 영화 기록만 보임
      await expect(page.getByText('파이트 클럽')).toBeVisible()
      await expect(page.getByText('어린 왕자')).not.toBeVisible()
    })

    test('도서 필터 적용 시 도서 기록만 표시된다', async ({ page }) => {
      // 도서 필터 클릭
      await page.getByRole('button', { name: /도서/ }).click()

      // 도서 기록만 보임
      await expect(page.getByText('어린 왕자')).toBeVisible()
      await expect(page.getByText('파이트 클럽')).not.toBeVisible()
    })

    test('전체 필터로 돌아올 때 모든 기록이 표시된다', async ({ page }) => {
      // 영화 필터 적용 후 전체로 복귀
      await page.getByRole('button', { name: /영화/ }).click()
      await page.getByRole('button', { name: '전체' }).click()

      await expect(page.getByText('파이트 클럽')).toBeVisible()
      await expect(page.getByText('어린 왕자')).toBeVisible()
    })

    test('정렬 셀렉트가 정상적으로 작동한다', async ({ page }) => {
      // 정렬 셀렉트 확인
      const sortSelect = page.getByRole('combobox')
      await expect(sortSelect).toBeVisible()

      // 평점 높은순 선택
      await sortSelect.selectOption('rating-high')

      // 정렬 적용 후 기록들이 여전히 표시됨
      await expect(page.getByText('파이트 클럽')).toBeVisible()
    })
  })

  test.describe('상세 페이지', () => {
    test.beforeEach(async ({ page }) => {
      await injectTestRecords(page)
    })

    test('영화 기록 상세 페이지에 작품 정보가 표시된다', async ({ page }) => {
      await page.goto(`/records/${TEST_RECORD_MOVIE.id}`)

      // 작품 제목
      await expect(page.getByRole('heading', { name: '파이트 클럽' })).toBeVisible()

      // 감독 정보
      await expect(page.getByText(/데이비드 핀처/)).toBeVisible()

      // 평점
      await expect(page.getByText(/9/)).toBeVisible()

      // 한줄 감상
      await expect(page.getByText('인생 영화 중 하나')).toBeVisible()
    })

    test('존재하지 않는 기록 ID 접근 시 오류 메시지가 표시된다', async ({ page }) => {
      await page.goto('/records/non-existent-id')

      await expect(page.getByText('기록을 찾을 수 없어요')).toBeVisible()
      await expect(page.getByRole('button', { name: '아카이브로 이동' })).toBeVisible()
    })

    test('뒤로가기 버튼이 동작한다', async ({ page }) => {
      await page.goto('/archive')
      await page.goto(`/records/${TEST_RECORD_MOVIE.id}`)

      await page.getByRole('button', { name: '이전 페이지로 이동' }).click()

      await expect(page).toHaveURL('/archive')
    })

    test('기록 삭제 후 아카이브로 리다이렉트된다', async ({ page }) => {
      await page.goto(`/records/${TEST_RECORD_MOVIE.id}`)

      // 삭제 버튼 클릭
      await page.getByRole('button', { name: '감상 기록 삭제' }).click()

      // 확인 다이얼로그 표시
      await expect(page.getByRole('dialog')).toBeVisible()
      await expect(page.getByText('기록 삭제')).toBeVisible()

      // 삭제 확인
      await page.getByRole('button', { name: '삭제' }).click()

      // 아카이브로 리다이렉트
      await expect(page).toHaveURL('/archive')
    })

    test('삭제 다이얼로그에서 취소 클릭 시 모달이 닫힌다', async ({ page }) => {
      await page.goto(`/records/${TEST_RECORD_MOVIE.id}`)

      await page.getByRole('button', { name: '감상 기록 삭제' }).click()
      await expect(page.getByRole('dialog')).toBeVisible()

      // 취소 클릭
      await page.getByRole('button', { name: '취소' }).click()

      // 다이얼로그 닫힘, 페이지 유지
      await expect(page.getByRole('dialog')).not.toBeVisible()
      await expect(page).toHaveURL(`/records/${TEST_RECORD_MOVIE.id}`)
    })

    test('편집 모달이 열리고 닫힌다', async ({ page }) => {
      await page.goto(`/records/${TEST_RECORD_MOVIE.id}`)

      // 편집 버튼 클릭
      await page.getByRole('button', { name: '감상 기록 편집' }).click()

      // 수정 모달 표시
      await expect(page.getByRole('dialog')).toBeVisible()
      await expect(page.getByText('기록 수정')).toBeVisible()

      // 취소 클릭
      await page.getByRole('button', { name: '취소' }).click()

      // 모달 닫힘
      await expect(page.getByRole('dialog')).not.toBeVisible()
    })
  })

  test.describe('아카이브에서 상세 페이지 이동', () => {
    test('아카이브 카드 클릭 시 상세 페이지로 이동한다', async ({ page }) => {
      await injectTestRecords(page)
      await page.goto('/archive')

      // 파이트 클럽 카드 클릭 (카드 내 링크 또는 버튼)
      await page.getByText('파이트 클럽').click()

      // 상세 페이지로 이동
      await expect(page).toHaveURL(`/records/${TEST_RECORD_MOVIE.id}`)
    })
  })
})
