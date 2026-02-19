# Quickstart: typescript-cli-template

**Date**: 2026-02-19
**Feature**: 001-build-cli-template

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

## Setup

```bash
# Clone the template
git clone <repository-url> my-cli-tool
cd my-cli-tool

# Install dependencies
npm install

# Build the project
npm run build
```

## Run the CLI

```bash
# Show help
node dist/index.js --help

# Show version
node dist/index.js --version

# Run the sample greet command
node dist/index.js greet World

# Run with JSON output
node dist/index.js --json greet World

# Run with a custom greeting
node dist/index.js greet --greeting "Hi" Alice
```

## Quality Checks

```bash
# Lint the codebase
npm run lint

# Check formatting
npm run format:check

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Add a New Command

1. Create a new file in `src/commands/` (e.g., `src/commands/hello.ts`):

```typescript
import type { Command } from 'commander';

export function registerHelloCommand(program: Command): void {
    program
        .command('hello')
        .description('Say hello')
        .action(() => {
            console.log('Hello from the new command!');
        });
}
```

2. Register the command in `src/cli.ts`:

```typescript
import { registerHelloCommand } from './commands/hello.js';

// Inside the createProgram function, after existing commands:
registerHelloCommand(program);
```

3. Build and test:

```bash
npm run build
node dist/index.js hello
node dist/index.js --help  # Verify it appears in help
```

## Publish

```bash
# Preview what will be published
npm pack --dry-run

# Link globally for local testing
npm link
typescript-cli-template --help

# Publish to npm (when ready)
npm publish
```

## Project Structure

```text
├── src/
│   ├── index.ts          # Entry point with shebang
│   ├── cli.ts            # Commander.js program setup
│   └── commands/
│       └── greet.ts      # Sample greet command
├── tests/
│   ├── unit/
│   │   └── greet.test.ts # Unit test for greet logic
│   └── integration/
│       └── cli.test.ts   # Integration test for CLI binary
├── dist/                 # Compiled output (git-ignored)
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
├── vitest.config.ts
└── .gitignore
```
