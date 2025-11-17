import { test, expect } from '@playwright/test';

/**
 * 기본 Drawer 기능 테스트
 * - 열기/닫기
 * - Overlay 클릭
 */
test.describe('Basic Drawer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/main/test/drawer');
  });

  test('기본 Drawer 열기/닫기', async ({ page }) => {
    // 기본 Drawer 트리거 버튼 찾기
    const triggerButton = page
      .locator('text=기본 Drawer 열기')
      .first();
    await triggerButton.click();

    // Drawer Content가 보이는지 확인
    const drawerContent = page
      .locator('[class*="fixed"][class*="bg-white"]')
      .first();
    await expect(drawerContent).toBeVisible();

    // Overlay 클릭하여 닫기
    const overlay = page
      .locator('[class*="fixed"][class*="inset-0"]')
      .first();
    await overlay.click({ position: { x: 10, y: 10 } });

    // Drawer가 닫혔는지 확인
    await expect(drawerContent).not.toBeVisible();
  });
});
