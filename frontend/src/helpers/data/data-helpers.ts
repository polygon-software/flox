import { useApolloClient, useMutation, useQuery } from '@vue/apollo-composable';
import {
  MutationObject,
  MutationTypes,
  QueryObject,
} from 'src/data/DATA-DEFINITIONS';
import { ApolloQueryResult, FetchResult } from '@apollo/client';
import {onBeforeMount, onServerPrefetch, Ref, ref} from 'vue';
import { i18n } from 'boot/i18n';
import { QUERIES } from 'src/data/queries/QUERIES';
import { useSsrStore } from 'stores/ssr';
import {BaseEntity} from 'src/data/types/BaseEntity';
import CountQuery from 'src/data/types/CountEntity';
import {OperationVariables} from '@apollo/client/core/types';

/**
 * This file contains a collection of helper functions for querying and mutating data using GraphQL/Apollo.
 */

/**
 * Executes a given GraphQL query object
 * @param {QueryObject} queryObject - the query object constant (from QUERIES.ts)
 * @param {OperationVariables} [variables] - variables to pass to the query, if any
 * @returns {ApolloQueryResult<Record<string, unknown[]>>} - the query's output
 */
async function executeQuery<T extends CountQuery<any> | BaseEntity | BaseEntity[]>(
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
 * Forces a full re-fetch all queries affected by a mutation by removing them from cache
 * @param {string[]} tables - tables that should be invalidated
 * @returns {void}
 */
function invalidateTables(tables: string[]) {
  const affectedQueries: QueryObject[] = [];

  QUERIES.forEach((query) => {
    // If any of the mutation's affected tables are relevant to query, add to list of affected queries
    if (tables.some((t) => query.tables.indexOf(t) >= 0)) {
      affectedQueries.push(query);
    }
  });
  const apolloClient = useApolloClient();
  const cache = apolloClient.client.cache;

  for (const queryObject of affectedQueries) {
    // Evict query from cache
    if (queryObject.cacheLocation) {
      cache.evict({
        fieldName: queryObject.cacheLocation,
      });
    }
  }
}

/**
 * Executes a given GraphQL mutation object, automatically handling cache by re-fetching affected queries
 * @param {MutationObject} mutationObject - the mutation object constant (from MUTATIONS.ts)
 * @param {OperationVariables} variables - any variables that shall be passed to the mutation
 * @returns {Promise<FetchResult<T | null> | null>} Returns the values defined by the mutation
 */
async function executeMutation<T extends BaseEntity>(
  mutationObject: MutationObject,
  variables: OperationVariables
): Promise<FetchResult<T | null>> {
  const mutation = mutationObject.mutation;


  // Actually execute mutation and handle cache
  const { mutate } = useMutation<Record<string, T> | null>(mutation, () => ({
    // Get cache and the new or deleted object
    update: () => {
      // Re-fetch all affected queries
      invalidateTables(mutationObject.tables);
    },
  }));
  // Execute mutation
  const mutationResult = await mutate(variables);
  if (mutationResult && mutationResult.data) {
    return {
      data: mutationResult.data[mutationObject.cacheLocation],
    } as FetchResult<T>;
  }
  return {
    data: null,
  };
}

/**
 * Subscribes to a graphQL query
 * @param {QueryObject} query - the graphQL query object
 * @param {OperationVariables} [variables] - any variables to pass to the query
 * @returns {ApolloQueryResult<Ref<T|null>>} - the query's output
 */
function subscribeToQuery<T extends CountQuery<any> | BaseEntity | BaseEntity[]>(
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

export { executeQuery, executeMutation, subscribeToQuery, invalidateTables };
