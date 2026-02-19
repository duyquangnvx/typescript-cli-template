import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: ['dist/', 'coverage/', 'node_modules/'],
    },
    {
        files: ['src/**/*.ts', 'tests/**/*.ts'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.strictTypeChecked,
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
    eslintConfigPrettier,
);
