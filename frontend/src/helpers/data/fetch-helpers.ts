import {executeQuery} from 'src/helpers/data/data-helpers';
import {mapUser} from 'src/helpers/data/mapping-helpers';
import {MY_USER} from 'src/data/queries/USER';
import {User} from 'src/data/types/User';

/**
 * This file contains all helper functions for fetching data using GraphQL queries
 */

/**
 * Fetch the logged-in user
 * @returns {Promise<User|null>} - the logged-in user
 */
export async function fetchMyUser() {
  const user = await executeQuery<User>(MY_USER);
  return user ? mapUser(user) : null;
}
