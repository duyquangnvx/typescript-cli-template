import { createRequire } from 'node:module';
import { Command } from '@commander-js/extra-typings';
import { registerGreetCommand } from './commands/greet.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json') as { version: string };

export function createProgram(): Command {
    const program = new Command();

    program
        .name('typescript-cli-template')
        .description(
            'A production-ready TypeScript CLI template with Commander.js',
        )
        .version(packageJson.version)
        .option('-j, --json', 'output in JSON format')
        .configureOutput({
            writeOut: (str) => process.stdout.write(str),
            writeErr: (str) => process.stderr.write(str),
            outputError: (str, write) => {
                write(`${str}Run '--help' for usage information.\n`);
            },
        })
        .showHelpAfterError(false);

    // Register commands — add new commands here
    registerGreetCommand(program);

    program.allowExcessArguments(true).action(() => {
        if (program.args.length > 0) {
            const unknown = program.args[0];
            process.stderr.write(
                `error: unknown command '${unknown}'\nRun '--help' for usage information.\n`,
            );
        } else {
            program.outputHelp({ error: true });
        }
        process.exit(2);
    });

    return program;
}
