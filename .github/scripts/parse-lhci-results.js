#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * URL 경로에서 페이지 이름을 추출합니다.
 */
function getPageNameFromUrl(url) {
  const match = url.match(/\/main\/(.+)$/);
  return match ? match[1] : 'unknown';
}

/**
 * LHCI 결과에서 평균 점수와 페이지별 점수를 계산하고 GitHub Actions Output으로 출력합니다.
 */
function parseLHCIResults() {
  const resultsPath = '.lighthouseci';

  if (!fs.existsSync(resultsPath)) {
    console.error('LHCI 결과 폴더를 찾을 수 없습니다.');
    return {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
      status: 'failed',
      totalPages: 0,
      successfulPages: 0,
      pageResults: {},
    };
  }

  try {
    const files = fs
      .readdirSync(resultsPath)
      .filter((file) => file.endsWith('.json'))
      .map((file) => path.join(resultsPath, file));

    if (files.length === 0) {
      console.error('LHCI 결과 파일을 찾을 수 없습니다.');
      return {
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0,
        status: 'failed',
        totalPages: 0,
        successfulPages: 0,
        pageResults: {},
      };
    }

    let totalPerformance = 0;
    let totalAccessibility = 0;
    let totalBestPractices = 0;
    let totalSeo = 0;
    let successfulPages = 0;
    const pageResults = {};

    files.forEach((file) => {
      try {
        const result = JSON.parse(fs.readFileSync(file, 'utf8'));

        if (result.categories && result.requestedUrl) {
          const pageName = getPageNameFromUrl(result.requestedUrl);

          const scores = {
            performance: Math.round(
              result.categories.performance.score * 100,
            ),
            accessibility: Math.round(
              result.categories.accessibility.score * 100,
            ),
            bestPractices: Math.round(
              result.categories['best-practices'].score * 100,
            ),
            seo: Math.round(result.categories.seo.score * 100),
          };

          // 페이지별 점수 저장 (동일 페이지의 여러 실행 결과는 평균 계산)
          if (!pageResults[pageName]) {
            pageResults[pageName] = {
              ...scores,
              count: 1,
            };
          } else {
            pageResults[pageName].performance = Math.round(
              (pageResults[pageName].performance *
                pageResults[pageName].count +
                scores.performance) /
                (pageResults[pageName].count + 1),
            );
            pageResults[pageName].accessibility = Math.round(
              (pageResults[pageName].accessibility *
                pageResults[pageName].count +
                scores.accessibility) /
                (pageResults[pageName].count + 1),
            );
            pageResults[pageName].bestPractices = Math.round(
              (pageResults[pageName].bestPractices *
                pageResults[pageName].count +
                scores.bestPractices) /
                (pageResults[pageName].count + 1),
            );
            pageResults[pageName].seo = Math.round(
              (pageResults[pageName].seo *
                pageResults[pageName].count +
                scores.seo) /
                (pageResults[pageName].count + 1),
            );
            pageResults[pageName].count++;
          }

          totalPerformance += scores.performance;
          totalAccessibility += scores.accessibility;
          totalBestPractices += scores.bestPractices;
          totalSeo += scores.seo;
          successfulPages++;
        }
      } catch (error) {
        console.error(`파일 파싱 실패: ${file}`, error.message);
      }
    });

    if (successfulPages === 0) {
      return {
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0,
        status: 'failed',
        totalPages: files.length,
        successfulPages: 0,
        pageResults: {},
      };
    }

    return {
      performance: Math.round(totalPerformance / successfulPages),
      accessibility: Math.round(totalAccessibility / successfulPages),
      bestPractices: Math.round(totalBestPractices / successfulPages),
      seo: Math.round(totalSeo / successfulPages),
      status: 'success',
      totalPages: files.length,
      successfulPages: successfulPages,
      pageResults: pageResults,
    };
  } catch (error) {
    console.error('LHCI 결과 처리 중 오류:', error.message);
    return {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
      status: 'failed',
      totalPages: 0,
      successfulPages: 0,
      pageResults: {},
    };
  }
}

// GitHub Actions 환경변수로 출력
try {
  const results = parseLHCIResults();

  // 전체 평균 점수
  process.stdout.write(
    `LIGHTHOUSE_PERFORMANCE=${results.performance}\n`,
  );
  process.stdout.write(
    `LIGHTHOUSE_ACCESSIBILITY=${results.accessibility}\n`,
  );
  process.stdout.write(
    `LIGHTHOUSE_BEST_PRACTICES=${results.bestPractices}\n`,
  );
  process.stdout.write(`LIGHTHOUSE_SEO=${results.seo}\n`);
  process.stdout.write(`LIGHTHOUSE_STATUS=${results.status}\n`);
  process.stdout.write(
    `LIGHTHOUSE_TOTAL_PAGES=${results.totalPages}\n`,
  );
  process.stdout.write(
    `LIGHTHOUSE_SUCCESSFUL_PAGES=${results.successfulPages}\n`,
  );

  // 페이지별 점수 출력
  const pageOrder = [
    'community',
    'founder',
    'home',
    'maps',
    'profile',
  ];

  pageOrder.forEach((pageName) => {
    const pageData = results.pageResults[pageName];
    if (pageData) {
      const upperPageName = pageName.toUpperCase();
      process.stdout.write(
        `${upperPageName}_PERFORMANCE=${pageData.performance}\n`,
      );
      process.stdout.write(
        `${upperPageName}_ACCESSIBILITY=${pageData.accessibility}\n`,
      );
      process.stdout.write(
        `${upperPageName}_BEST_PRACTICES=${pageData.bestPractices}\n`,
      );
      process.stdout.write(`${upperPageName}_SEO=${pageData.seo}\n`);
    } else {
      // 페이지 데이터가 없는 경우 기본값
      const upperPageName = pageName.toUpperCase();
      process.stdout.write(`${upperPageName}_PERFORMANCE=0\n`);
      process.stdout.write(`${upperPageName}_ACCESSIBILITY=0\n`);
      process.stdout.write(`${upperPageName}_BEST_PRACTICES=0\n`);
      process.stdout.write(`${upperPageName}_SEO=0\n`);
    }
  });
} catch (error) {
  console.error('스크립트 실행 중 오류:', error.message);
  process.exit(1);
}
