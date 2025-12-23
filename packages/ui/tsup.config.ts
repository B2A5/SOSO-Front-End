import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry points
  entry: ['src/index.ts'],

  // Output formats
  format: ['esm', 'cjs'],

  // Generate TypeScript declaration files
  dts: true,

  // Code splitting for better tree-shaking
  splitting: true,

  // Source maps for debugging
  sourcemap: true,

  // Clean output directory before build
  clean: true,

  // Minify output
  minify: false,

  // External dependencies (not bundled)
  external: ['react', 'react-dom'],

  // Tree-shaking
  treeshake: true,

  // Target environment
  target: 'es2020',

  // Output directory
  outDir: 'dist',

  // TypeScript config
  tsconfig: './tsconfig.json',

  // Skip node_modules bundling
  skipNodeModulesBundle: true,
});
