const path = require('path');

module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  // https://eslint.vuejs.org/user-guide/#how-to-use-custom-parser
  // Must use parserOptions instead of 'parser' to allow vue-eslint-parser to keep working
  // `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
  parserOptions: {
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#configuration
    // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#eslint
    // Needed to make the parser take into account 'vue' files
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    project: path.resolve(__dirname, './tsconfig.json'),
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },

  env: {
    browser: true
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // consider disabling this class of rules if linting takes too long
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    'plugin:import/recommended',
    'plugin:import/typescript',

    // See https://eslint.vuejs.org/rules/#available-rules
    'plugin:vue/vue3-recommended',

    // https://github.com/prettier/eslint-config-prettier#installation
    // usage with Prettier, provided by 'eslint-config-prettier'.
    'plugin:prettier/recommended',

    // https://github.com/SonarSource/eslint-plugin-sonarjs
    // linting rules that sonarqube considers for code quality checks
    'plugin:sonarjs/recommended',
  ],

  plugins: [
    'import',
    'eslint-plugin-graphql',
    // required to apply rules which need type information
    '@typescript-eslint/eslint-plugin',

    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-file
    // required to lint *.vue files
    'vue',

    // https://github.com/SonarSource/eslint-plugin-sonarjs
    // linting rules that sonarqube considers for code quality checks
    'sonarjs',
  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly'
  },

  // add your custom rules here
  rules: {
    quotes: ['warn', 'single', { avoidEscape: true }],

    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'off',

    'import/order': ['error', {
      'newlines-between': 'always',
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type']
    }],

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'require-jsdoc': ['error', {
      'require': {
        'FunctionDeclaration': true,
        'MethodDefinition': true,
        'ClassDeclaration': true,
        'ArrowFunctionExpression': false,
        'FunctionExpression': false
      }
    }],
    'valid-jsdoc': ['error', {
      'requireReturn': false,
      'requireReturnType': false,
      'requireParamType': false,
    }],
    'graphql/template-strings': ['error', {
      // Import default settings for your GraphQL client. Supported values:
      // 'apollo', 'relay', 'lokka', 'fraql', 'literal'
      env: 'apollo',
    }]
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    }
  }
}
