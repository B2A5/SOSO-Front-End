import { spawn } from 'child_process';

// Bundle Analyzer 활성화
process.env.ANALYZE = 'true';

console.log('📊 Starting Next.js build with bundle analyzer...\n');

// next build 실행
const build = spawn('next', ['build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env },
});

build.on('close', (code) => {
  process.exit(code);
});
