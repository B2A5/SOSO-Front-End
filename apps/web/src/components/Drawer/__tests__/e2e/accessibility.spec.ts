import { test, expect } from '@playwright/test';

/**
 * 접근성 테스트
 * - 키보드로 Drawer 열기
 * - Escape로 Drawer 닫기
 * - ARIA 속성 확인
 */
test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/main/test/drawer');
  });

  test('키보드로 Drawer 열기', async ({ page }) => {
    const triggerButton = page
      .locator('text=기본 Drawer 열기')
      .first();

    // Tab으로 버튼에 포커스
    await page.keyboard.press('Tab');
    await triggerButton.focus();

    // Enter로 Drawer 열기
    await page.keyboard.press('Enter');

    const drawerContent = page
      .locator('[class*="fixed"][class*="bg-white"]')
      .first();
    await expect(drawerContent).toBeVisible();
  });

  test('Escape로 Drawer 닫기', async ({ page }) => {
    const triggerButton = page
      .locator('text=기본 Drawer 열기')
      .first();
    await triggerButton.click();

    const drawerContent = page
      .locator('[class*="fixed"][class*="bg-white"]')
      .first();
    await expect(drawerContent).toBeVisible();

    // Escape로 닫기
    await page.keyboard.press('Escape');

    // Drawer가 닫혔는지 확인
    await expect(drawerContent).not.toBeVisible();
  });
});
