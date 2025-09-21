#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

/**
 * 여러 페이지에 대해 Lighthouse를 실행하고 결과를 집계합니다.
 */
async function runLighthouseMultiPage() {
  const baseUrl =
    process.env.LIGHTHOUSE_BASE_URL || 'http://localhost:3000';
  const changedPages = (process.env.CHANGED_PAGES || '/')
    .split(',')
    .filter(Boolean);
  const maxPages = parseInt(process.env.MAX_LIGHTHOUSE_PAGES || '5');

  console.log(`🌐 Base URL: ${baseUrl}`);
  console.log(`📄 측정 대상 페이지: ${changedPages.join(', ')}`);

  const results = [];
  const pagesToTest = changedPages.slice(0, maxPages); // 최대 페이지 수 제한

  // 각 페이지별 Lighthouse 실행
  for (const page of pagesToTest) {
    const url = `${baseUrl}${page}`;
    console.log(`⚡ Lighthouse 측정 중: ${url}`);

    try {
      // Lighthouse 실행
      const reportPath = `./lighthouse-${page.replace(/\//g, '_')}.json`;
      execSync(
        `npx lighthouse "${url}" ` +
          `--output=json ` +
          `--output-path="${reportPath}" ` +
          `--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" ` +
          `--quiet`,
        { stdio: 'pipe' },
      );

      // 결과 파싱
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(
          fs.readFileSync(reportPath, 'utf8'),
        );
        const categories = report.categories;

        const pageResult = {
          page,
          url,
          scores: {
            performance: Math.round(
              categories.performance.score * 100,
            ),
            accessibility: Math.round(
              categories.accessibility.score * 100,
            ),
            bestPractices: Math.round(
              categories['best-practices'].score * 100,
            ),
            seo: Math.round(categories.seo.score * 100),
          },
          metrics: {
            fcp: report.audits['first-contentful-paint']
              ?.numericValue,
            lcp: report.audits['largest-contentful-paint']
              ?.numericValue,
            cls: report.audits['cumulative-layout-shift']
              ?.numericValue,
            tti: report.audits['interactive']?.numericValue,
          },
        };

        results.push(pageResult);
        console.log(
          `✅ ${page}: Performance ${pageResult.scores.performance}점`,
        );

        // 개별 페이지 결과 출력
        console.log(
          `LIGHTHOUSE_${page.replace(/\//g, '_').toUpperCase()}_PERFORMANCE=${pageResult.scores.performance}`,
        );
        console.log(
          `LIGHTHOUSE_${page.replace(/\//g, '_').toUpperCase()}_ACCESSIBILITY=${pageResult.scores.accessibility}`,
        );

        // 정리
        fs.unlinkSync(reportPath);
      }
    } catch (error) {
      console.error(`❌ ${page} 측정 실패:`, error.message);
      results.push({
        page,
        url,
        error: error.message,
        scores: {
          performance: 0,
          accessibility: 0,
          bestPractices: 0,
          seo: 0,
        },
      });
    }
  }

  // 전체 결과 집계
  const summary = calculateSummary(results);
  outputResults(results, summary);

  return { results, summary };
}

/**
 * 결과 요약 계산
 */
function calculateSummary(results) {
  const validResults = results.filter((r) => !r.error);

  if (validResults.length === 0) {
    return {
      averagePerformance: 0,
      averageAccessibility: 0,
      totalPages: results.length,
      successfulPages: 0,
      status: 'failed',
    };
  }

  const summary = {
    averagePerformance: Math.round(
      validResults.reduce((sum, r) => sum + r.scores.performance, 0) /
        validResults.length,
    ),
    averageAccessibility: Math.round(
      validResults.reduce(
        (sum, r) => sum + r.scores.accessibility,
        0,
      ) / validResults.length,
    ),
    averageBestPractices: Math.round(
      validResults.reduce(
        (sum, r) => sum + r.scores.bestPractices,
        0,
      ) / validResults.length,
    ),
    averageSeo: Math.round(
      validResults.reduce((sum, r) => sum + r.scores.seo, 0) /
        validResults.length,
    ),
    totalPages: results.length,
    successfulPages: validResults.length,
    failedPages: results.filter((r) => r.error).length,
    status: validResults.length > 0 ? 'success' : 'failed',
  };

  return summary;
}

