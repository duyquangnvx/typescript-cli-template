# Feature Specification: Build TypeScript CLI Template

**Feature Branch**: `001-build-cli-template`
**Created**: 2026-02-19
**Status**: Draft
**Input**: User description: "build typescript-cli-template"

## Clarifications

### Session 2026-02-19

- Q: Which CLI framework should the template use? → A: Commander.js
- Q: Which module system should the project use? → A: ESM only
- Q: Which test framework should the template use? → A: Vitest

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Scaffold and Run a CLI Project (Priority: P1)

A developer clones or copies the template repository and wants to
immediately have a working CLI tool. They install dependencies, run
the build, and execute a sample command to verify everything works
out of the box.

**Why this priority**: Without a working project skeleton, nothing
else matters. This is the foundational value of the template.

**Independent Test**: Can be fully tested by cloning the repo,
running `npm install && npm run build`, then executing the compiled
CLI binary with `--help` and `--version` flags to confirm it
produces correct output.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the template, **When** the developer
   runs `npm install`, **Then** all dependencies install without
   errors.
2. **Given** dependencies are installed, **When** the developer runs
   `npm run build`, **Then** TypeScript compiles to JavaScript
   without errors.
3. **Given** the project is built, **When** the developer runs the
   CLI entry point with `--help`, **Then** a usage synopsis with
   available commands and options is printed to stdout.
4. **Given** the project is built, **When** the developer runs the
   CLI entry point with `--version`, **Then** the current version
   from package.json is printed to stdout.
5. **Given** the project is built, **When** the developer runs the
   included sample command (e.g., `greet`), **Then** meaningful
   output is printed to stdout demonstrating a working command.

---

### User Story 2 - Run Quality Checks and Tests (Priority: P2)

A developer wants to verify code quality and run the test suite.
They execute lint, format, and test commands and get clear pass/fail
results. This validates that the quality infrastructure is fully
configured from day one.

**Why this priority**: The constitution mandates strict quality
gates. Developers need these tools working immediately so they can
follow the Red-Green-Refactor cycle from their first contribution.

**Independent Test**: Can be fully tested by running
`npm run lint`, `npm run format:check`, and `npm test` and
confirming each produces a zero exit code and meaningful output.

**Acceptance Scenarios**:

1. **Given** a fresh clone with dependencies installed, **When** the
   developer runs `npm run lint`, **Then** ESLint runs against all
   source files with zero errors and zero warnings.
2. **Given** dependencies are installed, **When** the developer runs
   `npm run format:check`, **Then** Prettier verifies all source
   files match formatting rules.
3. **Given** dependencies are installed, **When** the developer runs
   `npm test`, **Then** the test runner executes all unit and
   integration tests and reports results.
4. **Given** sample tests exist, **When** tests execute, **Then**
   all sample tests pass, demonstrating the testing patterns.
5. **Given** the developer introduces a lint violation, **When** they
   run `npm run lint`, **Then** ESLint reports the specific file,
   line, and rule violated.

---

### User Story 3 - Add a New Command (Priority: P3)

A developer wants to extend the CLI with a new subcommand. They
follow the established patterns in the template to create a new
command module, register it, and write tests for it.

**Why this priority**: After scaffolding and quality tools work,
developers need clear conventions for adding their own functionality.
This story validates that the template is extensible and patterns
are easy to follow.

**Independent Test**: Can be fully tested by creating a new command
file following the existing sample command structure, registering it,
building, and running it from the CLI.

**Acceptance Scenarios**:

1. **Given** a working template project, **When** the developer
   creates a new command module following the sample pattern, **Then**
   the command file structure is consistent with existing commands.
2. **Given** a new command module exists, **When** the developer
   registers it in the CLI entry point, **Then** it appears in the
   `--help` output alongside existing commands.
3. **Given** a registered command, **When** the developer runs
   `npm run build` and invokes the new command, **Then** it executes
   and produces output to stdout.
4. **Given** a new command, **When** the developer writes a unit test
   following the sample test pattern, **Then** the test runner
   discovers and executes it.

---

### User Story 4 - Publish as an npm Package (Priority: P4)

A developer wants to distribute the CLI as an installable npm
package. The template's package.json is pre-configured so that
publishing and global installation work without additional setup.

**Why this priority**: Distribution is the end goal but depends on
all prior stories being complete. The template should provide
correct packaging configuration from the start.

