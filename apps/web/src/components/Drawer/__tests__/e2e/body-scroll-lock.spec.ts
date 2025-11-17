import { test, expect } from '@playwright/test';

/**
 * Body 스크롤 잠금 테스트 (Issue #2)
 * - Drawer 열림 시 body 스크롤 잠금
 * - 스크롤 위치 유지
 * - 여러 Drawer 연속 열기/닫기
 */
test.describe('Body Scroll Lock (Issue #2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/main/test/drawer');
  });

  test('Drawer 열림 시 body 스크롤 잠금', async ({ page }) => {
    // 페이지에 스크롤 가능한 높이 추가
    await page.setViewportSize({ width: 1280, height: 720 });

    // Drawer 열기
    const triggerButton = page
      .locator('text=기본 Drawer 열기')
      .first();
    await triggerButton.click();

    // Drawer가 열렸는지 확인
    const drawerContent = page
      .locator('[class*="fixed"][class*="bg-white"]')
      .first();
    await expect(drawerContent).toBeVisible();

    // useEffect가 실행될 때까지 대기
    await page.waitForTimeout(100);

    // Body가 fixed로 설정되었는지 확인
    const bodyStyleWhenOpen = await page.evaluate(() => {
      return {
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
      };
    });

    expect(bodyStyleWhenOpen.position).toBe('fixed');
    expect(bodyStyleWhenOpen.width).toBe('100%');

    // Drawer 닫기
    const overlay = page
      .locator('[class*="fixed"][class*="inset-0"]')
      .first();
    await overlay.click({ position: { x: 10, y: 10 } });

    // Drawer가 닫혔는지 확인
    await expect(drawerContent).not.toBeVisible();

    // Body 스타일이 복원되었는지 확인
    await page.waitForTimeout(100);
    const bodyStyleWhenClosed = await page.evaluate(() => {
      return {
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
      };
    });

    expect(bodyStyleWhenClosed.position).toBe('');
    expect(bodyStyleWhenClosed.top).toBe('');
  });

  test('Drawer 열림 시 스크롤 위치 유지', async ({ page }) => {
    // 페이지 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, 100);
    });

    // 스크롤 위치 확인
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    expect(scrollYBefore).toBe(100);

    // Drawer 열기
    const triggerButton = page
      .locator('text=기본 Drawer 열기')
      .first();
    await triggerButton.click();

    // Drawer가 열렸는지 확인
    const drawerContent = page
      .locator('[class*="fixed"][class*="bg-white"]')
      .first();
    await expect(drawerContent).toBeVisible();

    // Drawer 닫기
    await page.keyboard.press('Escape');

    // 애니메이션 대기
    await page.waitForTimeout(500);
    await expect(drawerContent).not.toBeVisible();

    // 스크롤 위치가 복원되었는지 확인
    await page.waitForTimeout(100);
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    expect(scrollYAfter).toBe(scrollYBefore);
  });

  test('여러 Drawer 연속 열기/닫기 시 스크롤 잠금 정상 동작', async ({
    page,
  }) => {
    // 첫 번째 Drawer 열기
    const trigger1 = page.locator('text=기본 Drawer 열기').first();
    await trigger1.click();

    const drawer1 = page
      .locator('[class*="fixed"][class*="bg-white"]')
      .first();
    await expect(drawer1).toBeVisible();

    // useEffect가 실행될 때까지 대기
    await page.waitForTimeout(100);

    // Body가 fixed인지 확인
    let bodyPosition = await page.evaluate(
      () => document.body.style.position,
    );
    expect(bodyPosition).toBe('fixed');

    // 첫 번째 Drawer 닫기
    await page.keyboard.press('Escape');
    await expect(drawer1).not.toBeVisible();

    // Body 스타일이 복원되었는지 확인
    await page.waitForTimeout(100);
    bodyPosition = await page.evaluate(
      () => document.body.style.position,
    );
    expect(bodyPosition).toBe('');

    // 두 번째 Drawer 열기
    await trigger1.click();
    await expect(drawer1).toBeVisible();

    // useEffect가 실행될 때까지 대기
    await page.waitForTimeout(100);

    // 다시 Body가 fixed인지 확인
    bodyPosition = await page.evaluate(
      () => document.body.style.position,
    );
    expect(bodyPosition).toBe('fixed');
  });
});
