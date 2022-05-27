import {executeQuery} from 'src/helpers/data-helpers';
import {mapUser} from 'src/helpers/mapping-helpers';
import {MY_USER} from 'src/data/queries/USER';

/**
 * This file contains all helper functions for fetching data using GraphQL queries
 */

/**
 * Fetch the logged-in user.
 * @returns {Promise<User|null>} - the logged in user
 */
export async function fetchMyUser() {
  const queryResult = await executeQuery(MY_USER);
  const user = (
    queryResult.data ? queryResult.data[MY_USER.cacheLocation] : null
  ) as Record<string, unknown> | null;
  return user ? mapUser(user) : null;
}
