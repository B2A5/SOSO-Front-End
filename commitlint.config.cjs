module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 타입 제한
    'type-enum': [
      2,
      'always',
      [
        'feat', // 새로운 기능 추가
        'fix', // 버그 수정
        'docs', // 문서 수정
        'style', // 코드 스타일 변경 (포맷팅, 세미콜론 누락 등)
        'refactor', // 코드 리팩토링
        'test', // 테스트 코드 추가/수정
        'chore', // 빌드 과정 또는 보조 도구 변경
        'perf', // 성능 개선
        'ci', // CI 설정 변경
        'build', // 빌드 시스템 변경
        'revert', // 이전 커밋 되돌리기
      ],
    ],
    // 제목 길이 제한
    'subject-max-length': [2, 'always', 100],
    'subject-min-length': [2, 'always', 10],
    // 제목 케이스 (소문자로 시작)
    'subject-case': [2, 'always', 'lower-case'],
    // 제목 끝에 마침표 허용
    'subject-full-stop': [0], // 비활성화
    // 빈 줄 금지
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    // 한국어 허용을 위한 설정
    'subject-case': [0], // 케이스 규칙 비활성화 (한국어 지원)
  },
};
