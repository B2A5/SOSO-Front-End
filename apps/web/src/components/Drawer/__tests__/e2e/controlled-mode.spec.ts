import { test, expect } from '@playwright/test';

/**
 * 제어 모드 테스트
 * - 외부 버튼으로 열기/닫기
 * - 상태 동기화 확인
 */
test.describe('Controlled Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/main/test/drawer');
  });

  test('외부 버튼으로 Drawer 열기/닫기', async ({ page }) => {
    // 현재 상태 확인
    const statusText = page.locator('text=현재 상태:').first();
    await expect(statusText).toContainText('닫힘');

    // 외부에서 열기 버튼 클릭
    const openButton = page
      .locator('button:has-text("외부에서 열기")')
      .first();
    await openButton.click();

    // 상태가 변경되었는지 확인
    await expect(statusText).toContainText('열림');

    // Drawer가 보이는지 확인
    const drawerContent = page
      .locator('text=제어 모드 Drawer')
      .locator('..');
    await expect(drawerContent).toBeVisible();

    // 외부에서 닫기 버튼 클릭
    const closeButton = page
      .locator('button:has-text("외부에서 닫기")')
      .first();
    await closeButton.click();

    // 상태가 변경되었는지 확인
    await expect(statusText).toContainText('닫힘');

    // Drawer가 닫혔는지 확인
    await expect(drawerContent).not.toBeVisible();
  });
});
