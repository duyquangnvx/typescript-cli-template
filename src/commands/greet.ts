import type { Command } from '@commander-js/extra-typings';

export function registerGreetCommand(program: Command): void {
    program
        .command('greet')
        .description('Greet someone by name')
        .argument('<name>', 'Name of the person to greet')
        .option('-g, --greeting <text>', 'Custom greeting', 'Hello')
        .action((name, options) => {
            const greeting = options.greeting;
            const message = `${greeting}, ${name}!`;

            const parentOpts = program.opts() as { json?: boolean };
            if (parentOpts.json) {
                process.stdout.write(
                    JSON.stringify({ greeting, name, message }) + '\n',
                );
            } else {
                process.stdout.write(message + '\n');
            }
        });
}
