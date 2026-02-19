import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Command } from '@commander-js/extra-typings';
import { registerGreetCommand } from '../../src/commands/greet.js';

describe('registerGreetCommand', () => {
    let program: Command;
    let writeSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        program = new Command();
        program.option('-j, --json', 'output in JSON format');
        program.exitOverride();
        registerGreetCommand(program);
        writeSpy = vi
            .spyOn(process.stdout, 'write')
            .mockImplementation(() => true);
    });

    afterEach(() => {
        writeSpy.mockRestore();
    });

    it('registers a command named "greet"', () => {
        const greetCommand = program.commands.find(
            (cmd) => cmd.name() === 'greet',
        );
        expect(greetCommand).toBeDefined();
    });

    it('greet command has a description', () => {
        const greetCommand = program.commands.find(
            (cmd) => cmd.name() === 'greet',
        );
        expect(greetCommand?.description()).toBe('Greet someone by name');
    });

    it('produces correct output for a given name', () => {
        program.parse(['greet', 'World'], { from: 'user' });
        expect(writeSpy).toHaveBeenCalledWith('Hello, World!\n');
    });

    it('uses default greeting "Hello"', () => {
        program.parse(['greet', 'Alice'], { from: 'user' });
        expect(writeSpy).toHaveBeenCalledWith('Hello, Alice!\n');
    });

    it('supports custom --greeting option', () => {
        program.parse(['greet', '--greeting', 'Hi', 'Bob'], { from: 'user' });
        expect(writeSpy).toHaveBeenCalledWith('Hi, Bob!\n');
    });

    it('outputs JSON when --json flag is set', () => {
        program.parse(['--json', 'greet', 'World'], { from: 'user' });
        const callArg = writeSpy.mock.calls[0]?.[0] as string;
        const parsed = JSON.parse(callArg) as {
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
});
