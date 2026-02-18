import { test, expect } from '@playwright/test'

/**
 * 네비게이션 E2E 테스트
 * - 홈 페이지 접근 및 타이틀 확인
 * - 네비게이션 링크 동작 (홈 → 검색 → 아카이브)
 * - 뒤로가기 동작
 */

test.describe('네비게이션', () => {
  test('홈 페이지 접근 시 타이틀과 로고가 표시된다', async ({ page }) => {
    await page.goto('/')

    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/Record Candy/)

    // 헤더 로고 확인
    await expect(page.getByRole('link', { name: /Record Candy 홈으로 이동/ })).toBeVisible()

    // 히어로 섹션 제목 확인
    await expect(page.getByRole('heading', { name: /Record Candy/ })).toBeVisible()
  })

  test('데스크톱 헤더 네비게이션 링크가 표시된다', async ({ page }) => {
    await page.goto('/')

    // 데스크톱 네비게이션 링크들 확인
    const nav = page.getByRole('navigation', { name: '글로벌 네비게이션' })
    await expect(nav).toBeVisible()

    // 각 링크 확인
    await expect(nav.getByRole('link', { name: '홈' })).toBeVisible()
    await expect(nav.getByRole('link', { name: '검색' })).toBeVisible()
    await expect(nav.getByRole('link', { name: '아카이브' })).toBeVisible()
  })

  test('홈 → 검색 페이지 이동이 동작한다', async ({ page }) => {
    await page.goto('/')

    // 검색 링크 클릭
    await page.getByRole('navigation', { name: '글로벌 네비게이션' })
      .getByRole('link', { name: '검색' })
      .click()

    // URL 확인
    await expect(page).toHaveURL('/search')

    // 검색 페이지 요소 확인
    await expect(page.getByRole('heading', { name: '작품 검색' })).toBeVisible()
  })

  test('검색 → 아카이브 페이지 이동이 동작한다', async ({ page }) => {
    await page.goto('/search')

    // 아카이브 링크 클릭
    await page.getByRole('navigation', { name: '글로벌 네비게이션' })
      .getByRole('link', { name: '아카이브' })
      .click()

    // URL 확인
    await expect(page).toHaveURL('/archive')

    // 아카이브 페이지 요소 확인
    await expect(page.getByRole('heading', { name: '아카이브' })).toBeVisible()
  })

  test('아카이브 → 홈 페이지 이동이 동작한다', async ({ page }) => {
    await page.goto('/archive')

    // 홈 로고 클릭
    await page.getByRole('link', { name: /Record Candy 홈으로 이동/ }).click()

    // URL 확인
    await expect(page).toHaveURL('/')
  })

  test('뒤로가기 동작이 정상적으로 수행된다', async ({ page }) => {
    await page.goto('/')
    await page.goto('/search')
    await page.goto('/archive')

    // 뒤로가기
    await page.goBack()
    await expect(page).toHaveURL('/search')

    // 한 번 더 뒤로가기
    await page.goBack()
    await expect(page).toHaveURL('/')
  })

  test('현재 페이지 네비게이션 링크가 active 상태로 표시된다', async ({ page }) => {
    await page.goto('/search')

    const searchLink = page.getByRole('navigation', { name: '글로벌 네비게이션' })
      .getByRole('link', { name: '검색' })

    // aria-current="page" 속성 확인
    await expect(searchLink).toHaveAttribute('aria-current', 'page')
  })
})
