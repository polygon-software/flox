import { ApolloClient } from '@apollo/client/core';
import { provideApolloClient } from '@vue/apollo-composable';
import { boot } from 'quasar/wrappers';
import { getClientOptions } from 'src/apollo';

export default boot((bootContext) => {
  // Default client.
  // @ts-ignore
  const options = getClientOptions(bootContext.ssrContext);

  // Apollo Client setup
  const apolloClient = new ApolloClient(options);

  provideApolloClient(apolloClient);
});
