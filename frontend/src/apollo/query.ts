import CountQuery from 'src/flox/modules/interfaces/entities/count.entity';
import {BaseEntity} from 'src/flox/core/base-entity/entities/BaseEntity';
import {OperationVariables} from '@apollo/client/core/types';
import {ApolloQueryResult} from '@apollo/client';
import {useApolloClient, useQuery} from '@vue/apollo-composable';
import {onBeforeMount, onServerPrefetch, ref, Ref} from 'vue';
import {useSsrStore} from 'stores/ssr';
import {DocumentNode} from 'graphql';

// Interface definitions as used in constant files (e.g. QUERIES.ts, DEALERSHIP.ts)
export interface QueryObject {
  query: DocumentNode,             // Actual GraphQL query
  tables: string[],       // Affected Tables
  cacheLocation: string,  // Location in cache (actual GraphQL query name)
}

/**
 * Executes a given GraphQL query object
 * @param {QueryObject} queryObject - the query object constant (from QUERIES.ts)
 * @param {OperationVariables} [variables] - variables to pass to the query, if any
 * @returns {ApolloQueryResult<Record<string, unknown[]>>} - the query's output
 */
export async function executeQuery<T extends CountQuery<any> | BaseEntity | BaseEntity[]>(
  queryObject: QueryObject,
  variables?: OperationVariables
): Promise<ApolloQueryResult<T>> {
  const queryResult = useQuery<Record<string, T>>(queryObject.query, variables ?? {});

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
 * @param {QueryObject} query - the graphQL query object
 * @param {OperationVariables} [variables] - any variables to pass to the query
 * @returns {ApolloQueryResult<Ref<T|null>>} - the query's output
 */
export function subscribeToQuery<T extends CountQuery<any> | BaseEntity | BaseEntity[]>(
  query: QueryObject,
  variables?: OperationVariables
): ApolloQueryResult<Ref<T>> {
  const $ssrStore = useSsrStore();
  const cachedResult: Ref<T|null> = ref(null);

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
    $ssrStore.setPrefetchedData({ key: query.cacheLocation, value: cachedResult.value });
  });

  onBeforeMount(() => {
    const apolloClient = useApolloClient().resolveClient();
    const currentCacheState: T | null = apolloClient.readQuery({ query: query.query, variables });
    // Test if the query is already in the cache
    if (!currentCacheState || Array.isArray(currentCacheState) && Object.values(currentCacheState).length === 0) {
      cachedResult.value = $ssrStore.getPrefetchedData(query.cacheLocation) as T | null;

      // SPA
      if (!cachedResult.value || Array.isArray(cachedResult.value) && cachedResult.value.length === 0) {
        void executeQuery<T>(query, variables)
          .then((fetchedRes) => {
              if (fetchedRes.data) {
                cachedResult.value = fetchedRes.data;
              }
            }
          );
      } else {
        // SSR
        apolloClient.writeQuery({
          query: query.query,
          variables: variables,
          data: {
            [query.cacheLocation]: cachedResult.value,
          },
        });
      }
    }

    apolloClient
      .watchQuery({ query: query.query, variables: variables })
      .subscribe({
        next(value: ApolloQueryResult<Record<string, T>>) {
          cachedResult.value = value.data[query.cacheLocation];
        },
      });
  });
  return {
    loading: false,
    data: cachedResult,
  } as ApolloQueryResult<Ref<T>>;
}

