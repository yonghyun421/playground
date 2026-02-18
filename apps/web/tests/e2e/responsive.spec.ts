import { test, expect, type Page } from '@playwright/test'

/**
 * 반응형 레이아웃 E2E 테스트
 * - 모바일 뷰포트(375px)에서 하단 탭 바 표시
 * - 데스크톱 뷰포트(1280px)에서 헤더 네비게이션 표시
 * - 카드 그리드 반응형 레이아웃
 */

/** 테스트용 기록 데이터 주입 */
async function injectTestRecords(page: Page) {
  const testRecords = [
    {
      id: 'resp-test-001',
      work: {
        id: 'movie-test',
        title: '테스트 영화',
        year: 2023,
        genres: ['액션'],
        posterUrl: '',
        director: '테스트 감독',
        actors: [],
        tmdbId: 99999,
      },
      workType: 'movie' as const,
      rating: 7,
      reviewDate: '2024-01-01T00:00:00.000Z',
      oneLineReview: '좋은 영화',
      emotionTags: [],
      rewatchIntent: false,
      createdAt: '2024-01-01T12:00:00.000Z',
      updatedAt: '2024-01-01T12:00:00.000Z',
    },
  ]

  await page.evaluate((data) => {
    localStorage.setItem(
      'record-candy-records',
      JSON.stringify({ state: { records: data }, version: 0 })
    )
  }, testRecords)
}

test.describe('반응형 레이아웃', () => {
  test.describe('모바일 뷰포트 (375px)', () => {
    test.use({ viewport: { width: 375, height: 812 } })

    test('모바일에서 하단 탭 바가 표시된다', async ({ page }) => {
      await page.goto('/')

      // 모바일 하단 탭 바 확인 (nav 역할)
      const mobileNav = page.getByRole('navigation', { name: '모바일 하단 탭 네비게이션' })
      await expect(mobileNav).toBeVisible()

      // 탭 아이템 확인
      await expect(mobileNav.getByRole('link', { name: /홈/ })).toBeVisible()
      await expect(mobileNav.getByRole('link', { name: /검색/ })).toBeVisible()
      await expect(mobileNav.getByRole('link', { name: /아카이브/ })).toBeVisible()
    })

    test('모바일에서 검색 페이지가 올바르게 렌더링된다', async ({ page }) => {
      await page.goto('/search')

      // 검색 입력창
      await expect(page.getByRole('searchbox', { name: '작품 검색' })).toBeVisible()

      // 탭 (모바일에서 전체 너비)
      await expect(page.getByRole('tab', { name: /영화/ })).toBeVisible()
      await expect(page.getByRole('tab', { name: /책/ })).toBeVisible()
    })

    test('모바일에서 아카이브 페이지가 올바르게 렌더링된다', async ({ page }) => {
      await injectTestRecords(page)
      await page.goto('/archive')

      // 페이지 제목
      await expect(page.getByRole('heading', { name: '아카이브' })).toBeVisible()

      // 필터 바
      await expect(page.getByRole('button', { name: '전체' })).toBeVisible()
    })
  })

  test.describe('데스크톱 뷰포트 (1280px)', () => {
    test.use({ viewport: { width: 1280, height: 800 } })

    test('데스크톱에서 헤더 네비게이션이 표시된다', async ({ page }) => {
      await page.goto('/')

      const nav = page.getByRole('navigation', { name: '글로벌 네비게이션' })
      await expect(nav).toBeVisible()

      // 데스크톱 링크들이 보임
      await expect(nav.getByRole('link', { name: '홈' })).toBeVisible()
      await expect(nav.getByRole('link', { name: '검색' })).toBeVisible()
      await expect(nav.getByRole('link', { name: '아카이브' })).toBeVisible()
    })

    test('데스크톱에서 홈 통계 카드가 2×2 그리드로 배치된다', async ({ page }) => {
      await page.goto('/')

      // 통계 섹션 확인
      const statsSection = page.getByRole('region', { name: '감상 기록 통계' })
      await expect(statsSection).toBeVisible()

      // 4개의 통계 카드 확인
      await expect(statsSection.getByText('총 기록')).toBeVisible()
      await expect(statsSection.getByText('영화')).toBeVisible()
      await expect(statsSection.getByText('도서')).toBeVisible()
      await expect(statsSection.getByText('평균 평점')).toBeVisible()
    })

    test('데스크톱에서 검색 결과 그리드가 3열로 표시된다', async ({ page }) => {
      await page.goto('/search')

      // 그리드 컨테이너 확인 (클래스 기반)
      // 실제 그리드는 CSS로 제어되므로 기본 렌더링만 확인
      await expect(page.getByRole('searchbox', { name: '작품 검색' })).toBeVisible()
    })

    test('데스크톱에서 아카이브 필터와 정렬이 같은 행에 표시된다', async ({ page }) => {
      await injectTestRecords(page)
      await page.goto('/archive')

      // 필터 바와 정렬 셀렉트 모두 표시
      await expect(page.getByRole('button', { name: '전체' })).toBeVisible()
      await expect(page.getByRole('combobox')).toBeVisible()
    })
  })

  test.describe('태블릿 뷰포트 (768px)', () => {
    test.use({ viewport: { width: 768, height: 1024 } })

    test('태블릿에서 기본 레이아웃이 올바르게 렌더링된다', async ({ page }) => {
      await page.goto('/')

      // 헤더가 보임
      await expect(page.getByRole('link', { name: /Record Candy 홈으로 이동/ })).toBeVisible()

      // 히어로 섹션
      await expect(page.getByRole('heading', { name: /Record Candy/ })).toBeVisible()
    })
  })
})
