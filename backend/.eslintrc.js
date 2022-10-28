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
    'simple-import-sort',
    '@typescript-eslint/eslint-plugin',

    // https://github.com/SonarSource/eslint-plugin-sonarjs
    // linting rules that sonarqube considers for code quality checks
    'sonarjs',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
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

    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",

    "require-jsdoc": ["error", {
      "require": {
        "FunctionDeclaration": true,
        "MethodDefinition": false,
        "ClassDeclaration": false,
        "ArrowFunctionExpression": false,
        "FunctionExpression": false
      }
    }],
    'valid-jsdoc': ['error', {
      "requireReturn": false,
      "requireReturnType": false,
      "requireParamType": false,
    }],
  },
  overrides: [
  // override "simple-import-sort" config
  {
    "files": ["*.js", "*.jsx", "*.ts", "*.tsx"],
    "rules": {
      "simple-import-sort/imports": [
        "error",
        {
          "groups": [
            // Packages `react` related packages come first.
            ["^@nestjs", "^@?\\w"],
            ["^typeorm", "^@?\\w"],
            ["^class-validator", "^@?\\w"],
            // Parent imports. Put `..` last.
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Other relative imports. Put same-folder imports and `.` last.
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          ]
        }
      ]
    }
  }
]
};