**Independent Test**: Can be tested by running `npm pack` and
verifying the tarball contains the correct files, or by using
`npm link` to install globally and running the CLI by its bin name.

**Acceptance Scenarios**:

1. **Given** a built project, **When** the developer runs `npm pack`,
   **Then** a tarball is created containing only the compiled output
   and necessary metadata (no source files or test files).
2. **Given** package.json defines a `bin` field, **When** the
   developer runs `npm link`, **Then** the CLI is available globally
   by its configured command name.
3. **Given** the CLI is installed globally, **When** the user runs
   the command name with `--help`, **Then** the same help output
   appears as when running from the project directory.

---

### Edge Cases

- What happens when a developer runs the CLI without any arguments?
  The CLI MUST print a helpful usage message to stderr and exit with
  code 2.
- What happens when a developer invokes a non-existent subcommand?
  The CLI MUST print an error to stderr naming the unknown command
  and exit with code 2. The error message SHOULD suggest running
  `--help` for a list of available commands.
- What happens when the developer runs `npm run build` with a type
  error in the source? TypeScript compilation MUST fail with a
  clear error message and non-zero exit code.
- What happens when the developer runs `npm test` with no test
  files? The test runner MUST exit cleanly (not crash) and indicate
  that no tests were found.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The template MUST include a working `package.json`
  with name, version, description, bin entry, scripts (build, lint,
  format, test, start), and appropriate dependency declarations.
- **FR-002**: The template MUST include a `tsconfig.json` with
  `strict: true` and appropriate compiler options for a Node.js CLI
  application.
- **FR-003**: The template MUST include ESLint configuration for
  TypeScript with rules enforcing the code quality principles from
  the constitution.
- **FR-004**: The template MUST include Prettier configuration for
  consistent code formatting.
- **FR-005**: The template MUST include a test framework
  configuration with at least one sample unit test and one sample
  integration test demonstrating testing patterns.
- **FR-006**: The template MUST include a CLI entry point that
  supports subcommands, `--help`, `--version`, and `--json` flags.
- **FR-007**: The template MUST include at least one sample
  subcommand (e.g., `greet`) demonstrating the command pattern:
  argument parsing, validation, stdout output, and stderr error
  handling.
- **FR-008**: The template MUST include a `.gitignore` configured
  for Node.js/TypeScript projects (ignoring `node_modules/`,
  build output, environment files).
- **FR-009**: The template MUST produce a compiled JavaScript
  output that can be executed directly with Node.js.
- **FR-010**: The template MUST include npm scripts for all
  quality gates defined in the constitution: `lint`, `format:check`,
  `format`, `build`, and `test`.
- **FR-011**: The CLI MUST send success output to stdout and
  error/diagnostic messages to stderr.
- **FR-012**: The CLI MUST use exit code 0 for success, 1 for
  general errors, and 2 for usage/argument errors.

### Key Entities

- **Command**: A CLI subcommand with a name, description, list of
  accepted options/arguments, and a handler function that performs
  the command's work. Commands are the primary extension point of
  the template.
- **CLI Application**: The top-level entry point that parses
  arguments, routes to the appropriate command, and handles global
  flags (`--help`, `--version`, `--json`).

## Assumptions

- The target runtime is Node.js (LTS version, currently 20.x or
  later).
- The module system is ESM only (`"type": "module"` in package.json,
  native `import`/`export` syntax throughout).
- The package manager is npm (lockfile: `package-lock.json`).
- The CLI framework is Commander.js — lightweight, widely adopted,
  with built-in subcommand routing, auto-generated help, and version
  flag support.
- The test framework is Vitest — native ESM support, built-in
  TypeScript handling, fast execution, and Jest-compatible API.
- The template targets single-project layout (`src/` and `tests/`
  at the repository root).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A developer can go from a fresh clone to a running CLI
  in under 2 minutes (install + build + first command execution).
- **SC-002**: All quality gate scripts (`lint`, `format:check`,
  `build`, `test`) pass with zero errors on a fresh clone.
- **SC-003**: A developer can add a new subcommand by creating a
  single file and registering it, with no changes to core
  infrastructure, in under 10 minutes.
- **SC-004**: The installed package size (via `npm pack`) is under
  5 MB, keeping dependency footprint minimal.
- **SC-005**: CLI startup time (time to `--help` output) is under
  200 ms on a modern machine.
- **SC-006**: 100% of sample tests pass on first run after a fresh
  clone and install.
