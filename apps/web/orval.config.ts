import { defineConfig } from 'orval';

export default defineConfig({
  soso: {
    input: {
      target: 'https://soso.dreampaste.com/v3/api-docs',
    },
    output: {
      mode: 'tags-split',
      target: './src/generated/api/endpoints',
      schemas: './src/generated/api/models',
      client: 'react-query',
      mock: false,
      prettier: true,
      override: {
        mutator: {
          path: './src/lib/api-client.ts',
          name: 'customInstance',
        },
        useDates: false,
      },
      fileExtension: '.ts',
      tsconfig: './tsconfig.json',
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
