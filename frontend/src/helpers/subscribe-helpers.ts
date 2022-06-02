import {computed, ComputedRef, Ref} from 'vue';
import {User} from 'src/data/types/User';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {ALL_USERS} from 'src/data/queries/USER';
import {mapUsers} from 'src/helpers/mapping-helpers';

/**
 * This file contains all helper functions for subscribing to data using GraphQL queries
 */


/**
 * Subscribe to all users
 * @return {ComputedRef<User[]>} - Computed reference to an array containing all the users
 */
export function subscribeToUserProjects(
): ComputedRef<User[]> {
  const queryResult = subscribeToQuery(ALL_USERS) as Ref<
    Record<string, unknown>[]
    >;
  return computed(() => mapUsers(queryResult.value ?? []));
}
