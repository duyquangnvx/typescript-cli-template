# CLI Interface Contract: typescript-cli-template

**Date**: 2026-02-19
**Feature**: 001-build-cli-template

## Global Interface

```text
typescript-cli-template [options] [command]

Options:
  -V, --version   output the version number
  -j, --json      output in JSON format
  -h, --help      display help for command

Commands:
  greet [options] <name>  Greet someone by name
  help [command]          display help for command
```

### Global Options

| Flag            | Type    | Default | Description            |
| --------------- | ------- | ------- | ---------------------- |
| `-V, --version` | boolean | false   | Print version and exit |
| `-j, --json`    | boolean | false   | Format output as JSON  |
| `-h, --help`    | boolean | false   | Print help and exit    |

### Exit Codes

| Code | Meaning               |
| ---- | --------------------- |
| 0    | Success               |
| 1    | General runtime error |
| 2    | Usage/argument error  |

### I/O Contract

| Stream | Content                                          |
| ------ | ------------------------------------------------ |
| stdout | Command success output (human-readable or JSON)  |
| stderr | Error messages, diagnostics, progress indicators |

## Command: greet

Sample subcommand demonstrating the command pattern.

```text
typescript-cli-template greet [options] <name>

Arguments:
  name            Name of the person to greet

Options:
  -g, --greeting <text>  Custom greeting (default: "Hello")
  -h, --help             display help for command
```

### Input

| Parameter           | Type   | Required | Default | Description                 |
| ------------------- | ------ | -------- | ------- | --------------------------- |
| `name` (positional) | string | yes      | —       | Name of the person to greet |
| `-g, --greeting`    | string | no       | "Hello" | Custom greeting prefix      |

### Output (human-readable, default)

```text
Hello, World!
```

### Output (JSON, when --json is passed)

```json
{
    "greeting": "Hello",
    "name": "World",
    "message": "Hello, World!"
}
```

### Error Cases

| Scenario           | stderr Output                             | Exit Code |
| ------------------ | ----------------------------------------- | --------- |
| Missing `name` arg | "error: missing required argument 'name'" | 2         |
| Unknown option     | "error: unknown option '--foo'"           | 2         |

## npm Scripts Contract

| Script         | Command              | Purpose                        |
| -------------- | -------------------- | ------------------------------ |
| `build`        | `tsc`                | Compile TypeScript to dist/    |
| `start`        | `node dist/index.js` | Run the compiled CLI           |
| `lint`         | `eslint .`           | Lint all source files          |
| `lint:fix`     | `eslint . --fix`     | Lint and auto-fix              |
| `format`       | `prettier --write .` | Format all files               |
| `format:check` | `prettier --check .` | Check formatting without write |
| `test`         | `vitest run`         | Run all tests once             |
| `test:watch`   | `vitest`             | Run tests in watch mode        |
