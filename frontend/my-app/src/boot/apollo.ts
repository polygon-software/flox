import {ApolloClient, createHttpLink, InMemoryCache, split /*, createHttpLink */} from '@apollo/client/core'
import { ApolloClients } from '@vue/apollo-composable'
import { boot } from 'quasar/wrappers'
import { getClientOptions } from 'src/apollo'
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';

export default boot(
  ({ app }) => {
    // HTTP link for GraphQL (Queries/Mutations)
    const httpLink = createHttpLink({
      // GraphQL API Link
      uri: 'http://localhost:3000/graphql',
    })

    // WebSocket link for GraphQL (Subscriptions)
    const wsLink = new WebSocketLink({
      uri: 'ws://localhost:3000/graphql-websocket',
      options: {
        reconnect: true
      }
    });

    // Depending on operation, use correct link
    const link = split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink
    );

    // Default client.
    const options = getClientOptions(/* {app, router ...} */)

    // Apollo Client setup
    const apolloClient = new ApolloClient({
      ...options,
      link: link,
      cache: new InMemoryCache({
        addTypename: false, // We disable auto-adding of __typename property, as this breaks mutations expecting
                            // an object variable. Instead, we manually add __typename in QUERIES/MUTATIONS.ts where
                            // appropriate. This can be changed in case Apollo implements better behavior for this.
      })
    })

    const apolloClients: Record<string, ApolloClient<unknown>> = {
      default: apolloClient,
    }

    app.provide(ApolloClients, apolloClients)
  }
)
