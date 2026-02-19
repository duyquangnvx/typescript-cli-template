# Tasks: Build TypeScript CLI Template

**Input**: Design documents from `/specs/001-build-cli-template/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Sample tests are included as template deliverables (FR-005). They are part of the template content that users receive, implemented in Phase 4 (US2).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Build output: `dist/` (git-ignored)
- Config files: repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency declarations, and build configuration

- [x] T001 Create package.json at repository root with name `typescript-cli-template`, version `0.1.0`, `"type": "module"`, description, `"engines": { "node": ">=20.0.0" }`, `"bin": { "typescript-cli-template": "dist/index.js" }`, `"files": ["dist"]`, and all npm scripts: build (`tsc`), start (`node dist/index.js`), lint (`eslint .`), lint:fix (`eslint . --fix`), format (`prettier --write .`), format:check (`prettier --check .`), test (`vitest run`), test:watch (`vitest`), test:coverage (`vitest run --coverage`). Declare dependencies: `commander`, `@commander-js/extra-typings`. Declare devDependencies: `typescript`, `@types/node`, `vitest`, `@vitest/coverage-v8`, `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-config-prettier`, `prettier`.
- [x] T002 [P] Create tsconfig.json at repository root with `"strict": true`, `"target": "es2022"`, `"module": "nodenext"`, `"moduleResolution": "nodenext"`, `"outDir": "dist"`, `"rootDir": "src"`, `"declaration": true`, `"sourceMap": true`, `"include": ["src"]`, `"exclude": ["node_modules", "dist", "tests"]`.
- [x] T003 [P] Create .gitignore at repository root ignoring `node_modules/`, `dist/`, `*.env`, `.env.*`, `coverage/`, `*.tsbuildinfo`.
- [x] T004 Run `npm install` to install all declared dependencies and generate package-lock.json.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Quality tooling configuration that MUST be complete before ANY source code is written

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Create eslint.config.mjs at repository root: import `@eslint/js` recommended config, import `typescript-eslint` and apply `tseslint.configs.strictTypeChecked`, import and append `eslint-config-prettier` to disable conflicting rules, set `languageOptions.parserOptions.projectService: true` for type-aware linting, configure `files: ["src/**/*.ts", "tests/**/*.ts"]`.
- [x] T006 [P] Create .prettierrc at repository root with settings: `"semi": true`, `"singleQuote": true`, `"trailingComma": "all"`, `"printWidth": 80`, `"tabWidth": 2`.
- [x] T007 [P] Create vitest.config.ts at repository root: import `defineConfig` from `vitest/config`, set `test.include` to `["tests/**/*.test.ts"]`, set `test.globals` to `false` (explicit imports), configure `test.coverage` with `provider: "v8"` and `reporter: ["text", "lcov"]` to enable the constitution's coverage gate.

**Checkpoint**: Foundation ready — all config files in place, `npm run lint`, `npm run format:check`, and `npm run build` should run (even if no source files exist yet). User story implementation can now begin.

---

## Phase 3: User Story 1 — Scaffold and Run a CLI Project (Priority: P1) 🎯 MVP

**Goal**: A developer can clone, install, build, and run a working CLI with `--help`, `--version`, and a sample `greet` command.

**Independent Test**: Run `npm install && npm run build`, then execute `node dist/index.js --help`, `node dist/index.js --version`, and `node dist/index.js greet World` — all produce correct output.

### Implementation for User Story 1

- [x] T008 [US1] Create src/index.ts as the CLI entry point: add `#!/usr/bin/env node` shebang on line 1, import the `createProgram` function from `./cli.js`, call `createProgram().parse()`.
- [x] T009 [US1] Create src/cli.ts with a `createProgram` function that: creates a new `Command` instance from `@commander-js/extra-typings`, sets `.name("typescript-cli-template")`, reads version from package.json (using `createRequire` from `node:module` to import the JSON), sets `.description(...)`, adds a global `-j, --json` option, configures `.configureOutput()` to route `writeOut` to `process.stdout` and `writeErr` to `process.stderr`, configures `.configureOutput({ outputError: ... })` to append "Run '--help' for usage information." to error messages for corrective action guidance (constitution III.UX), adds `.showHelpAfterError(false)` to keep error output concise, registers the greet command via import, and adds a post-parse hook or `program.action()` default handler that detects when no subcommand is provided — in that case, writes help to stderr via `program.outputHelp({ error: true })` and calls `process.exit(2)` (constitution III.UX exit code 2 for usage errors). Export `createProgram`.
- [x] T010 [US1] Create src/commands/greet.ts exporting a `registerGreetCommand(program: Command): void` function that: adds a `greet` subcommand with `<name>` required argument, `-g, --greeting <text>` option defaulting to `"Hello"`, and an action handler that formats `"${greeting}, ${name}!"` — outputting as JSON (`{ greeting, name, message }`) when the parent `--json` flag is set, or as plain text to stdout.
- [x] T011 [US1] Build and verify the CLI: run `npm run build`, then verify `node dist/index.js --help` prints usage with `greet` command listed, `node dist/index.js --version` prints `0.1.0`, `node dist/index.js greet World` prints `Hello, World!`, `node dist/index.js --json greet World` prints valid JSON, and running with no arguments prints help to stderr and exits with code 2.

**Checkpoint**: User Story 1 is fully functional. The CLI builds, runs, and demonstrates the core command pattern.

---

## Phase 4: User Story 2 — Run Quality Checks and Tests (Priority: P2)

**Goal**: A developer can run `npm run lint`, `npm run format:check`, and `npm test` and get clear pass/fail results. Sample tests demonstrate unit and integration testing patterns.

