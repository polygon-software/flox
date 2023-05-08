const path = require('path');

module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  // https://eslint.vuejs.org/user-guide/#how-to-use-custom-parser
  // Must use parserOptions instead of 'parser' to allow vue-eslint-parser to keep working
  parser: 'vue-eslint-parser',
  parserOptions: {
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#configuration
    // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#eslint
    // Needed to make the parser take into account 'vue' files
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    project: path.resolve(__dirname, './tsconfig.json'),
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },

  env: {
    browser: true,
  },

  // Rules order is important, please avoid shuffling them
  plugins: [
    // required to apply rules which need type information
    '@typescript-eslint',

    'import',
    'jsdoc',
    'eslint-plugin-graphql',

    'vue',

    'sonarjs',
  ],

  // Rules order is important, please avoid shuffling them
  extends: [
    'eslint:recommended',

    'airbnb-base',
    'airbnb-typescript/base',

    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    'plugin:import/recommended',
    'plugin:import/typescript',

    'plugin:vue/vue3-recommended',

    'plugin:prettier/recommended',

    'plugin:sonarjs/recommended',
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
    chrome: 'readonly',
  },

  // add your custom rules here
  rules: {
    quotes: ['warn', 'single', { avoidEscape: true }],
    camelcase: [
      'error',
      {
        properties: 'always',
      },
    ],

    'no-void': 0, // Reason: Otherwise, we are forced to await promises and can't skip it using 'void asyncCall()'
    'import/no-cycle': 0, // Reason: Router is needed in pages, but pages also need router
    'no-unused-vars': ['error', { varsIgnorePattern: '(props|emit)' }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '(props|emit)' },
    ],

    'no-console': ['error', { allow: ['warn', 'error'] }],

    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'off',

    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
      },
    ],

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'jsdoc/require-param-type': 0,
    'jsdoc/require-returns-type': 0,
    'jsdoc/require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: false,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
        checkConstructors: false,
      },
    ],
    'vue/block-lang': [
      'error',
      {
        script: {
          lang: 'ts',
        },
      },
    ],
    'vue/component-api-style': ['error', ['script-setup']],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    'vue/define-emits-declaration': ['error', 'type-based'],
    'vue/define-macros-order': [
      'error',
      {
        order: ['defineProps', 'defineEmits'],
      },
    ],
    'vue/define-props-declaration': ['error', 'type-based'],
    'vue/next-tick-style': ['error', 'promise'],
    'vue/no-duplicate-attr-inheritance': ['error'],
    'vue/no-empty-component-block': ['error'],
    'vue/no-multiple-objects-in-class': ['error'],
    'vue/no-ref-object-destructure': ['error'],
    'vue/no-required-prop-with-default': ['error'],
    'vue/no-template-target-blank': ['error'],
    'vue/no-undef-properties': ['error'],
    'vue/no-unused-properties': ['error'],
    'vue/no-unused-refs': ['error'],
    'vue/no-useless-mustaches': ['error'],
    'vue/no-useless-v-bind': ['error'],
    'vue/padding-line-between-blocks': ['error', 'always'],
    'vue/prefer-true-attribute-shorthand': ['error', 'always'],
    'vue/require-expose': ['error'],
    'vue/script-indent': ['error', 2],
    'vue/v-for-delimiter-style': ['error', 'in'],
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};
