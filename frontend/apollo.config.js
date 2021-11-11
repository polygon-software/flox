/* eslint-env node */
// See https://www.apollographql.com/docs/devtools/apollo-config/
module.exports = {
  client: {
    service: {
      name: 'my-service',
      url: process.env.VUE_APP_GRAPHQL_ENDPOINT,
    },
    // Files processed by the extension
    includes: ['src/**/*.vue', 'src/**/*.js', 'src/**/*.ts'],
  },
}
