import { test, expect } from '@playwright/test';

/**
 * 스냅 포인트 기능 테스트
 * - 비제어 스냅 포인트 드래그
 * - 제어 스냅 포인트 버튼 제어
 * - 빠른 스와이프
 */
test.describe('Snap Points', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/main/test/drawer');
  });

  test('비제어 스냅 포인트 - 드래그로 스냅', async ({ page }) => {
    // 스냅 포인트 Drawer 열기
    const snapTrigger = page
      .locator('text=스냅 포인트 Drawer 열기')
      .first();
    await snapTrigger.click();

    // Drawer가 열렸는지 확인
    const drawerContent = page
      .locator('text=스냅 포인트 드래그 테스트')
      .locator('..');
    await expect(drawerContent).toBeVisible();

    // Drawer 핸들 찾기
    const handle = page
      .locator('[class*="mx-auto"][class*="bg-gray-300"]')
      .first();

    // 초기 위치 저장
    const initialBox = await drawerContent.boundingBox();
    expect(initialBox).not.toBeNull();

    // 드래그 다운 (아래로)
    await handle.hover();
    await page.mouse.down();
    await page.mouse.move(
      initialBox!.x + initialBox!.width / 2,
      initialBox!.y + 200,
    );
    await page.mouse.up();

    // 애니메이션 대기
    await page.waitForTimeout(500);

    // 위치가 변경되었는지 확인 (스냅 포인트로 이동)
    const newBox = await drawerContent.boundingBox();
    expect(newBox).not.toBeNull();
    expect(newBox!.y).toBeGreaterThan(initialBox!.y);
  });

  test('제어 스냅 포인트 - 외부 버튼으로 제어', async ({ page }) => {
    // 제어 스냅 포인트 Drawer 열기
    const controlTrigger = page
      .locator('text=제어 스냅 포인트 열기')
      .first();
    await controlTrigger.click();

    // Drawer가 열렸는지 확인
    const drawerContent = page
      .locator('text=제어 스냅 포인트 테스트')
      .locator('..');
    await expect(drawerContent).toBeVisible();

    // 초기 위치 저장
    const initialBox = await drawerContent.boundingBox();
    expect(initialBox).not.toBeNull();

    // 30% 버튼 클릭
    const button30 = page.locator('button:has-text("30%")').first();
    await button30.click();

    // 애니메이션 대기
    await page.waitForTimeout(500);

    // 위치가 변경되었는지 확인
    const box30 = await drawerContent.boundingBox();
    expect(box30).not.toBeNull();
    expect(box30!.y).toBeGreaterThan(initialBox!.y);

    // 100% 버튼 클릭
    const button100 = page.locator('button:has-text("100%")').first();
    await button100.click();

    // 애니메이션 대기
    await page.waitForTimeout(500);

    // 위치가 다시 변경되었는지 확인
    const box100 = await drawerContent.boundingBox();
    expect(box100).not.toBeNull();
    expect(box100!.y).toBeLessThan(box30!.y); // 더 위로 올라감
  });

  test('빠른 스와이프 - 마지막 스냅 포인트로 이동', async ({
    page,
  }) => {
    // 스냅 포인트 Drawer 열기
    const snapTrigger = page
      .locator('text=스냅 포인트 Drawer 열기')
      .first();
    await snapTrigger.click();

    const drawerContent = page
      .locator('text=스냅 포인트 드래그 테스트')
      .locator('..');
    await expect(drawerContent).toBeVisible();

    const handle = page
      .locator('[class*="mx-auto"][class*="bg-gray-300"]')
      .first();
    const initialBox = await drawerContent.boundingBox();
    expect(initialBox).not.toBeNull();

    // 빠른 스와이프 업 (위로)
    await handle.hover();
    await page.mouse.down();
    // 빠른 스와이프를 시뮬레이션하기 위해 짧은 시간에 큰 거리 이동
    await page.mouse.move(
      initialBox!.x + initialBox!.width / 2,
      initialBox!.y - 100,
      { steps: 3 },
    );
    await page.mouse.up();

    // 애니메이션 대기
    await page.waitForTimeout(500);

    // 거의 최상단으로 이동했는지 확인 (100% 스냅 포인트)
    const finalBox = await drawerContent.boundingBox();
    expect(finalBox).not.toBeNull();
    expect(finalBox!.y).toBeLessThan(100); // 화면 상단 근처
  });
});
