import { ApolloClient } from '@apollo/client/core';
import { provideApolloClient } from '@vue/apollo-composable';
import { boot } from 'quasar/wrappers';
import { getClientOptions } from 'src/apollo';
import { BootFileParams } from '@quasar/app-vite';
import { QSsrContext } from '@quasar/app-vite/types/ssr';

interface FloxBootFileParams<T = any> extends BootFileParams<T> {
  ssrContext?: QSsrContext;
}

export default boot((bootContext: FloxBootFileParams) => {
  // Default client.
  const options = getClientOptions(bootContext.ssrContext);

  // Apollo Client setup
  const apolloClient = new ApolloClient(options);

  provideApolloClient(apolloClient);
});
