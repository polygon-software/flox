import type { ApolloClientOptions, StoreObject } from '@apollo/client/core';
import {
  ApolloLink,
  concat,
  createHttpLink,
  defaultDataIdFromObject,
  InMemoryCache,
} from '@apollo/client/core';
import { Cookies } from 'quasar';
import { QSsrContext } from '@quasar/app-vite';
import { NormalizedCacheObject } from '@apollo/client/cache/inmemory/types';
import Env from 'src/env';

/**
 * Sets up auth middleware
 * @param ssrContext - SSR context
 * @returns the auth middleware
 */
function getAuthMiddleware(
  ssrContext: QSsrContext | null | undefined
): ApolloLink {
  return new ApolloLink((operation, forward) => {
    const cookies =
      Env.SERVER && ssrContext ? Cookies.parseSSR(ssrContext) : Cookies;
    let token = cookies.get('authentication.idToken');
    if (token) {
      // If token contains quotes, remove them
      token = token.replace(/"/g, '');

      // Add the authorization to the headers
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    }
    return forward(operation);
  });
}

/**
 * ID Builder function for caching
 * @param responseObject - the object received by apollo
 * @returns a cache key, e.g. 'User:ab12-cd34-xyz' or nothing
 */
function dataIdFromObject(
  responseObject: Readonly<StoreObject>
): string | undefined {
  if (!responseObject || Object.keys(responseObject).length === 0) {
    throw new Error('Cannot cache empty object');
  }

  const uuid: string | undefined = responseObject.uuid?.toString();
  const typename: string | undefined = responseObject.__typename as string;
  let result;

  if (uuid && typename) {
    // Case 1: Response contains relevant data at root
    result = `${typename}:${uuid}`;
  } else {
    // Case 2: Response contains a nested object (take first one, because there should only be one in this case)
    const innerObject: Record<string, string> = responseObject[
      Object.keys(responseObject)[0]
    ] as Record<string, string>;

    // Cases that we cannot handle (e.g. arrays): use default function
    if (!innerObject || !innerObject.__typename || !innerObject.uuid) {
      return defaultDataIdFromObject(responseObject);
    }

    result = `${innerObject.__typename ?? ''}:${innerObject.uuid ?? ''}`;
  }
  return result;
}

/**
 * Get Apollo client options
 * @param ssrContext - quasar ssr context
 * @returns  config options
 */
export function getClientOptions(
  ssrContext: QSsrContext | null | undefined
): ApolloClientOptions<NormalizedCacheObject> {
  // Authentication middleware for intercepting any GraphQL-related operations
  const authMiddleware = getAuthMiddleware(ssrContext);

  // HTTP link for GraphQL (Queries/Mutations)
  const httpLink = createHttpLink({
    // GraphQL API Link
    uri: Env.VUE_APP_GRAPHQL_ENDPOINT,
  });

  return <ApolloClientOptions<NormalizedCacheObject>>Object.assign(
    // General options.
    <ApolloClientOptions<NormalizedCacheObject>>{
      link: concat(authMiddleware, httpLink),
      cache: new InMemoryCache({
        // Use UUID as default key in database. If any table needs different behaviour, this can be changed here,
        // see: https://www.apollographql.com/docs/react/caching/cache-configuration/
        dataIdFromObject(responseObject): string | undefined {
          return dataIdFromObject(responseObject);
        },
        addTypename: false, // We disable auto-adding of __typename property, as this breaks mutations expecting
        // an object variable. Instead, we manually add __typename in QUERIES/USER.ts where
        // appropriate. This can be changed in case Apollo implements better behavior for this.
      }),
    },

    // For ssr mode, when on server.
    Env.MODE === 'ssr' && Env.SERVER
      ? {
          ssrMode: true,
        }
      : {},
    // For ssr mode, when on client.
    Env.MODE === 'ssr' && Env.CLIENT
      ? {
          ssrForceFetchDelay: 100,
        }
      : {}
  );
}
