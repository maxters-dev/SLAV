module.exports = {
    env: {
        browser: true,
        es6: true
    },

    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        '@vue/typescript',
        'plugin:vue/recommended',
        'standard'
    ],

    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },

    parser: 'vue-eslint-parser',

    parserOptions: {
        ecmaVersion: 2018,
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },

    plugins: ['vue', '@typescript-eslint'],

    rules: {
        indent: ['error', 4],
        'vue/script-indent': ['error', 4, { baseIndent: 0 }],
        'vue/html-indent': ['error', 4, { baseIndent: 1 }],
        semi: ['error', 'always'],
        'vue/no-v-html': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
    },

    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)'
            ],
            env: {
                jest: true
            }
        }
    ]
};
