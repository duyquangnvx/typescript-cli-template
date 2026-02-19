# Research: Build TypeScript CLI Template

**Date**: 2026-02-19
**Feature**: 001-build-cli-template

## R1: Commander.js with TypeScript ESM

**Decision**: Use `commander` package with `@commander-js/extra-typings`
for enhanced TypeScript type inference on `.opts()` and `.action()`
parameters.

**Rationale**: Commander.js natively supports ESM imports. The extra
typings package provides strong type inference from option and argument
definitions without manual type annotations, aligning with the Code
Quality constitution principle. Commander provides built-in `.version()`,
auto-generated `--help`, subcommand routing, and customizable error
handling with exit codes — covering FR-006, FR-011, FR-012.

**Alternatives considered**:

- yargs: Heavier startup footprint, more complex TypeScript integration
  with ESM.
- clipanion: Excellent type safety but smaller ecosystem, steeper
  learning curve for template users.
- oclif: Full framework with opinions on project structure — too heavy
  for a lightweight template.

**Key patterns**:

- Use `new Command()` constructor for the program instance.
- Use `.command()` with `.action()` for in-process subcommands (not
  executable subcommands).
- Use `.configureOutput()` to route writeOut to stdout and writeErr
  to stderr.
- Use `.exitOverride()` in tests to throw instead of calling
  `process.exit()`.
- Read version from `package.json` using `createRequire` or a
  static import with `assert { type: "json" }` (Node 20+).

## R2: Vitest for TypeScript ESM Testing

**Decision**: Use Vitest as the test framework with a single
`vitest.config.ts` configuration file.

**Rationale**: Vitest has native ESM support, built-in TypeScript
handling (no separate ts-jest config), fast execution via Vite's
transform pipeline, and a Jest-compatible API that most developers
already know. Aligns with the Testing Standards constitution principle.

**Alternatives considered**:

- Jest: Requires ESM workarounds (`--experimental-vm-modules` or
  transform config). TypeScript support needs ts-jest or SWC plugin.
- Node.js built-in test runner: Zero dependencies but smaller
  ecosystem, less mature assertion library, fewer IDE integrations.

**Key patterns**:

- Unit tests: Import command handler functions directly and test
  return values or side effects.
- Integration tests: Use `child_process.execFile` to spawn the built
  CLI binary and assert on stdout, stderr, and exit code.
- Config: `vitest.config.ts` with `test.include` targeting
  `tests/**/*.test.ts`.

## R3: ESLint Flat Config for TypeScript

**Decision**: Use ESLint v9 flat config format (`eslint.config.mjs`)
with `typescript-eslint` recommended rules.

**Rationale**: Flat config is the current ESLint standard (legacy
`.eslintrc` is deprecated). The `typescript-eslint` package provides
`tseslint.configs.strictTypeChecked` which aligns with the Code Quality
constitution principle requiring strict typing. Using
`eslint/config.defineConfig()` provides type safety in the config file.

**Alternatives considered**:

- Legacy `.eslintrc.json`: Deprecated in ESLint v9, will be removed
  in future versions.
- `@antfu/eslint-config`: Opinionated preset — hides rules, making
  it harder for template users to understand and customize.

**Key patterns**:

- Import `@eslint/js` for base recommended rules.
- Import `typescript-eslint` for TypeScript-specific rules.
- Use `tseslint.configs.strictTypeChecked` for maximum strictness.
- Add `languageOptions.parserOptions.projectService: true` for
  type-aware rules.

## R4: Prettier Configuration

**Decision**: Use Prettier with a minimal `.prettierrc` configuration
and integrate with ESLint via `eslint-config-prettier` to disable
conflicting rules.

**Rationale**: Prettier handles formatting, ESLint handles code
quality. Separating concerns avoids rule conflicts and keeps each
tool focused. The `eslint-config-prettier` package disables ESLint
rules that would conflict with Prettier formatting.

**Alternatives considered**:

- `eslint-plugin-prettier`: Runs Prettier as an ESLint rule. Slower
  and mixes concerns.
- Prettier only (no ESLint integration): Risk of conflicting rules
  between the two tools.

## R5: TypeScript ESM Configuration

**Decision**: Use `"module": "nodenext"` and
`"moduleResolution": "nodenext"` in tsconfig.json with
`"type": "module"` in package.json.

**Rationale**: `nodenext` is the correct module setting for Node.js
ESM projects. It enforces `.js` extensions in imports (matching
Node.js ESM resolution) and supports top-level await. Combined with
`"target": "es2022"` this provides modern JavaScript output that
Node 20+ fully supports.

**Key settings**:

- `outDir: "dist"` — compiled output goes to `dist/`.
- `rootDir: "src"` — source files live in `src/`.
- `declaration: true` — emit `.d.ts` files for library consumers.
- `sourceMap: true` — enable source maps for debugging.
- `strict: true` — constitution requirement.

## R6: Package Distribution

**Decision**: Use `"files"` field in package.json to whitelist only
`dist/` for npm publishing. Use `"bin"` field pointing to
`dist/index.js`.

**Rationale**: The `"files"` field is the most reliable way to
control what goes into the npm tarball. By whitelisting only `dist/`,
source files, tests, and config files are excluded automatically.
This keeps package size well under the 5 MB SC-004 target.

**Key settings**:

- `"bin": { "typescript-cli-template": "dist/index.js" }`
- `"files": ["dist"]`
- `"engines": { "node": ">=20.0.0" }`
