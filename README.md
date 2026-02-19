# typescript-cli-template

A production-ready TypeScript CLI template with Commander.js, Vitest, ESLint, and Prettier. Clone it, build it, and have a working CLI in under 2 minutes.

## Features

- **TypeScript** with `strict: true` and ESM modules
- **Commander.js** with full type inference via `@commander-js/extra-typings`
- **Vitest** for unit and integration testing with V8 coverage
- **ESLint v9** flat config with `typescript-eslint` strict type-checked rules
- **Prettier** for consistent formatting
- **Structured I/O** — success output to stdout, errors to stderr, `--json` flag for machine-readable output
- **Correct exit codes** — 0 for success, 1 for errors, 2 for usage mistakes

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

## Quick Start

```bash
# Install dependencies
npm install

# Build
npm run build

# Run the CLI
node dist/index.js --help
node dist/index.js greet World
node dist/index.js --json greet --greeting "Hi" Alice
```

## Scripts

| Script                  | Description                      |
| ----------------------- | -------------------------------- |
| `npm run build`         | Compile TypeScript to `dist/`    |
| `npm start`             | Run the compiled CLI             |
| `npm run lint`          | Lint source and test files       |
| `npm run lint:fix`      | Lint and auto-fix                |
| `npm run format`        | Format all files with Prettier   |
| `npm run format:check`  | Check formatting without writing |
| `npm test`              | Run all tests once               |
| `npm run test:watch`    | Run tests in watch mode          |
| `npm run test:coverage` | Run tests with V8 coverage       |

## Project Structure

```
src/
├── index.ts             # Entry point (shebang, calls createProgram)
├── cli.ts               # Commander.js program setup
└── commands/
    └── greet.ts         # Sample command

tests/
├── unit/
│   └── greet.test.ts    # Unit tests for greet command
└── integration/
    └── cli.test.ts      # Integration tests (spawns CLI process)

package.json
tsconfig.json            # Base config (editor + ESLint)
tsconfig.build.json      # Build config (compilation only)
eslint.config.mjs
.prettierrc
vitest.config.ts
```

## Adding a New Command

1. Create a file in `src/commands/`:

```typescript
// src/commands/hello.ts
import type { Command } from '@commander-js/extra-typings';

export function registerHelloCommand(program: Command): void {
    program
        .command('hello')
        .description('Say hello')
        .argument('<name>', 'Who to greet')
        .action((name) => {
            process.stdout.write(`Hello, ${name}!\n`);
        });
}
```

2. Register it in `src/cli.ts`:

```typescript
import { registerHelloCommand } from './commands/hello.js';

// Inside createProgram(), after existing commands:
registerHelloCommand(program);
```

3. Build and run:

```bash
npm run build
node dist/index.js hello World
```

## CLI Usage

```
typescript-cli-template [options] [command]

Options:
  -V, --version           output the version number
  -j, --json              output in JSON format
  -h, --help              display help for command

Commands:
  greet [options] <name>  Greet someone by name
```

### Greet Command

```bash
# Basic usage
node dist/index.js greet World
# Hello, World!

# Custom greeting
node dist/index.js greet --greeting "Hi" Alice
# Hi, Alice!

# JSON output
node dist/index.js --json greet World
# {"greeting":"Hello","name":"World","message":"Hello, World!"}
```

## Publishing

```bash
# Preview package contents
npm pack --dry-run

# Install globally for local testing
npm link
typescript-cli-template --help

# Publish to npm
npm publish
```

## License

MIT
