# Implementation Plan: Build TypeScript CLI Template

**Branch**: `001-build-cli-template` | **Date**: 2026-02-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-build-cli-template/spec.md`

## Summary

Build a production-ready TypeScript CLI template that provides a
working project skeleton out of the box. The template uses Commander.js
for CLI argument parsing, Vitest for testing, ESLint + Prettier for
code quality, and ESM modules throughout. A developer should be able
to clone, install, build, and run a sample CLI command within 2 minutes.

## Technical Context

**Language/Version**: TypeScript 5.x targeting ES2022, Node.js >= 20.0.0
**Primary Dependencies**: commander (CLI framework), @commander-js/extra-typings (TypeScript support)
**Storage**: N/A (stateless CLI)
**Testing**: Vitest (unit + integration tests)
**Target Platform**: Node.js >= 20.0.0 (macOS, Linux, Windows)
**Project Type**: Single project (`src/` + `tests/` at root)
**Performance Goals**: <200ms startup time, <5 MB package size
**Constraints**: <200ms CLI startup, <256 MB memory for 10 MB inputs, ESM only
**Scale/Scope**: Template project — ~10-15 source files, 1 sample command

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Check

| Principle             | Gate                                       | Status                                               |
| --------------------- | ------------------------------------------ | ---------------------------------------------------- |
| I. Code Quality       | TypeScript `strict: true` in tsconfig.json | PASS — planned in R5                                 |
| I. Code Quality       | ESLint + Prettier with zero tolerance      | PASS — planned in R3, R4                             |
| I. Code Quality       | Explicit return types, no implicit `any`   | PASS — enforced by `strictTypeChecked` ESLint config |
| I. Code Quality       | `kebab-case` file names                    | PASS — all planned files use kebab-case              |
| II. Testing Standards | Unit tests for public APIs                 | PASS — sample unit test planned                      |
| II. Testing Standards | Integration tests for CLI commands         | PASS — CLI subprocess test planned                   |
| II. Testing Standards | Deterministic tests                        | PASS — no network/time/shared state                  |
| III. UX Consistency   | `--help`, `--version` on all commands      | PASS — Commander.js built-in                         |
| III. UX Consistency   | stdout/stderr separation                   | PASS — output utility planned                        |
| III. UX Consistency   | `--json` flag                              | PASS — global option planned                         |
| III. UX Consistency   | Exit codes 0/1/2                           | PASS — Commander.js error handling                   |
| IV. Performance       | <200ms startup                             | PASS — Commander.js is lightweight                   |
| IV. Performance       | Dependency size budget <5 MB               | PASS — commander ~300 KB installed                   |

**Result**: All gates PASS. No violations to justify.

### Post-Phase 1 Re-check

All gates remain PASS. The design adds no additional dependencies
beyond those evaluated above. Vitest is a devDependency and does not
affect runtime performance or package size.

## Project Structure

### Documentation (this feature)

```text
specs/001-build-cli-template/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── cli-interface.md # CLI interface contract
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── index.ts             # Entry point (#!/usr/bin/env node shebang)
├── cli.ts               # Commander.js program factory
└── commands/
    └── greet.ts         # Sample greet subcommand

tests/
├── unit/
│   └── greet.test.ts    # Unit test for greet command logic
└── integration/
    └── cli.test.ts      # Integration test: spawn CLI, assert output

package.json             # npm config, scripts, bin, files, engines
tsconfig.json            # TypeScript strict ESM config
eslint.config.mjs        # ESLint flat config with typescript-eslint
.prettierrc              # Prettier formatting rules
vitest.config.ts         # Vitest test configuration
.gitignore               # Node.js/TypeScript ignores
```

**Structure Decision**: Single project layout selected per spec
assumptions. `src/` contains all source code, `tests/` contains all
tests split into `unit/` and `integration/` subdirectories. Build
output goes to `dist/` (git-ignored). No models/, services/, or lib/
subdirectories needed — the CLI template is intentionally minimal with
a flat `commands/` directory as the primary extension point.

## Complexity Tracking

> No constitution violations detected. Table intentionally empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| —         | —          | —                                    |
