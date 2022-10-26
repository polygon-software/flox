import { QueryObject } from 'src/apollo/query';
import { AllQuery } from 'src/flox/modules/all.query';
import { useApolloClient } from '@vue/apollo-composable';

/**
 * Forces a full re-fetch all queries affected by a mutation by removing them from cache
 * @param tables - tables that should be invalidated
 */
export function invalidateTables(tables: string[]): void {
  const affectedQueries: QueryObject[] = [];

  AllQuery.forEach((query) => {
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
