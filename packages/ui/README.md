# @soso/ui

SOSO UI component library - Production-grade React components for SOSO applications.

## Installation

```bash
# Using pnpm
pnpm add @soso/ui

# Using npm
npm install @soso/ui

# Using yarn
yarn add @soso/ui
```

## Usage

```tsx
import { Button } from '@soso/ui';

function App() {
  return (
    <Button onClick={() => console.log('Clicked!')}>Click me</Button>
  );
}
```

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Build the library
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint
```

### Scripts

- `pnpm build` - Build the library (ESM + CJS + TypeScript declarations)
- `pnpm dev` - Build in watch mode
- `pnpm test` - Run unit tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate coverage report
- `pnpm test:ui` - Open Vitest UI
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Lint the codebase
- `pnpm clean` - Clean build artifacts

## Features

- ✅ **TypeScript**: Full TypeScript support with type definitions
- ✅ **Tree-shakeable**: ESM and CJS builds with tree-shaking support
- ✅ **Tested**: Comprehensive unit tests with Vitest
- ✅ **Accessible**: Built with accessibility in mind
- ✅ **Modern**: Uses latest React patterns and best practices

## Components

_(Component documentation will be added as components are developed)_

## License

MIT

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.
