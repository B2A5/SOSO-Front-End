import { test, expect } from '@playwright/test';

/**
 * Position 옵션 테스트 (Issue #1 해결)
 * - Bottom position
 * - Left position + 드래그
 * - Right position + 드래그
 * - Top position + 드래그
 */
test.describe('Position Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/main/test/drawer');
  });

  test('Bottom position (기본)', async ({ page }) => {
    const triggerButton = page.locator('text=Bottom Drawer').first();
    await triggerButton.click();

    const drawerContent = page
      .locator('text=Bottom Position')
      .locator('..');
    await expect(drawerContent).toBeVisible();

    // Bottom에서 나타나는지 확인 (y 좌표가 화면 하단에 가까움)
    const box = await drawerContent.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThan(200);
  });

  test('Left position - 드래그 테스트 (Issue #1)', async ({
    page,
  }) => {
    // Left Drawer 열기
    const triggerButton = page
      .locator('button:has-text("⬅️ Left")')
      .first();
    await triggerButton.click();

    // 애니메이션 대기
    await page.waitForTimeout(500);

    // Drawer가 열렸는지 확인
    const drawerContent = page.locator('[role="dialog"]').first();
    await expect(drawerContent).toBeVisible();

    // 초기 위치 저장
    const initialBox = await drawerContent.boundingBox();
    expect(initialBox).not.toBeNull();

    // 오른쪽으로 드래그 (닫는 방향)
    await page.mouse.move(initialBox!.x + 50, initialBox!.y + 100);
    await page.mouse.down();
    await page.mouse.move(initialBox!.x + 150, initialBox!.y + 100, {
      steps: 10,
    });
    await page.mouse.up();

    // 애니메이션 대기
    await page.waitForTimeout(300);

    // Drawer가 닫혔는지 확인 (x 좌표가 왼쪽으로 이동했는지)
    await expect(drawerContent).not.toBeVisible({ timeout: 1000 });
  });

  test('Right position - 드래그 테스트 (Issue #1)', async ({
    page,
  }) => {
    // Right Drawer 열기
    const triggerButton = page
      .locator('button:has-text("➡️ Right")')
      .first();
    await triggerButton.click();

    // 애니메이션 대기
    await page.waitForTimeout(500);

    // Drawer가 열렸는지 확인
    const drawerContent = page.locator('[role="dialog"]').first();
    await expect(drawerContent).toBeVisible();

    // 초기 위치 저장
    const initialBox = await drawerContent.boundingBox();
    expect(initialBox).not.toBeNull();

    // 왼쪽으로 드래그 (닫는 방향)
    await page.mouse.move(initialBox!.x + 50, initialBox!.y + 100);
    await page.mouse.down();
    await page.mouse.move(initialBox!.x - 150, initialBox!.y + 100, {
      steps: 10,
    });
    await page.mouse.up();

    // 애니메이션 대기
    await page.waitForTimeout(300);

    // Drawer가 닫혔는지 확인
    await expect(drawerContent).not.toBeVisible({ timeout: 1000 });
  });

  test('Top position - 드래그 테스트', async ({ page }) => {
    // Top Drawer 열기
    const triggerButton = page
      .locator('button:has-text("⬆️ Top")')
      .first();
    await triggerButton.click();

    // Drawer가 열렸는지 확인
    const drawerContent = page
      .locator('text=Top Drawer')
      .locator('..');
    await expect(drawerContent).toBeVisible();

    // 초기 위치 저장
    const initialBox = await drawerContent.boundingBox();
    expect(initialBox).not.toBeNull();

    // 아래로 드래그 (닫는 방향)
    await page.mouse.move(
      initialBox!.x + initialBox!.width / 2,
      initialBox!.y + 50,
    );
    await page.mouse.down();
    await page.mouse.move(
      initialBox!.x + initialBox!.width / 2,
      initialBox!.y - 150,
      { steps: 10 },
    );
    await page.mouse.up();

    // 애니메이션 대기
    await page.waitForTimeout(300);

    // Drawer가 닫혔는지 확인
    await expect(drawerContent).not.toBeVisible({ timeout: 1000 });
  });
});
