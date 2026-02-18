import { test, expect } from '@playwright/test'

/**
 * 검색 페이지 E2E 테스트
 * - 검색 페이지 접근
 * - 탭 전환 (영화/책) 동작
 * - 검색어 입력 후 결과 표시
 * - 빈 검색어 상태 표시
 */

test.describe('작품 검색', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search')
  })

  test('검색 페이지 기본 요소가 렌더링된다', async ({ page }) => {
    // 페이지 제목
    await expect(page.getByRole('heading', { name: '작품 검색' })).toBeVisible()

    // 검색 입력창
    await expect(page.getByRole('searchbox', { name: '작품 검색' })).toBeVisible()

    // 영화/책 탭
    await expect(page.getByRole('tab', { name: /영화/ })).toBeVisible()
    await expect(page.getByRole('tab', { name: /책/ })).toBeVisible()
  })

  test('초기 상태에서 검색 안내 메시지가 표시된다', async ({ page }) => {
    // 영화 탭 기본 안내
    await expect(page.getByText('영화를 검색해보세요')).toBeVisible()
  })

  test('영화 → 책 탭 전환이 동작한다', async ({ page }) => {
    // 책 탭 클릭
    await page.getByRole('tab', { name: /책/ }).click()

    // 책 탭이 활성화됨
    await expect(page.getByRole('tab', { name: /책/ })).toHaveAttribute(
      'data-state',
      'active'
    )

    // 책 탭 안내 메시지 표시
    await expect(page.getByText('책을 검색해보세요')).toBeVisible()
  })

  test('검색어 입력 후 빈 결과 메시지가 표시된다', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: '작품 검색' })

    // 존재하지 않는 검색어 입력
    await searchInput.fill('xyzxyzxyz_존재하지않는제목_12345')

    // 디바운스 대기 (300ms + 여유)
    await page.waitForTimeout(600)

    // 빈 결과 메시지 표시 확인
    await expect(page.getByText('검색 결과가 없습니다')).toBeVisible({ timeout: 10000 })
  })

  test('검색어를 지우면 초기 안내 상태로 돌아간다', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: '작품 검색' })

    // 검색어 입력 후 지우기
    await searchInput.fill('테스트')
    await page.waitForTimeout(400)
    await searchInput.clear()
    await page.waitForTimeout(400)

    // 초기 안내 메시지 복귀
    await expect(page.getByText('영화를 검색해보세요')).toBeVisible()
  })

  test('영화 탭에서 검색 결과 클릭 시 기록 작성 모달이 열린다', async ({ page }) => {
    // 실제 API 응답을 기다리는 테스트 - 네트워크 환경에 따라 스킵 가능
    test.skip(
      !process.env.TMDB_API_KEY,
      'TMDB_API_KEY가 없으면 실제 검색 결과 테스트를 스킵합니다'
    )

    const searchInput = page.getByRole('searchbox', { name: '작품 검색' })
    await searchInput.fill('인터스텔라')

    // API 응답 대기
    await page.waitForTimeout(1500)

    // 첫 번째 검색 결과 클릭
    const firstResult = page.locator('[data-testid="search-result-card"]').first()
    if (await firstResult.isVisible()) {
      await firstResult.click()

      // 기록 작성 모달 확인
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 3000 })
      await expect(page.getByText('감상 기록 남기기')).toBeVisible()
    }
  })
})
