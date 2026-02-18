import { test, expect } from '@playwright/test'

/**
 * 홈 페이지 기본 E2E 테스트
 * - 페이지 로드 확인
 * - API 헬스 체크
 */

test('홈 페이지가 로드된다', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Record Candy/)
})

test('헬스 엔드포인트가 정상 응답한다', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.ok()).toBeTruthy()
  const data = await response.json()
  expect(data.status).toBe('ok')
})
