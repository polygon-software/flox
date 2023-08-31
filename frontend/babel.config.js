/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const fs = require('fs-extra');

let extend;

/**
 * The .babelrc file has been created to assist Jest for transpiling.
 * You should keep your application's babel rules in this file.
 */

if (fs.existsSync('./.babelrc')) {
  extend = './.babelrc';
}

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@quasar/babel-preset-app',
    '@babel/preset-typescript',
  ],
  extends: extend,
};
