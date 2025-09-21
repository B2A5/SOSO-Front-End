#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * PR에서 변경된 파일들을 분석하여 영향받는 페이지 경로를 감지합니다.
 */
function detectChangedPages() {
  const changedFiles =
    process.env.CHANGED_FILES?.split('\n').filter(Boolean) || [];
  const pages = new Set();
  const components = new Set();

  console.log('🔍 변경된 파일 분석 중...');
  console.log('CHANGED_FILES=' + JSON.stringify(changedFiles));

  changedFiles.forEach((file) => {
    console.log(`📁 분석 중: ${file}`);

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
        console.log(`📄 페이지 감지: ${route}`);
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
          console.log(`🏗️ 루트 레이아웃 변경 - 모든 페이지 영향`);
        } else {
          const route = `/${layoutPath}`;
          pages.add(route);
          console.log(`🏗️ 레이아웃 감지: ${route}`);
        }
      }
    }

    // 공통 컴포넌트 변경 감지
    else if (file.startsWith('apps/web/src/components/')) {
      components.add(file);
      console.log(`🧩 공통 컴포넌트 변경: ${file}`);

      // 공통 컴포넌트 변경 시 대표 페이지들 측정
      if (components.size > 0) {
        pages.add('/');
        pages.add('/main');
        console.log(`🧩 공통 컴포넌트 영향으로 대표 페이지 추가`);
      }
    }

    // 스타일 파일 변경
    else if (
      file.endsWith('.css') ||
      file.endsWith('.scss') ||
      file.includes('tailwind')
    ) {
      console.log(`🎨 스타일 변경 감지 - 모든 페이지 영향`);
      pages.add('/');
      pages.add('/main');
    }

    // 설정 파일 변경
    else if (
      file.includes('next.config') ||
      file.includes('package.json')
    ) {
      console.log(`⚙️ 설정 파일 변경 - 전체 앱 영향`);
      pages.add('/');
      pages.add('/main');
      pages.add('/auth');
    }
  });

  const result = {
    changedPages: Array.from(pages),
    changedComponents: Array.from(components),
    impactLevel:
      pages.size > 3 ? 'high' : pages.size > 1 ? 'medium' : 'low',
  };

  console.log('📊 분석 결과:');
  console.log(`CHANGED_PAGES=${result.changedPages.join(',')}`);
  console.log(`IMPACT_LEVEL=${result.impactLevel}`);
  console.log(`TOTAL_PAGES=${result.changedPages.length}`);

  return result;
}

// GitHub Actions 환경변수로 출력
const analysis = detectChangedPages();

console.log(`CHANGED_PAGES<<EOF`);
console.log(analysis.changedPages.join(','));
console.log(`EOF`);

console.log(`IMPACT_LEVEL=${analysis.impactLevel}`);
console.log(`TOTAL_PAGES=${analysis.changedPages.length}`);
console.log(
  `CHANGED_COMPONENTS=${analysis.changedComponents.length}`,
);