/**
 * GitHub Actions 환경변수로 결과 출력
 */
function outputResults(results, summary) {
  // 전체 요약
  console.log(`LIGHTHOUSE_PERFORMANCE=${summary.averagePerformance}`);
  console.log(
    `LIGHTHOUSE_ACCESSIBILITY=${summary.averageAccessibility}`,
  );
  console.log(
    `LIGHTHOUSE_BEST_PRACTICES=${summary.averageBestPractices}`,
  );
  console.log(`LIGHTHOUSE_SEO=${summary.averageSeo}`);
  console.log(`LIGHTHOUSE_STATUS=${summary.status}`);
  console.log(`LIGHTHOUSE_TOTAL_PAGES=${summary.totalPages}`);
  console.log(
    `LIGHTHOUSE_SUCCESSFUL_PAGES=${summary.successfulPages}`,
  );

  // 상세 결과 (마크다운)
  console.log(`LIGHTHOUSE_DETAILED_RESULTS<<EOF`);

  let markdown = `### ⚡ 페이지별 Lighthouse 분석 결과\n\n`;
  markdown += `**📊 전체 요약** (${summary.successfulPages}/${summary.totalPages} 페이지 성공)\n\n`;

  if (summary.successfulPages > 0) {
    markdown += `| 지표 | 평균 점수 | 상태 |\n`;
    markdown += `|------|----------|------|\n`;
    markdown += `| 🚀 Performance | ${summary.averagePerformance}점 | ${getScoreStatus(summary.averagePerformance)} |\n`;
    markdown += `| ♿ Accessibility | ${summary.averageAccessibility}점 | ${getScoreStatus(summary.averageAccessibility)} |\n`;
    markdown += `| ✅ Best Practices | ${summary.averageBestPractices}점 | ${getScoreStatus(summary.averageBestPractices)} |\n`;
    markdown += `| 🔍 SEO | ${summary.averageSeo}점 | ${getScoreStatus(summary.averageSeo)} |\n\n`;

    markdown += `<details>\n<summary>📄 페이지별 상세 결과</summary>\n\n`;
    markdown += `| 페이지 | Performance | Accessibility | Best Practices | SEO | 상태 |\n`;
    markdown += `|--------|-------------|---------------|----------------|-----|------|\n`;

    results.forEach((result) => {
      if (result.error) {
        markdown += `| ${result.page} | - | - | - | - | ❌ 측정 실패 |\n`;
      } else {
        const { scores } = result;
        markdown += `| ${result.page} | ${scores.performance}점 | ${scores.accessibility}점 | ${scores.bestPractices}점 | ${scores.seo}점 | ✅ 성공 |\n`;
      }
    });

    markdown += `\n</details>\n\n`;
  } else {
    markdown += `❌ 모든 페이지에서 Lighthouse 측정에 실패했습니다.\n\n`;
  }

  if (summary.failedPages > 0) {
    markdown += `⚠️ **${summary.failedPages}개 페이지에서 측정 실패**\n`;
    markdown += `- Vercel 배포 URL을 확인해주세요\n`;
    markdown += `- 페이지가 정상적으로 로드되는지 확인해주세요\n\n`;
  }

  console.log(markdown);
  console.log(`EOF`);
}

/**
 * 점수 상태 표시
 */
function getScoreStatus(score) {
  if (score >= 90) return '🟢 우수';
  if (score >= 75) return '🟡 양호';
  if (score >= 50) return '🟠 보통';
  return '🔴 개선 필요';
}

// 메인 실행
if (require.main === module) {
  runLighthouseMultiPage().catch(console.error);
}
