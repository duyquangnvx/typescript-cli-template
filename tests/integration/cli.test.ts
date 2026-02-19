import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.resolve(__dirname, '../../dist/index.js');

interface ExecResult {
    stdout: string;
    stderr: string;
    exitCode: number;
}

async function runCli(args: string[]): Promise<ExecResult> {
    try {
        const { stdout, stderr } = await execFileAsync('node', [
            CLI_PATH,
            ...args,
        ]);
        return { stdout, stderr, exitCode: 0 };
    } catch (error) {
        const err = error as {
            stdout: string;
            stderr: string;
            code: number;
        };
        return { stdout: err.stdout, stderr: err.stderr, exitCode: err.code };
    }
}

describe('CLI integration tests', () => {
    it('--help outputs usage to stdout and exits 0', async () => {
        const result = await runCli(['--help']);
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain('Usage:');
        expect(result.stdout).toContain('typescript-cli-template');
        expect(result.stdout).toContain('greet');
    });

    it('--version outputs version to stdout and exits 0', async () => {
        const result = await runCli(['--version']);
        expect(result.exitCode).toBe(0);
        expect(result.stdout.trim()).toBe('0.1.0');
    });

    it('greet World outputs "Hello, World!" and exits 0', async () => {
        const result = await runCli(['greet', 'World']);
        expect(result.exitCode).toBe(0);
        expect(result.stdout.trim()).toBe('Hello, World!');
    });

    it('greet with custom greeting works', async () => {
        const result = await runCli(['greet', '--greeting', 'Hi', 'Alice']);
        expect(result.exitCode).toBe(0);
        expect(result.stdout.trim()).toBe('Hi, Alice!');
    });

    it('--json greet World outputs valid JSON and exits 0', async () => {
        const result = await runCli(['--json', 'greet', 'World']);
        expect(result.exitCode).toBe(0);
        const parsed = JSON.parse(result.stdout) as {
            greeting: string;
            name: string;
            message: string;
        };
        expect(parsed).toEqual({
            greeting: 'Hello',
            name: 'World',
            message: 'Hello, World!',
        });
    });

    it('running with no arguments exits with code 2', async () => {
        const result = await runCli([]);
        expect(result.exitCode).toBe(2);
        expect(result.stderr).toContain('Usage:');
    });

    it('unknown command exits with code 2', async () => {
        const result = await runCli(['nonexistent']);
        expect(result.exitCode).toBe(2);
        expect(result.stderr).toContain("error: unknown command 'nonexistent'");
        expect(result.stderr).toContain("'--help'");
    });
});
