#!/usr/bin/env node

/**
 * PR에서 변경된 파일들을 분석하여 영향받는 페이지 경로를 감지합니다.
 */
function detectChangedPages() {
  const changedFiles =
    process.env.CHANGED_FILES?.split('\n').filter(Boolean) || [];
  const pages = new Set();
  const components = new Set();

  // 디버그 메시지는 stderr로 출력 (GitHub Output에 포함되지 않음)
  console.error('🔍 변경된 파일 분석 중...');
  console.error('CHANGED_FILES=' + JSON.stringify(changedFiles));

  changedFiles.forEach((file) => {
    console.error(`📁 분석 중: ${file}`);

    // App Router 페이지 감지
    if (
      file.startsWith('apps/web/src/app/') &&
      file.endsWith('.tsx')
    ) {
      const appPath = file.replace('apps/web/src/app/', '');

      if (appPath.includes('page.tsx')) {
        // 페이지 파일
        const pagePath = appPath.replace('/page.tsx', '') || '/';
        const route = pagePath === '' ? '/' : `/${pagePath}`;
        pages.add(route);
        console.error(`📄 페이지 감지: ${route}`);
      } else if (appPath.includes('layout.tsx')) {
        // 레이아웃 파일 - 하위 모든 페이지에 영향
        const layoutPath = appPath.replace('layout.tsx', '');
        if (layoutPath === '' || layoutPath === '/') {
          // 루트 레이아웃 변경 시 모든 페이지 영향
          pages.add('/');
          pages.add('/auth');
          pages.add('/main');
          pages.add('/main/community');
          pages.add('/main/founder');
          pages.add('/main/maps');
          pages.add('/main/profile');
          console.error(`🏗️ 루트 레이아웃 변경 - 모든 페이지 영향`);
        } else {
          const route = `/${layoutPath}`;
          pages.add(route);
          console.error(`🏗️ 레이아웃 감지: ${route}`);
        }
      }
    }

    // 공통 컴포넌트 변경 감지
    else if (file.startsWith('apps/web/src/components/')) {
      components.add(file);
      console.error(`🧩 공통 컴포넌트 변경: ${file}`);

      // 공통 컴포넌트 변경 시 대표 페이지들 측정
      if (components.size > 0) {
        pages.add('/');
        pages.add('/main');
        console.error(`🧩 공통 컴포넌트 영향으로 대표 페이지 추가`);
      }
    }

    // 스타일 파일 변경
    else if (
      file.endsWith('.css') ||
      file.endsWith('.scss') ||
      file.includes('tailwind')
    ) {
      console.error(`🎨 스타일 변경 감지 - 모든 페이지 영향`);
      pages.add('/');
      pages.add('/main');
    }

    // 설정 파일 변경
    else if (
      file.includes('next.config') ||
      file.includes('package.json')
    ) {
      console.error(`⚙️ 설정 파일 변경 - 전체 앱 영향`);
      pages.add('/');
      pages.add('/main');
      pages.add('/auth');
    }
  });

  const result = {
    changedPages: Array.from(pages),
    impactLevel:
      pages.size > 3 ? 'high' : pages.size > 1 ? 'medium' : 'low',
  };

  console.error('📊 분석 결과:');
  console.error(`CHANGED_PAGES=${result.changedPages.join(',')}`);
  console.error(`IMPACT_LEVEL=${result.impactLevel}`);
  console.error(`TOTAL_PAGES=${result.changedPages.length}`);

  return result;
}

// GitHub Actions 환경변수로 출력
try {
  const analysis = detectChangedPages();

  // GitHub Actions 멀티라인 출력 형식
  process.stdout.write(`CHANGED_PAGES<<EOF\n`);
  process.stdout.write(`${analysis.changedPages.join(',')}\n`);
  process.stdout.write(`EOF\n`);

  // 단일 라인 출력
  process.stdout.write(`IMPACT_LEVEL=${analysis.impactLevel}\n`);
  process.stdout.write(
    `TOTAL_PAGES=${analysis.changedPages.length}\n`,
  );
} catch (error) {
  console.error('스크립트 실행 중 오류:', error.message);
  process.exit(1);
}
