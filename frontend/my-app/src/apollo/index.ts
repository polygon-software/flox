import type { ApolloClientOptions } from '@apollo/client/core'
import {createHttpLink, InMemoryCache, split} from '@apollo/client/core'
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';

export function getClientOptions() {
  // HTTP link for GraphQL (Queries/Mutations)
  const httpLink = createHttpLink({
    // GraphQL API Link
    uri: 'http://localhost:3000/graphql',
  })

  let link = httpLink;


  if(!process.env.SERVER){
    const wsLink = new WebSocketLink({
      uri: 'ws://localhost:3000/graphql-websocket',
      options: {
        reconnect: true
      }
    })
    link = split(
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
    )
  }

  return <ApolloClientOptions<unknown>>Object.assign(
    // General options.
    <ApolloClientOptions<unknown>>{
      link,
      cache: new InMemoryCache({
        addTypename: false, // We disable auto-adding of __typename property, as this breaks mutations expecting
                            // an object variable. Instead, we manually add __typename in QUERIES/MUTATIONS.ts where
                            // appropriate. This can be changed in case Apollo implements better behavior for this.
      })
    },

    // Specific Quasar mode options.
    process.env.MODE === 'spa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'ssr'
      ? {
          //
        }
      : {},
    process.env.MODE === 'pwa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'bex'
      ? {
          //
        }
      : {},
    process.env.MODE === 'cordova'
      ? {
          //
        }
      : {},
    process.env.MODE === 'capacitor'
      ? {
          //
        }
      : {},
    process.env.MODE === 'electron'
      ? {
          //
        }
      : {},

    // dev/prod options.
    process.env.DEV
      ? {
          //
        }
      : {},
    process.env.PROD
      ? {
          //
        }
      : {},

    // For ssr mode, when on server.
    process.env.MODE === 'ssr' && process.env.SERVER
      ? {
          ssrMode: true,
        }
      : {},
    // For ssr mode, when on client.
    process.env.MODE === 'ssr' && process.env.CLIENT
      ? {
          ssrForceFetchDelay: 100,
        }
      : {}
  )
}