**Independent Test**: Run `npm run lint && npm run format:check && npm test` — all exit with code 0 and report zero errors.

### Implementation for User Story 2

- [x] T012 [P] [US2] Create tests/unit/greet.test.ts with unit tests for the greet command logic: test that `registerGreetCommand` registers a command named `greet`, test the command produces correct output for a given name, test the default greeting is `"Hello"`, test a custom `--greeting` option works.
- [x] T013 [P] [US2] Create tests/integration/cli.test.ts with integration tests that spawn the compiled CLI binary via `child_process.execFile`: test `--help` outputs usage to stdout and exits 0, test `--version` outputs version to stdout and exits 0, test `greet World` outputs `Hello, World!` to stdout and exits 0, test `greet --json World` outputs valid JSON to stdout and exits 0, test running with no arguments exits with code 2, test an unknown command exits with code 2.
- [x] T014 [US2] Run and verify all quality gates pass: `npm run lint` reports zero errors/warnings, `npm run format:check` reports no formatting issues, `npm run build` succeeds, `npm test` runs all sample tests and all pass.

**Checkpoint**: User Stories 1 AND 2 are both independently functional. Quality tooling works end-to-end.

---

## Phase 5: User Story 3 — Add a New Command (Priority: P3)

**Goal**: The command registration pattern is clear and extensible. A developer can add a new subcommand by creating one file and adding one import.

**Independent Test**: Create a new command file following the `greet.ts` pattern, register it in `cli.ts`, build, and verify it appears in `--help` output and executes correctly.

### Implementation for User Story 3

- [x] T015 [US3] Review and refine src/commands/greet.ts to ensure it follows a clean, replicable pattern: the file exports a single `registerGreetCommand(program: Command): void` function, all argument/option definitions and the action handler are self-contained, and the function signature serves as the canonical template for new commands.
- [x] T016 [US3] Review and refine src/cli.ts to ensure command registration is explicit and easy to extend: each command is registered via a separate import and function call (e.g., `registerGreetCommand(program)`), with a clear comment indicating where to add new commands.

**Checkpoint**: All three implemented stories are independently functional. The command extension pattern is clear and documented inline.

---

## Phase 6: User Story 4 — Publish as an npm Package (Priority: P4)

**Goal**: The template's package.json is correctly configured for npm distribution. `npm pack` produces a minimal tarball and `npm link` makes the CLI available globally.

**Independent Test**: Run `npm pack --dry-run` and verify only `dist/` and `package.json` are included. Run `npm link` and verify `typescript-cli-template --help` works globally.

### Implementation for User Story 4

- [x] T017 [US4] Verify and refine package.json distribution fields: confirm `"bin"` points to `dist/index.js`, `"files"` whitelists only `["dist"]`, `"engines"` specifies `"node": ">=20.0.0"`, and ensure the shebang in src/index.ts is preserved in the compiled dist/index.js output.
- [x] T018 [US4] Verify npm pack output: run `npm pack --dry-run` and confirm the tarball contains only dist/ files and package.json metadata — no src/, tests/, config files, or node_modules.

**Checkpoint**: All four user stories are independently functional. The template is ready for distribution.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and formatting pass across all source files

- [x] T019 [P] Run `prettier --write .` to ensure all source, test, and config files have consistent formatting.
- [x] T020 Run full end-to-end validation: `npm run lint && npm run format:check && npm run build && npm test` — all must pass with zero errors. Verify CLI startup time by timing `node dist/index.js --help` (must be under 200ms per SC-005).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T004 npm install) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on US1 (needs built CLI binary for integration tests)
- **User Story 3 (Phase 5)**: Depends on US1 (refines patterns established there)
- **User Story 4 (Phase 6)**: Depends on US1 (needs build output to verify packaging)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 being built (integration tests spawn the compiled CLI)
- **User Story 3 (P3)**: Depends on US1 patterns being established (reviews/refines them)
- **User Story 4 (P4)**: Depends on US1 being built (verifies packaged output)

### Within Each User Story

- T008 → T009 → T010 → T011 (US1: entry point → program → command → verify)
- T012, T013 can run in parallel (US2: unit and integration tests are independent files)
- T015, T016 can run in parallel (US3: refine command file and CLI file independently)
- T017 → T018 (US4: refine config → verify output)

### Parallel Opportunities

- T002, T003 can run in parallel with each other (Phase 1: both are config files)
- T005, T006, T007 can all run in parallel (Phase 2: independent config files)
- T012, T013 can run in parallel (Phase 4: independent test files)
- T015, T016 can run in parallel (Phase 5: independent source files)

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch all config file tasks together:
Task: T005 "Create eslint.config.mjs at repository root"
Task: T006 "Create .prettierrc at repository root"
Task: T007 "Create vitest.config.ts at repository root"
```

## Parallel Example: User Story 2

```bash
# Launch both test files together:
Task: T012 "Create tests/unit/greet.test.ts"
Task: T013 "Create tests/integration/cli.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T007)
3. Complete Phase 3: User Story 1 (T008–T011)
4. **STOP and VALIDATE**: Build passes, CLI runs, greet command works
5. Demo-ready MVP

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Build + run CLI (MVP!)
3. Add User Story 2 → Tests pass, quality gates green
4. Add User Story 3 → Command pattern verified extensible
5. Add User Story 4 → Package ready for npm publish
6. Polish → Final formatting and performance validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- US2 depends on US1 build output (integration tests spawn the compiled binary)
- US3 and US4 are refinement/validation stories — lighter than US1/US2
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
