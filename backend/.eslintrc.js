const path = require("path");

module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: path.resolve(__dirname, './tsconfig.json'),
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',

    'import',
    'jsdoc',

    'sonarjs',
  ],
  extends: [
    'eslint:recommended',

    'airbnb-base',
    'airbnb-typescript/base',

    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    'plugin:import/recommended',
    'plugin:import/typescript',

    'plugin:jsdoc/recommended',

    'plugin:prettier/recommended',

    'plugin:sonarjs/recommended',
  ],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    quotes: ['warn', 'single', { avoidEscape: true }],
    camelcase: ['error', {
      properties: 'always',
    }],

    'no-void': 0, // Reason: Otherwise, we are forced to await promises and can't skip it using 'void asyncCall()'
    'no-param-reassign': 0, // Reason: We often pass around database object and extend their content
    'import/no-cycle': 0, // Reason: Simply not possible with TypeORM relations (since both entities know each other)
    'class-methods-use-this': 0, // Reason: Breaks many nest interface implementations
    'no-console': ["error", { allow: ["warn", "error"] }],

    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'off',

    'import/order': ['error', {
      'newlines-between': 'always',
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type']
    }],

    'jsdoc/require-param-type': 0,
    'jsdoc/require-returns-type': 0,
    'jsdoc/require-jsdoc': ['error', {
      'require': {
        'FunctionDeclaration': true,
        'MethodDefinition': true,
        'ClassDeclaration': false,
        'ArrowFunctionExpression': false,
        'FunctionExpression': false
      },
      'checkConstructors': false,
    }],
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    }
  }
};
