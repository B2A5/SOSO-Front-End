#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * LHCI 결과에서 평균 점수를 계산하고 GitHub Actions Output으로 출력합니다.
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
      };
    }

    let totalPerformance = 0;
    let totalAccessibility = 0;
    let totalBestPractices = 0;
    let totalSeo = 0;
    let successfulPages = 0;

    files.forEach((file) => {
      try {
        const result = JSON.parse(fs.readFileSync(file, 'utf8'));

        if (result.categories) {
          totalPerformance += Math.round(
            result.categories.performance.score * 100,
          );
          totalAccessibility += Math.round(
            result.categories.accessibility.score * 100,
          );
          totalBestPractices += Math.round(
            result.categories['best-practices'].score * 100,
          );
          totalSeo += Math.round(result.categories.seo.score * 100);
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
    };
  }
}

// GitHub Actions 환경변수로 출력
try {
  const results = parseLHCIResults();

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
} catch (error) {
  console.error('스크립트 실행 중 오류:', error.message);
  process.exit(1);
}
