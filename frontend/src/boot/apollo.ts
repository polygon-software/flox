import { ApolloClient } from '@apollo/client/core';
import { provideApolloClient } from '@vue/apollo-composable';
import { boot } from 'quasar/wrappers';

import { getClientOptions } from 'src/apollo';

import type { QSsrContext } from '@quasar/app-vite/types/ssr';
import type { BootFileParams } from '@quasar/app-vite';

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
