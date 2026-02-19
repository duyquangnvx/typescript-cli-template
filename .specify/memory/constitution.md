<!--
  Sync Impact Report
  ==================
  Version change: [TEMPLATE] -> 1.0.0
  Modified principles:
    - [PRINCIPLE_1_NAME] -> I. Code Quality
    - [PRINCIPLE_2_NAME] -> II. Testing Standards
    - [PRINCIPLE_3_NAME] -> III. User Experience Consistency
    - [PRINCIPLE_4_NAME] -> IV. Performance Requirements
    - [PRINCIPLE_5_NAME] -> (removed, not needed)
  Added sections:
    - Quality Gates (was [SECTION_2_NAME])
    - Development Workflow (was [SECTION_3_NAME])
    - Governance (filled from placeholder)
  Removed sections:
    - Fifth principle slot (user specified 4 focus areas)
  Templates requiring updates:
    - .specify/templates/plan-template.md: ✅ no update needed
      (Constitution Check section is generic; gates derived at plan time)
    - .specify/templates/spec-template.md: ✅ no update needed
      (Success criteria and requirements sections already accommodate
      performance and UX constraints)
    - .specify/templates/tasks-template.md: ✅ no update needed
      (Test phases and polish phase already align with testing and
      performance principles)
    - .specify/templates/commands/*.md: ✅ directory does not exist
  Follow-up TODOs: none
-->

# typescript-cli-template Constitution

## Core Principles

### I. Code Quality

All source code MUST be written in TypeScript with `strict` mode enabled.
Every module MUST pass the project linter (ESLint) and formatter
(Prettier) with zero warnings and zero errors before merge.

- TypeScript `strict: true` MUST be set in `tsconfig.json`. Disabling
  individual strict checks (e.g., `skipLibCheck`, `any` casts) MUST be
  justified in a code comment and approved during review.
- Functions and public APIs MUST have explicit return types. Implicit
  `any` is prohibited.
- Dead code, unused imports, and commented-out code MUST NOT be
  committed. Remove rather than comment out.
- Naming conventions MUST follow: `camelCase` for variables/functions,
  `PascalCase` for types/classes/interfaces, `UPPER_SNAKE_CASE` for
  constants, `kebab-case` for file names.
- Each source file MUST have a single responsibility. Files exceeding
  300 lines SHOULD be reviewed for decomposition.
- Dependencies MUST be explicitly declared. No implicit reliance on
  transitive dependencies.

**Rationale**: Strict typing and consistent style eliminate entire
categories of runtime bugs, reduce cognitive load during review, and
keep the codebase navigable as it grows.

### II. Testing Standards

Every feature MUST ship with automated tests. Test coverage MUST NOT
decrease on any PR.

- Unit tests MUST cover all public functions and exported APIs.
  Internal/private helpers MAY be tested indirectly through public API
  tests.
- Integration tests MUST cover CLI command invocations end-to-end:
  correct stdout output, correct exit codes, and correct stderr on
  failure.
- Tests MUST be deterministic. No reliance on network, wall-clock
  time, or shared mutable state between test cases.
- Test names MUST describe the behaviour under test, not the
  implementation (e.g., "returns error when input file missing" not
  "tests readFile catch block").
- The Red-Green-Refactor cycle SHOULD be followed: write a failing
  test first, implement until it passes, then refactor.
- All tests MUST pass in CI before a PR can merge. Flaky tests MUST
  be fixed or quarantined within 24 hours of detection.

**Rationale**: Automated tests are the primary safety net against
regressions. Deterministic, well-named tests serve as living
documentation and enable confident refactoring.

### III. User Experience Consistency

The CLI MUST present a predictable, uniform interface to every user
regardless of the command invoked.

- All commands MUST support `--help` with a description, usage
  synopsis, and option list.
- All commands MUST support `--version` to print the current version.
- Success output MUST go to stdout; error/diagnostic output MUST go
  to stderr.
- When `--json` is provided, output MUST be valid, parseable JSON.
  Human-readable output is the default.
- Error messages MUST include: what went wrong, which input caused it,
  and a suggested corrective action when possible.
- Exit codes MUST follow convention: `0` for success, `1` for general
  errors, `2` for usage/argument errors.
- Interactive prompts MUST NOT appear when stdin is not a TTY. Non-
  interactive mode MUST be the default for piped/scripted usage.

**Rationale**: Users build muscle memory and scripts around consistent
behaviour. Predictable I/O contracts make the CLI composable in
pipelines and automation.

### IV. Performance Requirements

The CLI MUST remain fast enough that users perceive it as instant for
common operations.

- Startup time (time to first meaningful output) MUST be under 200ms
  on a modern machine for commands that do not perform I/O.
- Commands processing files MUST handle inputs up to 10 MB without
  exceeding 256 MB resident memory.
- Long-running operations (>1 second) MUST display a progress
  indicator or spinner to stderr.
- No command MAY block indefinitely without a configurable timeout.
  Default timeouts MUST be documented.
- Dependencies MUST be evaluated for bundle-size impact. Adding a
  dependency that increases the installed size by more than 5 MB MUST
  be justified in the PR description.
- Lazy imports SHOULD be used for heavy modules that are only needed
  by specific subcommands.

**Rationale**: CLI tools compete on responsiveness. Slow startup or
excessive memory usage erodes trust and discourages adoption.

## Quality Gates

Every pull request MUST pass the following gates before merge:

- **Lint gate**: `eslint` reports zero errors and zero warnings.
- **Format gate**: `prettier --check` passes with no diffs.
- **Type gate**: `tsc --noEmit` completes with zero errors.
- **Test gate**: All unit and integration tests pass.
- **Coverage gate**: Line coverage MUST NOT decrease compared to the
  base branch.
- **Performance gate**: Startup-time benchmark MUST NOT regress by
  more than 10% compared to the base branch (when a benchmark suite
  exists).
- **Review gate**: At least one approving review from a maintainer is
  required.

## Development Workflow

1. **Branch**: Create a feature branch from `main` using the naming
   convention `<issue-number>-<short-description>` (e.g.,
   `42-add-init-command`).
2. **Implement**: Write code following the principles above. Commit
   early and often with clear, conventional commit messages
   (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
3. **Test locally**: Run the full test suite and lint/format checks
   before pushing.
4. **Pull request**: Open a PR against `main`. The PR description
   MUST summarize what changed and why, reference the related issue,
   and note any constitution principle trade-offs.
5. **Review**: Address all reviewer feedback. Re-request review after
   pushing changes.
6. **Merge**: Squash-merge into `main` once all quality gates pass
   and approval is obtained.
7. **Release**: Follow semantic versioning for published packages.
   Breaking CLI interface changes MUST bump the major version.

## Governance

This constitution is the highest-authority document for development
practices in this project. All other guides, templates, and workflows
MUST comply with it.

- **Amendments**: Any change to this constitution MUST be proposed via
  a pull request, reviewed by at least one maintainer, and merged
  only after explicit approval. The PR MUST include an updated Sync
  Impact Report comment at the top of this file.
- **Versioning**: The constitution follows semantic versioning.
    - MAJOR: Principle removed or redefined in a backward-incompatible
      way.
    - MINOR: New principle or section added, or existing guidance
      materially expanded.
    - PATCH: Wording clarifications, typo fixes, non-semantic
      refinements.
- **Compliance review**: During PR reviews, reviewers SHOULD verify
  that the change does not violate any principle. Violations MUST be
  documented and justified in the Complexity Tracking table of the
  implementation plan.
- **Runtime guidance**: Refer to `CLAUDE.md` or equivalent agent
  guidance files for development-time instructions that supplement
  (but never override) this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-02-19 | **Last Amended**: 2026-02-19
