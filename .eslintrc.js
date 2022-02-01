module.exports = {
    env: {
        browser: true,
        es6: true
    },
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        '@vue/typescript',
        'plugin:vue/essential',
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
        semi: ['error', 'always'],
        '@typescript-eslint/no-explicit-any': 'off'
    }
};
