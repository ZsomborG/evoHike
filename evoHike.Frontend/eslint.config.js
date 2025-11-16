import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettierConfig from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
    {
        ignores: ['dist/'],
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ...pluginReact.configs.flat.recommended,
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    pluginReact.configs.flat['jsx-runtime'],

    jsxA11y.flatConfigs.recommended,
    {
        plugins: {
            'react-refresh': reactRefresh,
            'react-hooks': reactHooks,
        },
        rules:
            {
                ...reactHooks.configs.recommended.rules,
                'react-refresh/only-export-components': 'warn',
            },
    },

    prettierConfig,
]
;
