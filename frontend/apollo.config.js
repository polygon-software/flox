/* eslint-env node */
// See https://www.apollographql.com/docs/devtools/apollo-config/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Env = require('src/env');

module.exports = {
  client: {
    service: {
      name: 'my-service',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      url: Env.VUE_APP_GRAPHQL_ENDPOINT,
    },
    // Files processed by the extension
    includes: ['src/**/*.vue', 'src/**/*.js', 'src/**/*.ts'],
  },
};
