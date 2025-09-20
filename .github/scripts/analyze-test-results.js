#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * 테스트 결과를 분석하고 PR 댓글용 마크다운을 생성합니다.
 */
function analyzeTestResults() {
  const testResultsPath = 'apps/web/coverage/test-results.json';
  const coverageSummaryPath =
    'apps/web/coverage/coverage-summary.json';

  let analysis = {
    testsRun: 0,
    testsPassed: 0,
    testsFailed: 0,
    testsSkipped: 0,
    coverage: null,
    newTests: [],
    failedTests: [],
  };

  // 테스트 결과 분석
  if (fs.existsSync(testResultsPath)) {
    try {
      const testResults = JSON.parse(
        fs.readFileSync(testResultsPath, 'utf8'),
      );

      // Vitest 결과 구조에 맞게 파싱
      if (testResults.testResults) {
        testResults.testResults.forEach((suite) => {
          suite.assertionResults?.forEach((test) => {
            analysis.testsRun++;
            switch (test.status) {
              case 'passed':
                analysis.testsPassed++;
                break;
              case 'failed':
                analysis.testsFailed++;
                analysis.failedTests.push({
                  name: test.title,
                  suite: suite.name,
                  error:
                    test.failureDetails?.[0]?.message ||
                    'Unknown error',
                });
                break;
              case 'skipped':
              case 'pending':
                analysis.testsSkipped++;
                break;
            }
          });
        });
      }
    } catch (error) {
      console.warn('테스트 결과 파일 파싱 실패:', error.message);
    }
  }

  // 커버리지 분석
  if (fs.existsSync(coverageSummaryPath)) {
    try {
      analysis.coverage = JSON.parse(
        fs.readFileSync(coverageSummaryPath, 'utf8'),
      );
    } catch (error) {
      console.warn('커버리지 파일 파싱 실패:', error.message);
    }
  }

  return analysis;
}

/**
 * 테스트 분석 결과를 마크다운으로 변환합니다.
 */
function generateTestMarkdown(analysis) {
  const {
    testsRun,
    testsPassed,
    testsFailed,
    testsSkipped,
    coverage,
    failedTests,
  } = analysis;

  let markdown = `### 🧪 테스트 실행 결과

**총 테스트**: ${testsRun}개
- ✅ **통과**: ${testsPassed}개
- ❌ **실패**: ${testsFailed}개
- ⏭️ **건너뜀**: ${testsSkipped}개

`;

  // 테스트 성공률 계산
  const successRate =
    testsRun > 0 ? ((testsPassed / testsRun) * 100).toFixed(1) : '0';
  const statusEmoji =
    testsFailed === 0 ? '🎉' : testsFailed <= 2 ? '⚠️' : '🚨';

  markdown += `**성공률**: ${statusEmoji} ${successRate}%

`;

  // 실패한 테스트가 있다면 표시
  if (failedTests.length > 0) {
    markdown += `<details>
<summary>❌ 실패한 테스트 (${failedTests.length}개)</summary>

`;
    failedTests.forEach((test) => {
      markdown += `**${test.suite}**
- \`${test.name}\`
  \`\`\`
  ${test.error.split('\n')[0]}
  \`\`\`

`;
    });
    markdown += `</details>

`;
  }

  // 커버리지 정보
  if (coverage?.total) {
    const { lines, functions, branches, statements } = coverage.total;

    markdown += `### 📊 코드 커버리지

| 구분 | 커버리지 | 상태 |
|------|----------|------|
| 라인 | ${lines.pct}% (${lines.covered}/${lines.total}) | ${getCoverageStatus(lines.pct)} |
| 함수 | ${functions.pct}% (${functions.covered}/${functions.total}) | ${getCoverageStatus(functions.pct)} |
| 브랜치 | ${branches.pct}% (${branches.covered}/${branches.total}) | ${getCoverageStatus(branches.pct)} |
| 구문 | ${statements.pct}% (${statements.covered}/${statements.total}) | ${getCoverageStatus(statements.pct)} |

`;

    // 커버리지가 낮은 파일들 표시
    const lowCoverageFiles = findLowCoverageFiles(coverage);
    if (lowCoverageFiles.length > 0) {
      markdown += `<details>
<summary>⚠️ 커버리지가 낮은 파일들 (70% 미만)</summary>

`;
      lowCoverageFiles.forEach((file) => {
        markdown += `- \`${file.name}\`: ${file.coverage}%
`;
      });
      markdown += `
</details>

`;
    }
  }

  return markdown;
}

/**
 * 커버리지 상태를 이모지로 표시합니다.
 */
function getCoverageStatus(percentage) {
  if (percentage >= 90) return '🟢 우수';
  if (percentage >= 80) return '🟡 양호';
  if (percentage >= 70) return '🟠 보통';
  return '🔴 낮음';
}

/**
 * 커버리지가 낮은 파일들을 찾습니다.
 */
function findLowCoverageFiles(coverage) {
  const lowCoverageFiles = [];

  Object.entries(coverage).forEach(([filePath, data]) => {
    if (filePath !== 'total' && data.lines?.pct < 70) {
      lowCoverageFiles.push({
        name: filePath.replace(/^.*\/src\//, 'src/'),
        coverage: data.lines.pct,
      });
    }
  });

  return lowCoverageFiles.sort((a, b) => a.coverage - b.coverage);
}

// 메인 실행
const analysis = analyzeTestResults();
const markdown = generateTestMarkdown(analysis);

// GitHub Actions 환경변수로 출력
console.log('TEST_ANALYSIS_MARKDOWN<<EOF');
console.log(markdown);
console.log('EOF');

// 추가 분석 정보를 개별 환경변수로 출력
console.log(
  `TEST_SUCCESS_RATE=${analysis.testsRun > 0 ? ((analysis.testsPassed / analysis.testsRun) * 100).toFixed(1) : '0'}`,
);
console.log(`TEST_TOTAL=${analysis.testsRun}`);
console.log(`TEST_PASSED=${analysis.testsPassed}`);
console.log(`TEST_FAILED=${analysis.testsFailed}`);

if (analysis.coverage?.total) {
  console.log(`COVERAGE_LINES=${analysis.coverage.total.lines.pct}`);
  console.log(
    `COVERAGE_FUNCTIONS=${analysis.coverage.total.functions.pct}`,
  );
  console.log(
    `COVERAGE_BRANCHES=${analysis.coverage.total.branches.pct}`,
  );
}
