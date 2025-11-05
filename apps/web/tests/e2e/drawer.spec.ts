import { test, expect } from '@playwright/test';

test.describe('Drawer Component', () => {
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

  test.describe('스냅 포인트 테스트', () => {
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

    test('제어 스냅 포인트 - 외부 버튼으로 제어', async ({
      page,
    }) => {
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
      const button100 = page
        .locator('button:has-text("100%")')
        .first();
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

  test.describe('Position 옵션 테스트', () => {
    test('Bottom position (기본)', async ({ page }) => {
      const triggerButton = page
        .locator('text=Bottom Drawer')
        .first();
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
      await page.mouse.move(
        initialBox!.x + 150,
        initialBox!.y + 100,
        { steps: 10 },
      );
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
      await page.mouse.move(
        initialBox!.x - 150,
        initialBox!.y + 100,
        { steps: 10 },
      );
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

  test.describe('제어 모드 테스트', () => {
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

  test.describe('Body 스크롤 잠금 테스트 (Issue #2)', () => {
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

  test.describe('접근성 테스트', () => {
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
});
