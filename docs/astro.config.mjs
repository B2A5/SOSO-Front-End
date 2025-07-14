// @ts-check
// docs/astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    // React 지원 추가
    react(),

    starlight({
      title: 'SOSO FE Docs',
      description: 'SOSO 프론트엔드 개발 문서',
      customCss: ['./src/styles/global.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/B2A5/SOSO-Front-End',
        },
      ],
      sidebar: [
        {
          label: '시작하기',
          items: [
            {
              label: '환경 설정 및 실행',
              slug: 'start/installation',
            },
            {
              label: '워크플로우',
              slug: 'start/workflow',
            },
            {
              label: '코드 스타일 및 컨벤션',
              slug: 'start/codestyle',
            },
          ],
        },
        {
          label: '프로젝트 이해하기',
          items: [
            {
              label: '모노레포 구조',
              slug: 'project/monorepo',
            },
            {
              label: 'Next.js와 App Router',
              slug: 'project/nextjs',
            },
            {
              label: '라이브러리 및 프레임워크',
              slug: 'project/library',
            },
            {
              label: '상태 관리',
              slug: 'project/state',
            },
          ],
        },
        {
          label: '주요 라이브러리 학습하기',
          items: [
            {
              label: 'tailwind',
              slug: 'library/tailwind',
            },
          ],
        },
        {
          label: '컴포넌트 소개',
          items: [
            {
              label: 'Button',
              slug: 'components/button',
            },
          ],
        },
        {
          label: '개발 로그',
          items: [
            {
              label: '폰트 최적화',
              slug: 'log/font_optimization',
            },
          ],
        },
        // {
        //   label: '디자인 시스템',
        //   items: [
        //     { label: '색상', slug: 'design-system/colors' },
        //     { label: '타이포그래피', slug: 'design-system/typography' },
        //   ],
        // },
        // {
        //   label: '컴포넌트',
        //   items: [{ label: 'Button', slug: 'components/button' }],
        // },
      ],
    }),
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'github-dark',
        wrap: true,
      },
      remarkPlugins: [],
      rehypePlugins: [],
    }),
  ],
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },

    resolve: {
      alias: {
        '@soso/web': path.resolve('../apps/web/src'),
        '@': path.resolve('../apps/web/src'),
      },
    },

    plugins: [tailwindcss()],
  },
});
