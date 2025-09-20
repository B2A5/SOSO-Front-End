#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * 번들 크기 변화를 분석하고 비교합니다.
 * 이전 빌드와 현재 빌드를 비교하여 변화량을 측정합니다.
 */
function analyzeBundleDiff() {
  const currentBuildPath = 'apps/web/.next/static';
  const manifestPath = 'apps/web/.next/build-manifest.json';

  let analysis = {
    totalSizeChange: 0,
    newFiles: [],
    deletedFiles: [],
    modifiedFiles: [],
    recommendations: [],
    bundleMapping: {},
  };

  // 현재 빌드 정보 수집
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(
        fs.readFileSync(manifestPath, 'utf8'),
      );

      // 페이지별 번들 정보 분석 및 매핑
      Object.entries(manifest.pages || {}).forEach(
        ([page, files]) => {
          const jsFiles = files.filter((file) =>
            file.endsWith('.js'),
          );

          // 파일별 사이즈 및 매핑 정보 수집
          jsFiles.forEach((file) => {
            const filePath = path.join(currentBuildPath, file);
            if (fs.existsSync(filePath)) {
              const size = fs.statSync(filePath).size;
              const fileName = path.basename(file);

              // 파일 타입 분류
              let fileType = 'unknown';
              let displayName = fileName;

              if (fileName.includes('_app')) {
                fileType = 'app';
                displayName = '🚀 App Shell';
              } else if (fileName.includes('_error')) {
                fileType = 'error';
                displayName = '❌ Error Page';
              } else if (fileName.includes('_document')) {
                fileType = 'document';
                displayName = '📄 Document';
              } else if (fileName.includes('layout')) {
                fileType = 'layout';
                displayName = `📐 Layout (${page})`;
              } else if (fileName.includes('page')) {
                fileType = 'page';
                displayName = `📄 Page (${page})`;
              } else if (fileName.match(/^\d+/)) {
                fileType = 'chunk';
                displayName = `📦 Shared Chunk (${fileName.split('-')[0]})`;
              } else if (fileName.includes('framework')) {
                fileType = 'framework';
                displayName = '⚛️ React Framework';
              } else if (fileName.includes('main')) {
                fileType = 'main';
                displayName = '🏠 Main Bundle';
              } else if (fileName.includes('polyfill')) {
                fileType = 'polyfill';
                displayName = '🔧 Polyfills';
              }

              analysis.bundleMapping[fileName] = {
                displayName,
                fileType,
                size,
                page,
                formattedSize: formatBytes(size),
              };
            }
          });

          const totalSize = jsFiles.reduce((acc, file) => {
            const filePath = path.join(currentBuildPath, file);
            if (fs.existsSync(filePath)) {
              return acc + fs.statSync(filePath).size;
            }
            return acc;
          }, 0);

          if (totalSize > 500 * 1024) {
            // 500KB 이상
            analysis.recommendations.push({
              type: 'large-bundle',
              page,
              size: formatBytes(totalSize),
              message: `페이지 ${page}의 번들이 큽니다 (${formatBytes(totalSize)}). 코드 스플리팅을 고려하세요.`,
            });
          }
        },
      );

      // 중복 라이브러리 체크
      const allFiles = Object.values(manifest.pages || {}).flat();
      const libraryUsage = {};

      allFiles.forEach((file) => {
        // 라이브러리 패턴 감지 (간단한 휴리스틱)
        const match = file.match(/chunks\/(.+?)[\.-]/);
        if (match) {
          const libName = match[1];
          libraryUsage[libName] = (libraryUsage[libName] || 0) + 1;
        }
      });

      Object.entries(libraryUsage).forEach(([lib, count]) => {
        if (count > 3) {
          analysis.recommendations.push({
            type: 'duplicate-library',
            library: lib,
            count,
            message: `라이브러리 ${lib}가 ${count}개 청크에서 발견되었습니다. 공통 청크로 분리를 고려하세요.`,
          });
        }
      });
    } catch (error) {
      console.warn('Build manifest 분석 실패:', error.message);
    }
  }

  return analysis;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  );
}

function generateBundleRecommendations(analysis) {
  let markdown = '';

  // 번들 매핑 정보 표시
  if (Object.keys(analysis.bundleMapping).length > 0) {
    markdown += `### 📦 번들 구성 상세

| 파일 유형 | 크기 | 설명 |
|-----------|------|------|
`;

    // 파일 타입별로 그룹화하여 표시
    const groupedByType = {};
    Object.entries(analysis.bundleMapping).forEach(
      ([fileName, info]) => {
        if (!groupedByType[info.fileType]) {
          groupedByType[info.fileType] = [];
        }
        groupedByType[info.fileType].push(info);
      },
    );

    // 타입별 우선순위 정렬
    const typeOrder = [
      'app',
      'main',
      'framework',
      'page',
      'layout',
      'chunk',
      'polyfill',
      'error',
      'unknown',
    ];

    typeOrder.forEach((type) => {
      if (groupedByType[type]) {
        groupedByType[type]
          .sort((a, b) => b.size - a.size) // 크기 순 정렬
          .forEach((info) => {
            markdown += `| ${info.displayName} | \`${info.formattedSize}\` | ${info.page !== '/' ? `페이지: ${info.page}` : '공통'} |
`;
          });
      }
    });

    markdown += `

`;
  }

  // 최적화 권장사항
  if (analysis.recommendations.length > 0) {
    markdown += `### 🎯 번들 최적화 권장사항

`;

    analysis.recommendations.forEach((rec, index) => {
      const emoji = rec.type === 'large-bundle' ? '📦' : '🔄';
      markdown += `${index + 1}. ${emoji} ${rec.message}
`;
    });

    markdown += `
<details>
<summary>💡 최적화 가이드</summary>

**번들 크기 줄이기:**
- 불필요한 라이브러리 제거
- Tree shaking 활용 (사용하지 않는 코드 제거)
- Dynamic imports 사용 (\`import()\` 구문)
- 이미지 최적화 및 WebP 포맷 사용

**코드 스플리팅 전략:**
- 페이지별 번들 자동 분리 (Next.js 기본)
- 공통 컴포넌트 청크 생성
- Lazy loading 적용 (\`React.lazy()\`)
- 라이브러리별 청크 분리

**성능 모니터링:**
- 번들 분석기로 정기적 검토
- Core Web Vitals 지표 확인
- 중요 리소스 우선순위 설정

</details>

`;
  }

  return markdown;
}

// 메인 실행
const analysis = analyzeBundleDiff();
const recommendations = generateBundleRecommendations(analysis);

console.log('BUNDLE_RECOMMENDATIONS<<EOF');
console.log(recommendations);
console.log('EOF');
