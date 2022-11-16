module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'sonarjs',
  ],
  extends: [
    'eslint:recommended',

    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    'plugin:import/recommended',
    'plugin:import/typescript',

    'plugin:prettier/recommended',

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

    'require-jsdoc': ['error', {
      'require': {
        'FunctionDeclaration': true,
        'MethodDefinition': false,
        'ClassDeclaration': false,
        'ArrowFunctionExpression': false,
        'FunctionExpression': false
      }
    }],
    'valid-jsdoc': ['error', {
      'requireReturn': false,
      'requireReturnType': false,
      'requireParamType': false,
    }],
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    }
  }
};
