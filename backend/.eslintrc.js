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
    '@typescript-eslint/eslint-plugin',
    'import',
    'jsdoc',
    // https://github.com/SonarSource/eslint-plugin-sonarjs
    // linting rules that sonarqube considers for code quality checks
    'sonarjs',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',

    'plugin:import/recommended',
    'plugin:import/typescript',

    'plugin:jsdoc/recommended',

    'plugin:prettier/recommended',
    // https://github.com/SonarSource/eslint-plugin-sonarjs
    // linting rules that sonarqube considers for code quality checks
    'plugin:sonarjs/recommended',
  ],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    quotes: ['warn', 'single', { avoidEscape: true }],

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
