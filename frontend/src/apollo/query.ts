import { ApolloQueryResult, WatchQueryFetchPolicy } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core/types';
import { useApolloClient, useQuery } from '@vue/apollo-composable';
import { DocumentNode } from 'graphql';
import { onBeforeMount, onServerPrefetch, Ref, ref } from 'vue';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import CountQuery from 'src/flox/modules/interfaces/entities/count.entity';
import useSsrStore from 'stores/ssr';

// Interface definitions as used in constant files (e.g. QUERIES.ts, DEALERSHIP.ts)
export interface QueryObject {
  query: DocumentNode; // Actual GraphQL query
  tables: string[]; // Affected Tables
  cacheLocation: string; // Location in cache (actual GraphQL query name)
}

/**
 * Executes a given GraphQL query object
 *
 * @param queryObject - the query object constant (from QUERIES.ts)
 * @param [variables] - variables to pass to the query, if any
 * @param {WatchQueryFetchPolicy} [cacheConfig] - cache configuration
 * @returns the query's output
 */
export async function executeQuery<
  T extends CountQuery<any> | BaseEntity | BaseEntity[]
>(
  queryObject: QueryObject,
  variables?: OperationVariables,
  cacheConfig?: WatchQueryFetchPolicy
): Promise<ApolloQueryResult<T>> {
  const queryResult = useQuery<Record<string, T>>(
    queryObject.query,
    variables ?? {},
    { fetchPolicy: cacheConfig ?? undefined }
  );

  // If we have a cached result, return immediately
  if (queryResult.result.value) {
    return {
      ...queryResult.result.value,
      data: queryResult.result.value[queryObject.cacheLocation],
    } as ApolloQueryResult<T>;
  }

  return new Promise((resolve, reject) => {
    queryResult.onResult((result) => {
      resolve({
        ...result,
        data: result.data[queryObject.cacheLocation],
      });
    });
    queryResult.onError((err) => {
      reject(err);
    });
  });
}

/**
 * Subscribes to a graphQL query
 *
 * @param query - the graphQL query object
 * @param [variables] - any variables to pass to the query
 * @returns the query's output
 */
export function subscribeToQuery<
  T extends CountQuery<any> | BaseEntity | BaseEntity[]
>(
  query: QueryObject,
  variables?: OperationVariables
): ApolloQueryResult<Ref<T | null>> {
  const $ssrStore = useSsrStore();
  const cachedResult: Ref<T | null> = ref(null);

  // ----- Hooks -----
  onServerPrefetch(async () => {
    const serverSideResult: ApolloQueryResult<T> = await executeQuery(
      query,
      variables
    );
    if (!serverSideResult.data) {
      return;
    }
    cachedResult.value = serverSideResult.data;
    $ssrStore.setPrefetchedData({
      key: query.cacheLocation,
      value: cachedResult.value,
    });
  });

  onBeforeMount(() => {
    const apolloClient = useApolloClient().resolveClient();
    const currentCacheState: T | null = apolloClient.readQuery({
      query: query.query,
      variables,
    });
    // Test if the query is already in the cache
    if (
      !currentCacheState ||
      (Array.isArray(currentCacheState) &&
        Object.values(currentCacheState).length === 0)
    ) {
      cachedResult.value = $ssrStore.getPrefetchedData(
        query.cacheLocation
      ) as T | null;

      // SPA
      if (
        !cachedResult.value ||
        (Array.isArray(cachedResult.value) && cachedResult.value.length === 0)
      ) {
        void executeQuery<T>(query, variables).then((fetchedRes) => {
          if (fetchedRes.data) {
            cachedResult.value = fetchedRes.data;
          }
        });
      } else {
        // SSR
        apolloClient.writeQuery({
          query: query.query,
          variables,
          data: {
            [query.cacheLocation]: cachedResult.value,
          },
        });
      }
    }

    apolloClient.watchQuery({ query: query.query, variables }).subscribe({
      next(value: ApolloQueryResult<Record<string, T>>) {
        cachedResult.value = value.data[query.cacheLocation];
      },
    });
  });
  return {
    loading: false,
    data: cachedResult,
  } as ApolloQueryResult<Ref<T | null>>;
}
